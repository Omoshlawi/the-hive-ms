import { UsersModel } from "@/models";
import { configuration } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-access-token");
  if (!token)
    return res.status(401).json({ detail: "Unauthorized - Token missing" });
  try {
    const { id }: any = verify(token, configuration.auth.auth_secrete as string);
    const user = await UsersModel.findUnique({
      where: { id },
    });
    if (!user) throw new Error("");
    req.user = user;
    return next();
  } catch (err: any) {
    return res.status(401).json({ detail: "Unauthorized - Invalid token" });
  }
};

export default authenticate;
