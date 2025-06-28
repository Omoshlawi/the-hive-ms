import { IdentifierSequenceModel } from "@/models";
import { IdGenSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { pick } from "lodash";

function padNumber(n: number, width: number) {
  return n.toString().padStart(width, "0");
}

export const generateIdentifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IdGenSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { dataModel, prefix, width } = validation.data;
    let sequence = await IdentifierSequenceModel.findFirst({
      where: { dataModel },
    });
    if (!sequence) {
      sequence = await IdentifierSequenceModel.create({ data: { dataModel } });
    }
    const identifier = `${prefix}-${padNumber(sequence.lastNumber + 1, width)}`;

    // Increment after generation
    await IdentifierSequenceModel.update({
      where: { dataModel },
      data: { lastNumber: { increment: 1 } },
    });

    return res.json({
      sequence,
      identifier,
      prefix,
      width,
    });
  } catch (error) {
    next(error);
  }
};

export const getIdGeneratorSequence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof IdentifierSequenceModel.findMany>[0];
    const filters: Args = {};
    const results = await IdentifierSequenceModel.findMany({
      ...filters,
      ...paginate(req.query),
    });
    const totalCount = await IdentifierSequenceModel.count(
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
