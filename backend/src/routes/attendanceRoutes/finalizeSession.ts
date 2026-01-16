import { Request, Response } from "express";
import { prisma } from "../../config/database";
import {
  sendNotFoundSessionError,
  sendSessionFinalizedError,
  sendForbiddenOwnershipError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";
import {
  getLiveSession,
  getLiveSessionAttendance,
  deleteLiveSession,
  isLiveSession,
} from "../../utils/sessionRedis";

const finalizeSession = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    const { id } = req.params;

    // Check if session is live in Redis
    const isLive = await isLiveSession(id);
    
    if (isLive) {
      const liveSession = await getLiveSession(id);
      
      if (!liveSession) {
        return sendNotFoundSessionError(res);
      }

      // Check if already finalized
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

      // Get attendance from Redis
      const attendance = await getLiveSessionAttendance(id) || liveSession.attendance || {};

      // Update session in database - finalize it
      const finalizedSession = await prisma.classSession.update({
        where: { id },
        data: {
          endTime: liveSession.endTime ? new Date(liveSession.endTime) : new Date(),
          summary: liveSession.summary,
          attendance: attendance,
          isFinalized: true,
        },
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
        }
      });

      // Delete from Redis (session is now finalized and stored in DB)
      await deleteLiveSession(id);

      return sendSuccessResponse(res, finalizedSession);
    }

    // If not live, check database
    const session = await prisma.classSession.findUnique({
      where: { id }
    });

    if (!session) {
      return sendNotFoundSessionError(res);
    }

    // Check if already finalized
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

    // Finalize session in database
    const finalizedSession = await prisma.classSession.update({
      where: { id },
      data: {
        endTime: session.endTime || new Date(),
        isFinalized: true,
      },
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
      }
    });

    return sendSuccessResponse(res, finalizedSession);
  } catch (error) {
    console.error("Error finalizing session:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default finalizeSession;
