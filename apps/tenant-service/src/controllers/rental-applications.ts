import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { RentalApplicationsModel, TenantsModel } from "../models";
import { RentalApplicationValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  nullifyExceptionAsync,
  paginate,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { ID_GEN_CONFIG } from "@/utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { Listing, Person } from "@/types";
import { Tenant } from "dist/prisma";

export const getRentalApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof RentalApplicationsModel.findMany>[0];
    const filters: Args = {
      where: { voided: false },
    };
    const results = await RentalApplicationsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await RentalApplicationsModel.count(
      pick(filters, "where")
    );
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalApplicationsModel.findUniqueOrThrow({
      where: { id: req.params.applicationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationValidator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const {
      listingId,
      coApplicants = [],
      references = [],
      personId,
    } = validation.data;
    // generate id
    const { identifier } = await serviceClient.callService<{
      identifier: string;
    }>("@hive/policy-engine-service", {
      url: "/id-gen",
      method: "POST",
      data: { ...ID_GEN_CONFIG.application },
      headers: sanitizeHeaders(req),
    });
    // validate listing
    const getListing = nullifyExceptionAsync(() =>
      serviceClient.callService<Listing>("@hive/listings-service", {
        url: `/listings/${listingId}`,
        method: "GET",
        params: {
          v: "custom:select(id,propertyId,organizationId,organization,title,status,type,price,listedDate,coverImage,expiryDate)",
        },
        headers: sanitizeHeaders(req),
      })
    );
    const listing = await getListing();

    if (!listing || listing.status !== "APPROVED")
      throw new APIException(400, {
        listingId: {
          _errors: ["Inavlid listing (Either dont exist or not applicable)"],
        },
      });
    // Validate applicant person
    const getPerson = nullifyExceptionAsync((id: string) =>
      serviceClient.callService<Person>("@hive/authentication-service", {
        url: `/person/${id}`,
        method: "GET",
        headers: sanitizeHeaders(req),
      })
    );
    const person = await getPerson(personId);
    if (!person)
      throw new APIException(400, {
        personId: { _errors: ["Invalid person"] },
      });
    // Validate co applicants
    const validPersons: Array<Person> = [];
    for (let index = 0; index < coApplicants.length; index++) {
      const ca = coApplicants[index];
      const tenant = await getPerson(ca!.personId!);
      if (!tenant)
        throw new APIException(400, {
          coApplicants: {
            _errors: ["one or more invalid coapplicant"],
            index: {
              _errors: ["Invalid co-applicant"],
              personId: {
                _errors: ["Invalid co-applicant"],
              },
            },
          },
        });
      validPersons.push(tenant);
    }
    const item = await RentalApplicationsModel.create({
      data: {
        ...validation.data,
        applicationNumber: identifier,
        listingId,
        organizationId: listing.organizationId,
        propertyId: listing.propertyId,
        coApplicants: validPersons.length
          ? {
              createMany: {
                skipDuplicates: true,
                data: coApplicants.map((ca, index) => ({
                  relationshipType: ca.relationshipType,
                  personId: validPersons[index]!.id,
                })),
              },
            }
          : undefined,
        references: references.length
          ? { createMany: { skipDuplicates: true, data: references } }
          : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationValidator.omit({
      coApplicants: true,
      references: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RentalApplicationsModel.update({
      where: { id: req.params.applicationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationValidator.omit({
      coApplicants: true,
      references: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RentalApplicationsModel.update({
      where: { id: req.params.applicationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalApplicationsModel.update({
      where: { id: req.params.applicationId, voided: false },
      data: {
        voided: true,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeRentalApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalApplicationsModel.delete({
      where: { id: req.params.applicationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
