import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configuration } from ".";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const generateUserToken = (payload: any) => {
  const token = jwt.sign(payload, configuration.jwt as string);
  return token;
};

export const checkPassword = async (hash: string, password: string) => {
  return await bcrypt.compare(password, hash);
};
