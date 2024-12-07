import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configuration } from ".";
import { Person, User } from "../../dist/prisma";
import { TokenPayload } from "@/types";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export function generateUserToken(payload: {
  userId: string;
  organizationId?: string;
  roles?: string[] | string;
  // personId?: string;
}) {
  const accessPayload: TokenPayload = {
    ...payload,
    type: "access",
  };
  const refreshPayload: TokenPayload = { ...payload, type: "refresh" };
  const accessToken = jwt.sign(accessPayload, configuration.auth.auth_secrete, {
    expiresIn: configuration.auth.access_token_age,
  });
  const refreshToken = jwt.sign(
    refreshPayload,
    configuration.auth.auth_secrete,
    {
      expiresIn: configuration.auth.refresh_token_age,
    }
  );
  return { accessToken, refreshToken };
}

export const checkPassword = async (hash: string, password: string) => {
  return await bcrypt.compare(password, hash);
};
