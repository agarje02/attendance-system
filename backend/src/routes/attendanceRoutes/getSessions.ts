import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { getSessionsQuerySchema } from "../../schemas/attendanceSchema";
import {
  sendValidationError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";

const getSessions = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    // Validate query parameters
    const validationResult = getSessionsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const { classId, isFinalized, teacherId, ownerTeacherId } = validationResult.data;

    // Build where clause
    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (isFinalized !== undefined) {
      where.isFinalized = isFinalized;
    }

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (ownerTeacherId) {
      where.ownerTeacherId = ownerTeacherId;
    }

    // If user is not filtering by their own sessions, filter to only show sessions they have access to
    if (!ownerTeacherId || ownerTeacherId !== currentUserId) {
      // Get user's managed teachers
      const userManagedTeachers = await prisma.managedUser.findMany({
        where: {
          ownerId: currentUserId,
          role: 'teacher'
        }
      });
      const managedTeacherIds = userManagedTeachers.map(mu => mu.id);

      // Build access conditions
      const accessConditions: any[] = [
        { ownerTeacherId: currentUserId }
      ];

      if (managedTeacherIds.length > 0) {
        accessConditions.push({ teacherId: { in: managedTeacherIds } });
      }

      // If classId is not specified, filter by accessible classes
      if (!classId) {
        const userClasses = await prisma.class.findMany({
          where: {
            OR: [
              { ownerId: currentUserId },
              {
                members: {
                  some: {
                    userId: { in: managedTeacherIds },
                    role: 'teacher',
                    status: 'approved'
                  }
                }
              }
            ]
          },
          select: { id: true }
        });
        const accessibleClassIds = userClasses.map(c => c.id);
        
        if (accessibleClassIds.length > 0) {
          accessConditions.push({ classId: { in: accessibleClassIds } });
        } else {
          // User has no accessible classes, return empty result
          return sendSuccessResponse(res, []);
        }
      }

      // Apply access filter
      where.OR = accessConditions;
    }

    // Fetch sessions
    const sessions = await prisma.classSession.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            className: true,
          }
        },
        teacher: {
          select: {
            id: true,
            username: true,
          }
        }
      },
      orderBy: {
        scheduledTime: 'desc'
      }
    });

    return sendSuccessResponse(res, sessions);
  } catch (error) {
    console.error("Error getting sessions:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default getSessions;
