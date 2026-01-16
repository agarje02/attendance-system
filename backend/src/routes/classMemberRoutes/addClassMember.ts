import { Request, Response } from "express";
import { z } from "zod";
import { classMemberCreateSchema } from "../../schemas/classMemberSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, sendNotFoundClassError, sendForbiddenOwnershipError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

/**
 * Add a class member (Owner or Teacher can add directly - status: approved)
 * POST /class-members
 */
const addClassMember = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = classMemberCreateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { classId, userId: managedUserId, role } = validationResult.data;

        // Verify class exists
        const classData = await prisma.class.findUnique({
            where: { id: classId }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        // Check if user is the class owner
        const isOwner = classData.ownerId === userId;

        // Check if user has a managed teacher user that is a member of this class
        const userManagedTeachers = await prisma.managedUser.findMany({
            where: {
                ownerId: userId,
                role: 'teacher'
            }
        });
        const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
        
        // Check if any of the user's managed teachers are approved teacher members of this class
        const teacherMembership = await prisma.classMember.findFirst({
            where: {
                classId,
                userId: { in: managedTeacherIds },
                role: 'teacher',
                status: 'approved'
            }
        });
        const isTeacherMember = !!teacherMembership;

        if (!isOwner && !isTeacherMember) {
            return sendForbiddenOwnershipError(res);
        }

        // Verify the managed user exists and belongs to the current user
        const managedUser = await prisma.managedUser.findUnique({
            where: { id: managedUserId }
        });

        if (!managedUser) {
            return sendErrorResponse(res, "Managed user not found", 404);
        }

        if (managedUser.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this managed user", 403);
        }

        // Check if member already exists
        const existingMember = await prisma.classMember.findUnique({
            where: {
                classId_userId: {
                    classId,
                    userId: managedUserId
                }
            }
        });

        if (existingMember) {
            return sendErrorResponse(res, "User is already a member of this class", 409);
        }

        // Verify role matches managed user role (if student, can't be teacher in class)
        if (managedUser.role === 'student' && role === 'teacher') {
            return sendErrorResponse(res, "A student managed user cannot be assigned as a teacher in a class", 400);
        }

        // Create class member with approved status (owner/teacher can add directly)
        const classMember = await prisma.classMember.create({
            data: {
                classId,
                userId: managedUserId,
                role,
                status: 'approved', // Owner/teacher can add directly
            },
            include: {
                class: {
                    select: {
                        id: true,
                        className: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    }
                }
            }
        });

        return sendSuccessResponse(res, classMember, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in addClassMember:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default addClassMember;

