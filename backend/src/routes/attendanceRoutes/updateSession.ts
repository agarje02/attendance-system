import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { classSessionUpdateSchema } from "../../schemas/attendanceSchema";
import {
  sendValidationError,
  sendNotFoundSessionError,
  sendSessionFinalizedError,
  sendForbiddenOwnershipError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";
import { getLiveSession, setLiveSession, isLiveSession } from "../../utils/sessionRedis";

type ManagedUser = Awaited<ReturnType<typeof prisma.managedUser.findMany>>[number];

const updateSession = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    const { id } = req.params;

    // Validate request body
    const validationResult = classSessionUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const updateData = validationResult.data;

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
        const managedTeacherIds = userManagedTeachers.map((mu: ManagedUser) => mu.id);
        const isTeacherMember = liveSession.teacherId && managedTeacherIds.includes(liveSession.teacherId);

        if (!isTeacherMember) {
          return sendForbiddenOwnershipError(res);
        }
      }

      // Update live session in Redis
      const updatedSession = {
        ...liveSession,
        ...(updateData.startTime !== undefined && {
          startTime: typeof updateData.startTime === 'string' 
            ? new Date(updateData.startTime).toISOString() 
            : updateData.startTime?.toISOString() || null
        }),
        ...(updateData.endTime !== undefined && {
          endTime: typeof updateData.endTime === 'string' 
            ? new Date(updateData.endTime).toISOString() 
            : updateData.endTime?.toISOString() || null
        }),
        ...(updateData.summary !== undefined && { summary: updateData.summary }),
        ...(updateData.attendance !== undefined && { attendance: updateData.attendance }),
        ...(updateData.isFinalized !== undefined && { isFinalized: updateData.isFinalized }),
        updatedAt: new Date().toISOString(),
      };

      await setLiveSession(id, updatedSession, 86400);

      // Also update database
      await prisma.classSession.update({
        where: { id },
        data: {
          ...(updateData.startTime !== undefined && {
            startTime: typeof updateData.startTime === 'string' 
              ? new Date(updateData.startTime) 
              : updateData.startTime
          }),
          ...(updateData.endTime !== undefined && {
            endTime: typeof updateData.endTime === 'string' 
              ? new Date(updateData.endTime) 
              : updateData.endTime
          }),
          ...(updateData.summary !== undefined && { summary: updateData.summary }),
          ...(updateData.attendance !== undefined && { attendance: updateData.attendance }),
          ...(updateData.isFinalized !== undefined && { isFinalized: updateData.isFinalized }),
        }
      });

      return sendSuccessResponse(res, updatedSession);
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

    // Update session in database
    const updatedSession = await prisma.classSession.update({
      where: { id },
      data: {
        ...(updateData.startTime !== undefined && {
          startTime: typeof updateData.startTime === 'string' 
            ? new Date(updateData.startTime) 
            : updateData.startTime
        }),
        ...(updateData.endTime !== undefined && {
          endTime: typeof updateData.endTime === 'string' 
            ? new Date(updateData.endTime) 
            : updateData.endTime
        }),
        ...(updateData.summary !== undefined && { summary: updateData.summary }),
        ...(updateData.attendance !== undefined && { attendance: updateData.attendance }),
        ...(updateData.isFinalized !== undefined && { isFinalized: updateData.isFinalized }),
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

    return sendSuccessResponse(res, updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default updateSession;
