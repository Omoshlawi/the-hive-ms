import serviceClient from "@/services/service-client";
import { Listing, Person } from "@/types";
import { ID_GEN_CONFIG } from "@/utils";
import { TenancyApplicationValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  nullifyExceptionAsync,
  paginate,
} from "@hive/core-utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { TenancyApplicationsModel } from "../models";

export const getTenancyApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof TenancyApplicationsModel.findMany>[0];
    const filters: Args = {
      where: {
        voided: false,
        organizationId: req?.context?.organizationId,
        personId: !req?.context?.organizationId
          ? req.user?.person?.id
          : undefined,
      },
    };
    const results = await TenancyApplicationsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await TenancyApplicationsModel.count(
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

export const getTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenancyApplicationsModel.findUniqueOrThrow({
      where: { id: req.params.applicationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenancyApplicationValidator.safeParseAsync(
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
    // generate id
    const { identifier } = await serviceClient.callService<{
      identifier: string;
    }>("@hive/policy-engine-service", {
      url: "/id-gen",
      method: "POST",
      data: { ...ID_GEN_CONFIG.application },
      headers: sanitizeHeaders(req),
    });
    const item = await TenancyApplicationsModel.create({
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
                  person: validPersons[index],
                })),
              },
            }
          : undefined,
        references: references.length
          ? { createMany: { skipDuplicates: true, data: references } }
          : undefined,
        person,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenancyApplicationValidator.omit({
      coApplicants: true,
      references: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenancyApplicationsModel.update({
      where: { id: req.params.applicationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenancyApplicationValidator.omit({
      coApplicants: true,
      references: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenancyApplicationsModel.update({
      where: { id: req.params.applicationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenancyApplicationsModel.update({
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

export const purgeTenancyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenancyApplicationsModel.delete({
      where: { id: req.params.applicationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
