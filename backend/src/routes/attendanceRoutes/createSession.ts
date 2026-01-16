import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { classSessionCreateSchema } from "../../schemas/attendanceSchema";
import {
  sendValidationError,
  sendNotFoundClassError,
  sendForbiddenOwnershipError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";
import { setLiveSession } from "../../utils/sessionRedis";

const createSession = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    // Validate request body
    const validationResult = classSessionCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const { classId, teacherId, ownerTeacherId, scheduledTime, summary } = validationResult.data;

    // Check if class exists
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        members: {
          where: {
            role: 'teacher',
            status: 'approved'
          },
          include: {
            user: true
          }
        }
      }
    });

    if (!classData) {
      return sendNotFoundClassError(res);
    }

    // Check if user is the class owner
    const isOwner = classData.ownerId === currentUserId;

    // Check if user has a managed teacher user that is a member of this class
    const userManagedTeachers = await prisma.managedUser.findMany({
      where: {
        ownerId: currentUserId,
        role: 'teacher'
      }
    });
    const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
    const isTeacherMember = classData.members.some(
      member => managedTeacherIds.includes(member.userId)
    );

    if (!isOwner && !isTeacherMember) {
      return sendForbiddenOwnershipError(res);
    }

    // Determine teacherId and ownerTeacherId
    let finalTeacherId: string | null = null;
    let finalOwnerTeacherId: string | null = null;

    if (isOwner) {
      finalOwnerTeacherId = currentUserId;
      // If teacherId is provided and valid, use it
      if (teacherId && managedTeacherIds.includes(teacherId)) {
        finalTeacherId = teacherId;
      }
    } else if (isTeacherMember) {
      // Use the managed teacher that is a member
      finalTeacherId = classData.members.find(m => managedTeacherIds.includes(m.userId))?.userId || null;
    }

    // Parse scheduledTime
    const scheduledDateTime = typeof scheduledTime === 'string' ? new Date(scheduledTime) : scheduledTime;

    // Create session in database (not finalized, not started yet)
    const session = await prisma.classSession.create({
      data: {
        classId,
        teacherId: finalTeacherId,
        ownerTeacherId: finalOwnerTeacherId,
        scheduledTime: scheduledDateTime,
        summary: summary || null,
        isFinalized: false,
        attendance: {},
      }
    });

    // Store session in Redis as live session (24 hour TTL)
    await setLiveSession(session.id, {
      id: session.id,
      classId: session.classId,
      teacherId: session.teacherId,
      ownerTeacherId: session.ownerTeacherId,
      scheduledTime: session.scheduledTime.toISOString(),
      startTime: null,
      endTime: null,
      summary: session.summary,
      attendance: {},
      isFinalized: false,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    }, 86400); // 24 hours

    return sendSuccessResponse(res, {
      sessionId: session.id,
      classId: session.classId,
      scheduledTime: session.scheduledTime,
      summary: session.summary,
      isFinalized: false,
    }, 201);
  } catch (error) {
    console.error("Error creating session:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default createSession;
