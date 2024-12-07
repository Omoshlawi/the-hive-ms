import { AccountModel, UsersModel } from "@/models";
import { Login, Register } from "@/schema";
import { TokenPayload } from "@/types";
import { configuration, registryAddress, serviceIdentity } from "@/utils";
import {
  checkPassword,
  generateUserToken,
  hashPassword,
} from "@/utils/helpers";
import { APIException, ServiceClient } from "@hive/core-utils";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";
import { sanitizeHeaders } from "@hive/shared-middlewares";

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
    const token = generateUserToken({
      userId: user.id,
      // personId: user.person?.id,
    });
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .cookie(
        configuration.authCookieConfig.name,
        token.accessToken,
        configuration.authCookieConfig.config
      )
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
          identifier: { _errors: ["Invalid user credentials"] },
          password: { _errors: ["Invalid user credentials"] },
        },
      };
    const user = users[passwordChecks.findIndex((val) => val)];
    const token = generateUserToken({
      userId: user.id,
      // personId: user.person?.id,
    });
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .cookie(
        configuration.authCookieConfig.name,
        token.accessToken,
        configuration.authCookieConfig.config
      )
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.header("x-refresh-token");
    if (!refreshToken)
      throw new APIException(401, { detail: "Unauthorized - Token missing" });
    const {
      userId,
      organizationId,
      type: tokenType,
    }: TokenPayload = verify(
      refreshToken,
      configuration.auth.auth_secrete as string
    ) as TokenPayload;
    let roles: string[] | string | undefined;
    if (tokenType !== "refresh")
      throw new APIException(401, {
        detail: "Unauthorized - Invalid token type",
      });
    const user = await UsersModel.findUnique({
      where: { id: userId },
      include: { person: true },
    });
    if (!user)
      throw new APIException(401, { detail: "Unauthorized - Invalid Token" });
    // Assertain user membership to organization and roles on the membership
    if (organizationId) {
      const serviceClient = new ServiceClient(registryAddress, serviceIdentity);

      const response = await serviceClient.callService<{
        results: Array<{ membershipRoles: Array<any>; isAdmin: boolean }>;
      }>("@hive/policy-engine-service", {
        method: "GET",
        url: `/organization-membership`,
        params: {
          memberUserId: user?.id,
          organizationId,
          v: "custom:include(membershipRoles)",
        },
      });
      if (!response.results.length) {
        throw new APIException(401, { detail: "Unauthorized - Invalid Token" });
      }
      // incase the role have changed, getting current ones nd setting to token
      if (response.results[0].isAdmin) roles = "*";
      else roles = response.results[0].membershipRoles.map((r) => r.roleId);
    }
    const token = generateUserToken({ userId: user.id, organizationId, roles });
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .cookie(
        configuration.authCookieConfig.name,
        token.accessToken,
        configuration.authCookieConfig.config
      )
      .json(token);
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return next(
        new APIException(401, { detail: "Unauthorized - Token expired" })
      );
    } else if (error instanceof JsonWebTokenError) {
      return next(
        new APIException(401, { detail: "Unauthorized - Invalid Token" })
      );
    } else if (error instanceof APIException) {
      return next(error);
    }
    return next(new APIException(500, { detail: "Internal Server Error" }));
  }
};

export const changeOrganizationContext = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.organizationId;
    let roles: string[] | string | undefined;
    const user = req.user!;
    // Assertain user membership to organization and roles on the membership
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const response = await serviceClient.callService<{
      results: Array<{ membershipRoles: Array<any>; isAdmin: boolean }>;
    }>("@hive/policy-engine-service", {
      method: "GET",
      url: `/organization-membership`,
      params: {
        memberUserId: user?.id,
        organizationId,
        v: "custom:include(membershipRoles)",
      },
      headers: sanitizeHeaders(req),
    });
    if (!response.results.length) {
      throw new APIException(404, { detail: "Organization not found" });
    }
    if (response.results[0].isAdmin) roles = "*";
    else roles = response.results[0].membershipRoles.map((r) => r.roleId);
    const token = generateUserToken({ userId: user.id, organizationId, roles });
    return res
      .setHeader("x-access-token", token.accessToken)
      .setHeader("x-refresh-token", token.refreshToken)
      .cookie(
        configuration.authCookieConfig.name,
        token.accessToken,
        configuration.authCookieConfig.config
      )
      .json(token);
  } catch (error: any) {
    return next(error);
  }
};
