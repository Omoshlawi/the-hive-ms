import { NextFunction, Request, Response } from "express";
import { AppointmentParticipantsModel } from "../models";
import { AppointmentParticipantValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import pick from "lodash/pick";

export const getAppointmentParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    type Args = Parameters<typeof AppointmentParticipantsModel.findMany>[0];
    const filters: Args = { where: { appointmentId } };
    const results = await AppointmentParticipantsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await AppointmentParticipantsModel.count(
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

export const getAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const item = await AppointmentParticipantsModel.findUniqueOrThrow({
      where: { id: req.params.participantId, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId!;
    const validation = await AppointmentParticipantValidator.omit({
      appointmentId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentParticipantsModel.create({
      data: { ...validation.data, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const validation = await AppointmentParticipantValidator.omit({
      appointmentId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentParticipantsModel.update({
      where: { id: req.params.participantId, appointmentId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;
    const validation = await AppointmentParticipantValidator.omit({
      appointmentId: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AppointmentParticipantsModel.update({
      where: { id: req.params.participantId, appointmentId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;

    const item = await AppointmentParticipantsModel.delete({
      where: { id: req.params.participantId, appointmentId },
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

export const purgeAppointmentParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;

    const item = await AppointmentParticipantsModel.delete({
      where: { id: req.params.participantId, appointmentId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
