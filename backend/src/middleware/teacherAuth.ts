import { NextFunction, Request, Response } from "express";
import { sendUnauthorizedError, sendForbiddenTeacherError } from "../utils/errorResponse";
import { prisma } from "../config/database";

/**
 * Middleware to ensure the authenticated user has teacher capabilities
 * A user has teacher capabilities if:
 * 1. They own classes (ownerId), OR
 * 2. They manage ManagedUsers with teacher role
 */
const teacherAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // @ts-ignore
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      sendUnauthorizedError(res);
      return;
    }

    // Check if user owns any classes
    const ownedClasses = await prisma.class.findFirst({
      where: { ownerId: currentUserId }
    });

    // Check if user manages any teacher ManagedUsers
    const managedTeachers = await prisma.managedUser.findFirst({
      where: {
        ownerId: currentUserId,
        role: 'teacher'
      }
    });

    if (!ownedClasses && !managedTeachers) {
      sendForbiddenTeacherError(res);
      return;
    }

    next();
  } catch (error) {
    console.error("Error in teacherAuthMiddleware:", error);
    sendForbiddenTeacherError(res);
  }
};

export default teacherAuthMiddleware;
