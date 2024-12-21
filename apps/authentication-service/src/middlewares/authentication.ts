import { UsersModel } from "@/models";
import { TokenPayload } from "@/types";
import { configuration, registryAddress, serviceIdentity } from "@/utils";
import { APIException, ServiceClient } from "@hive/core-utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-access-token");
  try {
    if (!token)
      throw new APIException(401, { detail: "Unauthorized - Token missing" });
    const {
      userId,
      type: tokenType,
      organizationId,
    }: TokenPayload = verify(
      token,
      configuration.auth.auth_secrete as string
    ) as TokenPayload;
    if (tokenType !== "access")
      throw new APIException(401, {
        detail: "Unauthorized - Invalid token type",
      });

    const user = await UsersModel.findUnique({
      where: { id: userId },
      include: { person: true },
    });
    if (!user)
      throw new APIException(401, { detail: "Unauthorized - Invalid Token" });
    // Assertain user membership to organization
    if (organizationId) {
      const serviceClient = new ServiceClient(registryAddress, serviceIdentity);

      const response = await serviceClient.callService<{ results: Array<any> }>(
        "@hive/policy-engine-service",
        {
          method: "GET",
          url: `/organization-membership`,
          params: {
            memberUserId: user?.id,
            organizationId,
            v: "custom:include(membershipRoles)",
          },
          headers: sanitizeHeaders(req),
        }
      );
      if (!response.results.length) {
        throw new APIException(401, { detail: "Unauthorized - Invalid Token" });
      }
    }
    req.user = user;
    return next();
  } catch (error: unknown) {
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

export default authenticate;
