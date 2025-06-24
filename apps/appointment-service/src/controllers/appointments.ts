import { NextFunction, Request, Response } from "express";
import { AppointmentsModel } from "../models";
import { AppointmentsValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  nullifyExceptionAsync,
  paginate,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { Person } from "@/types";
import pick from "lodash/pick";

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof AppointmentsModel.findMany>[0];
    const filters: Args = { where: { voided: false } };
    const results = await AppointmentsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await AppointmentsModel.count(pick(filters, "where"));
    return res.json({ results, ...getPaginationControls(req, totalCount) });
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
    const getPerson = nullifyExceptionAsync(async () => {
      const person = await serviceClient.callService<Person>(
        "@hive/authentication-service",
        {
          method: "GET",
          url: `/person/${data.organizerId}`,
        }
      );
      return person;
    });
    const person = await getPerson();
    if (!person)
      throw new APIException(400, {
        organizerId: { _errors: ["Organizer person not found"] },
      });
    const item = await AppointmentsModel.create({
      data: {
        ...data,
        organizer: person as any,
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
