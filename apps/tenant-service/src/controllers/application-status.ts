import {
  RentalApplicationsModel,
  RentalApplicationStatusHistoryModel,
} from "@/models";
import { RentalApplicationStatusValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
export const getApplicationStatusHistorys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<
      typeof RentalApplicationStatusHistoryModel.findMany
    >[0];
    const filters: Args = {
      where: {
        applicationId: req.params.applicationId,
      },
    };
    const results = await RentalApplicationStatusHistoryModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await RentalApplicationStatusHistoryModel.count(
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

export const submitDraftApplicationForReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationStatusValidator.omit({
      status: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { reason } = validation.data;
    const application = await RentalApplicationsModel.findFirstOrThrow({
      where: { id: req.params.applicationId },
    });
    if (application.status !== "DRAFT")
      throw new APIException(400, { status: ["Invalid status"] });
    await RentalApplicationsModel.update({
      where: { id: req.params.applicationId },
      data: {
        status: "PENDING",
      },
    });
    const item = await RentalApplicationStatusHistoryModel.create({
      data: {
        applicationId: req.params.applicationId!,
        previousStatus: application.status,
        newStatus: "PENDING",
        reason,
        changedBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
export const approvePendingApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationStatusValidator.omit({
      status: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { reason } = validation.data;
    const application = await RentalApplicationsModel.findFirstOrThrow({
      where: { id: req.params.applicationId },
    });
    if (application.status !== "PENDING")
      throw new APIException(400, { status: ["Invalid status"] });
    await RentalApplicationsModel.update({
      where: { id: req.params.applicationId },
      data: {
        status: "APPROVED",
      },
    });
    const item = await RentalApplicationStatusHistoryModel.create({
      data: {
        applicationId: req.params.applicationId!,
        previousStatus: application.status,
        newStatus: "APPROVED",
        reason,
        changedBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
export const rejectPendingApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationStatusValidator.omit({
      status: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { reason } = validation.data;
    const application = await RentalApplicationsModel.findFirstOrThrow({
      where: { id: req.params.applicationId },
    });
    if (application.status !== "PENDING")
      throw new APIException(400, { status: ["Invalid status"] });
    await RentalApplicationsModel.update({
      where: { id: req.params.applicationId },
      data: {
        status: "REJECTED",
      },
    });
    const item = await RentalApplicationStatusHistoryModel.create({
      data: {
        applicationId: req.params.applicationId!,
        previousStatus: application.status,
        newStatus: "REJECTED",
        reason,
        changedBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
export const withdrawApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationStatusValidator.omit({
      status: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { reason } = validation.data;
    const application = await RentalApplicationsModel.findFirstOrThrow({
      where: { id: req.params.applicationId },
    });
    await RentalApplicationsModel.update({
      where: { id: req.params.applicationId },
      data: {
        status: "WITHDRAWN",
      },
    });
    const item = await RentalApplicationStatusHistoryModel.create({
      data: {
        applicationId: req.params.applicationId!,
        previousStatus: application.status,
        newStatus: "WITHDRAWN",
        reason,
        changedBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalApplicationStatusValidator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { reason, status } = validation.data;
    const application = await RentalApplicationsModel.findFirstOrThrow({
      where: { id: req.params.applicationId },
    });
    if (application.status === status)
      throw new APIException(400, { status: ["Invalid status"] });
    await RentalApplicationsModel.update({
      where: { id: req.params.applicationId },
      data: {
        status,
      },
    });
    const item = await RentalApplicationStatusHistoryModel.create({
      data: {
        applicationId: req.params.applicationId!,
        previousStatus: application.status,
        newStatus: status,
        reason,
        changedBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
