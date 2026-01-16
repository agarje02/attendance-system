import { Request, Response } from "express";
import { z } from "zod";
import { classMemberUpdateSchema } from "../../schemas/classMemberSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, sendNotFoundClassError, sendForbiddenOwnershipError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

/**
 * Update a class member (approve/reject request or update role)
 * PUT /class-members/:classId/:userId
 */
const updateClassMember = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { classId, userId: managedUserId } = req.params;

        // Validate input using Zod schema
        const validationResult = classMemberUpdateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const updateData = validationResult.data;

        // Verify class exists
        const classData = await prisma.class.findUnique({
            where: { id: classId }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        // Check if class member exists
        const existingMember = await prisma.classMember.findUnique({
            where: {
                classId_userId: {
                    classId,
                    userId: managedUserId
                }
            }
        });

        if (!existingMember) {
            return sendErrorResponse(res, "Class member not found", 404);
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

        // Only owner or teacher members can update class members
        if (!isOwner && !isTeacherMember) {
            return sendForbiddenOwnershipError(res);
        }

        // If updating role, verify the managed user can have that role
        if (updateData.role) {
            const managedUser = await prisma.managedUser.findUnique({
                where: { id: managedUserId }
            });

            if (!managedUser) {
                return sendErrorResponse(res, "Managed user not found", 404);
            }

            // A student managed user cannot be assigned as a teacher in a class
            if (managedUser.role === 'student' && updateData.role === 'teacher') {
                return sendErrorResponse(res, "A student managed user cannot be assigned as a teacher in a class", 400);
            }
        }

        // Update class member
        const updatedMember = await prisma.classMember.update({
            where: {
                classId_userId: {
                    classId,
                    userId: managedUserId
                }
            },
            data: updateData,
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

        return sendSuccessResponse(res, updatedMember);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in updateClassMember:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default updateClassMember;

