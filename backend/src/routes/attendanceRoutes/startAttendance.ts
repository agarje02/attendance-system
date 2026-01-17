import { Request, Response } from "express";
import { activeSession } from "../../global";
import { prisma } from "../../config/database";
import { startAttendanceSchema } from "../../schemas/attendanceSchema";
import { sendValidationError, sendNotFoundClassError, sendForbiddenOwnershipError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

type ManagedUser = Awaited<ReturnType<typeof prisma.managedUser.findMany>>[number];

const startAttendance = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    // Validate request body using Zod
    const validationResult = startAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const { classId } = validationResult.data;

    // Check if class exists and get ownership info
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
    const managedTeacherIds = userManagedTeachers.map((mu: ManagedUser) => mu.id);
    const isTeacherMember = classData.members.some(
      (member: typeof classData.members[number]) => managedTeacherIds.includes(member.userId)
    );

    if (!isOwner && !isTeacherMember) {
      return sendForbiddenOwnershipError(res);
    }

    // Create a ClassSession for this attendance
    const session = await prisma.classSession.create({
      data: {
        classId,
        scheduledTime: new Date(),
        startTime: new Date(),
        teacherId: isTeacherMember ? classData.members.find((m: typeof classData.members[number]) => managedTeacherIds.includes(m.userId))?.userId : null,
        ownerTeacherId: isOwner ? currentUserId : null,
        attendance: {},
        isFinalized: false,
      }
    });

    // Update active session (for real-time tracking if needed)
    activeSession.classId = classId;
    activeSession.startedAt = new Date().toISOString();
    activeSession.attendance = {};

    return sendSuccessResponse(res, {
      sessionId: session.id,
      classId,
      startedAt: session.startTime,
      attendance: activeSession.attendance,
    });
  } catch (error) {
    console.error("Error starting attendance:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default startAttendance;