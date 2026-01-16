import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { markAttendanceSchema } from "../../schemas/attendanceSchema";
import {
  sendValidationError,
  sendNotFoundSessionError,
  sendSessionFinalizedError,
  sendForbiddenOwnershipError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";
import {
  getLiveSession,
  getLiveSessionAttendance,
  updateLiveSessionAttendance,
  isLiveSession,
  setLiveSession,
} from "../../utils/sessionRedis";

const markAttendance = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    const { id } = req.params;

    // Validate request body
    const validationResult = markAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const { attendance } = validationResult.data;

    // Check if session is live in Redis
    const isLive = await isLiveSession(id);
    
    if (isLive) {
      const liveSession = await getLiveSession(id);
      
      if (!liveSession) {
        return sendNotFoundSessionError(res);
      }

      // Check if finalized
      if (liveSession.isFinalized) {
        return sendSessionFinalizedError(res);
      }

      // Check permissions
      const isOwner = liveSession.ownerTeacherId === currentUserId;
      
      if (!isOwner) {
        const userManagedTeachers = await prisma.managedUser.findMany({
          where: {
            ownerId: currentUserId,
            role: 'teacher'
          }
        });
        const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
        const isTeacherMember = liveSession.teacherId && managedTeacherIds.includes(liveSession.teacherId);

        if (!isTeacherMember) {
          return sendForbiddenOwnershipError(res);
        }
      }

      // Get current attendance from Redis
      const currentAttendance = await getLiveSessionAttendance(id) || {};

      // Merge new attendance with existing
      const updatedAttendance = {
        ...currentAttendance,
        ...attendance
      };

      // Update attendance in Redis
      await updateLiveSessionAttendance(id, updatedAttendance, 86400);

      // Update live session data
      const updatedSession = {
        ...liveSession,
        attendance: updatedAttendance,
        updatedAt: new Date().toISOString(),
      };

      await setLiveSession(id, updatedSession, 86400);

      // Also update database
      await prisma.classSession.update({
        where: { id },
        data: {
          attendance: updatedAttendance
        }
      });

      return sendSuccessResponse(res, {
        sessionId: id,
        attendance: updatedAttendance,
      });
    }

    // If not live, check database
    const session = await prisma.classSession.findUnique({
      where: { id }
    });

    if (!session) {
      return sendNotFoundSessionError(res);
    }

    // Check if finalized
    if (session.isFinalized) {
      return sendSessionFinalizedError(res);
    }

    // Check permissions
    const isOwner = session.ownerTeacherId === currentUserId;
    
    if (!isOwner) {
      const userManagedTeachers = await prisma.managedUser.findMany({
        where: {
          ownerId: currentUserId,
          role: 'teacher'
        }
      });
      const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
      const isTeacherMember = session.teacherId && managedTeacherIds.includes(session.teacherId);

      if (!isTeacherMember) {
        return sendForbiddenOwnershipError(res);
      }
    }

    // Get current attendance
    const currentAttendance = (session.attendance as Record<string, string>) || {};

    // Merge new attendance with existing
    const updatedAttendance = {
      ...currentAttendance,
      ...attendance
    };

    // Update session in database
    await prisma.classSession.update({
      where: { id },
      data: {
        attendance: updatedAttendance
      }
    });

    return sendSuccessResponse(res, {
      sessionId: id,
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default markAttendance;
