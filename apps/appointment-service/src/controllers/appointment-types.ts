import { NextFunction, Request, Response } from "express";
import { AppointmentTypesModel } from "../models";
import { AppointmentTypeValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getAppointmentTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await AppointmentTypesModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentTypesModel.findUniqueOrThrow({
      where: { id: req.params.typeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentTypeValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentTypesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentTypeValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentTypesModel.update({
      where: { id: req.params.typeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentTypeValidator.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentTypesModel.update({
      where: { id: req.params.typeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentTypesModel.update({
      where: { id: req.params.typeId, voided: false },
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

export const purgeAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentTypesModel.delete({
      where: { id: req.params.typeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
