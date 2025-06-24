import { NextFunction, Request, Response } from "express";
import { FinancingOptionsModel } from "../models";
import { FinancingOptionSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import pick from "lodash/pick";

export const getFinancingOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof FinancingOptionsModel.findMany>[0];
    const filters: Args = { where: { voided: false } };
    const results = await FinancingOptionsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await FinancingOptionsModel.count(
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

export const getFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await FinancingOptionsModel.findUniqueOrThrow({
      where: { id: req.params.optionId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FinancingOptionSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await FinancingOptionsModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FinancingOptionSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await FinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FinancingOptionSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await FinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await FinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false },
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

export const purgeFinancingOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await FinancingOptionsModel.delete({
      where: { id: req.params.optionId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
