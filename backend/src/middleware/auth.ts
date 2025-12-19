import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { sendUnauthorizedError } from "../utils/errorResponse";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return sendUnauthorizedError(res);
    }
    const decode =  verifyJWT(token);
    if (!decode) {
      return sendUnauthorizedError(res);
    }
    console.log("verified");
    // @ts-ignore
    req.user = decode;
    next();
  } catch {
    return sendUnauthorizedError(res);
  }
};

export default authMiddleware;
