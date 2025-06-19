import { NextFunction, Request, Response } from "express";
import { AppointmentResourcesModel } from "../models";
import { AppointmentResourceValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getAppointmentResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const results = await AppointmentResourcesModel.findMany({
      where: { appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const item = await AppointmentResourcesModel.findUniqueOrThrow({
      where: { id: req.params.resourceId, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId!;

    const validation = await AppointmentResourceValidator.omit({
      appointmentId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentResourcesModel.create({
      data: { ...validation.data, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentResourceValidator.omit({
      appointmentId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentResourcesModel.update({
      where: { id: req.params.resourceId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentResourceValidator.omit({
      appointmentId: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentResourcesModel.update({
      where: { id: req.params.resourceId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const item = await AppointmentResourcesModel.delete({
      where: { id: req.params.resourceId, appointmentId },
      //   data: {
      //     voided: true,
      //   },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeAppointmentResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;

    const item = await AppointmentResourcesModel.delete({
      where: { id: req.params.resourceId, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
