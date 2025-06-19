import { NextFunction, Request, Response } from "express";
import { AppointmentsModel } from "../models";
import { AppointmentsValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await AppointmentsModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentsModel.findUniqueOrThrow({
      where: { id: req.params.appointmentId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentsValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { resources, participants, ...data } = validation.data;
    const item = await AppointmentsModel.create({
      data: {
        ...data,
        createdBy: req.context!.userId!,
        organizationId: req.context!.organizationId!,
        resources: resources
          ? { createMany: { skipDuplicates: true, data: resources } }
          : undefined,
        participants: participants
          ? { createMany: { data: participants, skipDuplicates: true } }
          : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentsValidator.omit({
      resources: true,
      participants: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentsModel.update({
      where: { id: req.params.appointmentId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AppointmentsValidator.omit({
      resources: true,
      participants: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentsModel.update({
      where: { id: req.params.appointmentId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentsModel.update({
      where: { id: req.params.appointmentId, voided: false },
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

export const purgeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AppointmentsModel.delete({
      where: { id: req.params.appointmentId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
