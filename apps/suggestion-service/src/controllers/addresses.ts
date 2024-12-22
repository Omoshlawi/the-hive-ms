import { NextFunction, Request, Response } from "express";
import { AddressesModel, CountiesModel } from "../models";
import { AddressFilterSchema, AddressSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AddressFilterSchema.safeParseAsync(req.query);
    const context = req.context!;
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { search, ...filters } = validation.data;
    const results = await AddressesModel.findMany({
      where: {
        AND: [
          {
            voided: false,
            ...filters,
            organizationId: context.organizationId ?? undefined,
            ownerUserId: !context.organizationId ? context.userId : undefined,
          },
          {
            OR: search
              ? [
                  { name: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                  { village: { contains: search, mode: "insensitive" } },
                  { postalCode: { contains: search, mode: "insensitive" } },
                  { landmark: { contains: search, mode: "insensitive" } },
                  { subCounty: { contains: search, mode: "insensitive" } },
                  { ward: { contains: search, mode: "insensitive" } },
                ]
              : undefined,
          },
        ],
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const context = req.context!;
    const item = await AddressesModel.findUniqueOrThrow({
      where: {
        id: req.params.addressId,
        voided: false,
        // if user has organization context then get for that org only, otherwise get for that user as individual
        organizationId: context.organizationId ?? undefined,
        ownerUserId: !context.organizationId ? context.userId : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AddressSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const location = await CountiesModel.findFirst({
      where: {
        name: validation.data.county,
      },
      select: {
        subCounties: {
          select: { name: true, wards: { select: { name: true } } },
        },
      },
    });
    if (!location)
      throw new APIException(400, {
        county: { _errors: ["County does not exist"] },
      });
    if (
      location.subCounties.findIndex(
        (subCounty) => subCounty.name === validation.data.subCounty
      ) === -1
    )
      throw new APIException(400, {
        subCounty: { _errors: ["Sub County does not exist"] },
      });
    if (
      location.subCounties
        .find((subCounty) => subCounty.name === validation.data.subCounty)
        ?.wards.findIndex((ward) => ward.name === validation.data.ward) === -1
    )
      throw new APIException(400, {
        ward: { _errors: ["Ward does not exist"] },
      });

    const item = await AddressesModel.create({
      data: {
        ...validation.data,
        createdBy: req.context!.userId,
        organizationId: req.context!.organizationId,
        ownerUserId: req.context!.userId,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AddressSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AddressesModel.update({
      where: { id: req.params.addressId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AddressSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AddressesModel.update({
      where: { id: req.params.addressId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AddressesModel.update({
      where: { id: req.params.addressId, voided: false },
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

export const purgeAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AddressesModel.delete({
      where: { id: req.params.addressId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
