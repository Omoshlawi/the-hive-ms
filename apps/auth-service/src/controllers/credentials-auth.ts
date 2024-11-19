import { AccountModel, UsersModel } from "@/models";
import { Login, Register } from "@/schema";
import {
  checkPassword,
  generateUserToken,
  hashPassword,
} from "@/utils/helpers";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await Register.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { password, email, username, phoneNumber } = validation.data;
    const errors: any = {};
    if (await UsersModel.findFirst({ where: { username } }))
      errors["username"] = { _errors: ["User with username exist"] };
    if (await UsersModel.findFirst({ where: { person: { email } } }))
      errors["email"] = { _errors: ["User with email exists"] };
    if (await UsersModel.findFirst({ where: { person: { phoneNumber } } }))
      errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    if (!isEmpty(errors)) throw { status: 400, errors };

    const user = await UsersModel.create({
      data: {
        username,
        password: await hashPassword(password),
        person: {
          create: {
            email,
            phoneNumber,
          },
        },
      },
      include: { person: true },
    });

    await AccountModel.create({
      data: {
        provider: "Credentials",
        type: "credentials",
        userId: user.id,
        // access_token: accessToken,
        // refresh_token: refreshToken,
      },
    });
    const token = generateUserToken(user as any);
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await Login.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { password, identifier } = validation.data;
    const users = await UsersModel.findMany({
      where: {
        OR: [
          { username: identifier },
          { person: { email: identifier } },
          { person: { phoneNumber: identifier } },
        ],
        voided: false,
        accounts: { some: { type: "credentials" } },
      },
      include: { person: true },
    });
    const passwordChecks = await Promise.all(
      users.map((user) => checkPassword(user.password, password))
    );
    if (passwordChecks.every((val) => val === false))
      throw {
        status: 400,
        errors: {
          username: { _errors: ["Invalid username or password"] },
          password: { _errors: ["Invalid username or password"] },
        },
      };
    const user = users[passwordChecks.findIndex((val) => val)];
    const token = generateUserToken(user as any);
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const getUserBytoken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UsersModel.findUnique({
      where: { id: req.user?.id },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.header("x-refresh-token");
  if (!refreshToken)
    return res.status(401).json({ detail: "Unauthorized - Token missing" });
  try {
  } catch (err: any) {
    if (err.status) return res.status(err.status).json({ detail: err.detail });
    return res.status(401).json({ detail: "Unauthorized - Invalid token" });
  }
};