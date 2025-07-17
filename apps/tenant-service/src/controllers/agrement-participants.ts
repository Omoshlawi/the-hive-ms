import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { AgreementParticipantsModel } from "../models";
import { AgreementParticipantValudator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";

export const getAgreementParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    type Args = Parameters<typeof AgreementParticipantsModel.findMany>[0];
    const filters: Args = {
      where: { agreementId },
    };
    const results = await AgreementParticipantsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await AgreementParticipantsModel.count(
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

export const getAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AgreementParticipantsModel.findUniqueOrThrow({
      where: { id: req.params.participantId, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;
    const organizationId = req!.context!.organizationId!;
    const validation = await AgreementParticipantValudator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AgreementParticipantsModel.create({
      data: { ...validation.data, agreementId, organizationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const validation = await AgreementParticipantValudator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AgreementParticipantsModel.update({
      where: { id: req.params.participantId, agreementId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const validation =
      await AgreementParticipantValudator.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AgreementParticipantsModel.update({
      where: { id: req.params.participantId, agreementId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AgreementParticipantsModel.delete({
      where: { id: req.params.participantId, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeAgreementParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AgreementParticipantsModel.delete({
      where: { id: req.params.participantId, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
