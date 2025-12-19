import { NextFunction, Request, Response } from "express";
import { sendUnauthorizedError, sendForbiddenTeacherError } from "../utils/errorResponse";

/**
 * Middleware to ensure the authenticated user is a teacher
 */
const teacherAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // @ts-ignore
  const currentUser = req.user;

  if (!currentUser) {
    sendUnauthorizedError(res);
    return;
  }

  if (currentUser.role !== "teacher") {
    sendForbiddenTeacherError(res);
    return;
  }

  next();
};

export default teacherAuthMiddleware;
