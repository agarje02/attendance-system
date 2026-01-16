import { Request, Response } from "express";
import { prisma } from "../../config/database";
import {
  sendNotFoundSessionError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/errorResponse";
import { getLiveSession } from "../../utils/sessionRedis";

const getSession = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUserId = req.user.id;

    const { id } = req.params;

    // First check if session is live in Redis
    const liveSession = await getLiveSession(id);
    
    if (liveSession) {
      // Check access permissions
      const isOwner = liveSession.ownerTeacherId === currentUserId;
      
      if (!isOwner) {
        // Check if user has a managed teacher that matches
        const userManagedTeachers = await prisma.managedUser.findMany({
          where: {
            ownerId: currentUserId,
            role: 'teacher'
          }
        });
        const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
        const isTeacherMember = liveSession.teacherId && managedTeacherIds.includes(liveSession.teacherId);

        if (!isTeacherMember) {
          // Check if user is a student in the class
          const classMember = await prisma.classMember.findFirst({
            where: {
              classId: liveSession.classId,
              userId: { in: managedTeacherIds },
              status: 'approved'
            }
          });

          if (!classMember) {
            return sendErrorResponse(res, "Forbidden, no access to this session", 403);
          }
        }
      }

      return sendSuccessResponse(res, liveSession);
    }

    // If not live, check database
    const session = await prisma.classSession.findUnique({
      where: { id },
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

    if (!session) {
      return sendNotFoundSessionError(res);
    }

    // Check access permissions
    const isOwner = session.ownerTeacherId === currentUserId;
    
    if (!isOwner) {
      // Check if user has a managed teacher that matches
      const userManagedTeachers = await prisma.managedUser.findMany({
        where: {
          ownerId: currentUserId,
          role: 'teacher'
        }
      });
      const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
      const isTeacherMember = session.teacherId && managedTeacherIds.includes(session.teacherId);

      if (!isTeacherMember) {
        // Check if user is a student in the class
        const classMember = await prisma.classMember.findFirst({
          where: {
            classId: session.classId,
            userId: { in: managedTeacherIds },
            status: 'approved'
          }
        });

        if (!classMember) {
          return sendErrorResponse(res, "Forbidden, no access to this session", 403);
        }
      }
    }

    return sendSuccessResponse(res, session);
  } catch (error) {
    console.error("Error getting session:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default getSession;
