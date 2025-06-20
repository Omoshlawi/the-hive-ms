import { NextFunction, Request, Response } from "express";
import { PersonModel, UsersModel } from "../models";
import {
  PersonFilterSchema,
  PersonSchema,
  PersonUpdateschema,
  PersonUserLinkSchema,
} from "@/schema";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import isEmpty from "lodash/isEmpty";
import { hashPassword } from "@/utils";

export const getPersons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonFilterSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { search, userId } = validation.data;
    const results = await PersonModel.findMany({
      where: {
        AND: [
          { voided: false, userId },
          {
            OR: search
              ? [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { phoneNumber: { contains: search, mode: "insensitive" } },
                  {
                    user: {
                      username: { contains: search, mode: "insensitive" },
                    },
                  },
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

export const getPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PersonModel.findUniqueOrThrow({
      where: { id: req.params.personId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { userLinkStrategy, user, userId, ...personProps } = validation.data;
    if (userLinkStrategy === "existing" && !userId)
      throw new APIException(400, {
        userId: { _errors: ["userId is required for existing user link"] },
      });
    if (userLinkStrategy === "new" && !user)
      throw new APIException(400, {
        user: { _errors: ["user is required for new user link"] },
      });
    const errors: any = {};
    if (userLinkStrategy === "new") {
      const { username } = user!;
      if (await UsersModel.findFirst({ where: { username } }))
        errors["username"] = { _errors: ["User with username exist"] };
    }
    const { email, phoneNumber } = personProps;
    if (await PersonModel.findFirst({ where: { email } }))
      errors["email"] = { _errors: ["User with email exists"] };
    if (await PersonModel.findFirst({ where: { phoneNumber } }))
      errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    if (!isEmpty(errors)) throw { status: 400, errors };

    const item = await PersonModel.create({
      data: {
        ...personProps,
        userId: (userLinkStrategy === "existing" ? userId : undefined) as any,
        user:
          userLinkStrategy === "new"
            ? {
                create: {
                  username: user!.username,
                  isAdmin: user!.isAdmin,
                  password: await hashPassword(user!.password),
                  accounts: {
                    create: {
                      provider: "Credentials",
                      type: "credentials",
                      // access_token: accessToken,
                      // refresh_token: refreshToken,
                    },
                  },
                },
              }
            : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonUpdateschema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { username, ...personProps } = validation.data;
    const errors: any = {};
    if (username) {
      const user = await UsersModel.findFirst({
        where: { person: { id: req.params.personId } },
      });
      if (!user) {
        throw new APIException(400, {
          username: { _errors: ["User not found for the given personId"] },
        });
      }
      if (
        await UsersModel.findFirst({
          where: { username, person: { id: { not: req.params.personId } } },
        })
      )
        errors["username"] = { _errors: ["User with username exist"] };
    }
    const { email, phoneNumber } = personProps;
    if (
      email &&
      (await PersonModel.findFirst({
        where: { email, id: { not: req.params.personId } },
      }))
    )
      errors["email"] = { _errors: ["User with email exists"] };
    if (
      phoneNumber &&
      (await PersonModel.findFirst({
        where: { phoneNumber, id: { not: req.params.personId } },
      }))
    )
      errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    if (!isEmpty(errors)) throw { status: 400, errors };

    const item = await PersonModel.update({
      where: { id: req.params.personId },
      data: {
        ...personProps,
        user: username
          ? {
              update: {
                where: { person: { id: req.params.personId! } },
                data: {
                  username,
                },
              },
            }
          : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonUpdateschema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { username, ...personProps } = validation.data;
    const errors: any = {};
    if (username) {
      const user = await UsersModel.findFirst({
        where: { person: { id: req.params.personId } },
      });
      if (!user) {
        throw new APIException(400, {
          username: { _errors: ["User not found for the given personId"] },
        });
      }
      if (
        await UsersModel.findFirst({
          where: { username, person: { id: { not: req.params.personId } } },
        })
      )
        errors["username"] = { _errors: ["User with username exist"] };
    }
    const { email, phoneNumber } = personProps;
    if (
      email &&
      (await PersonModel.findFirst({
        where: { email, id: { not: req.params.personId } },
      }))
    )
      errors["email"] = { _errors: ["User with email exists"] };
    if (
      phoneNumber &&
      (await PersonModel.findFirst({
        where: { phoneNumber, id: { not: req.params.personId } },
      }))
    )
      errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    if (!isEmpty(errors)) throw { status: 400, errors };

    const item = await PersonModel.update({
      where: { id: req.params.personId },
      data: {
        ...personProps,
        user: username
          ? {
              update: {
                where: { person: { id: req.params.personId! } },
                data: {
                  username,
                },
              },
            }
          : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PersonModel.update({
      where: { id: req.params.personId, voided: false },
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

export const purgePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PersonModel.delete({
      where: { id: req.params.personId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const linkUserToPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonUserLinkSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const person = await PersonModel.findUniqueOrThrow({
      where: { id: req.params.personId },
    });
    if (person.userId)
      throw new APIException(400, {
        userId: { _errors: ["Person already linked to a user"] },
      });
    const item = await PersonModel.update({
      where: { id: req.params.personId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
