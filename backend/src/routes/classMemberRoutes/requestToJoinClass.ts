import { Request, Response } from "express";
import { z } from "zod";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, sendNotFoundClassError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

/**
 * Schema for requesting to join a class
 */
const requestToJoinClassSchema = z.object({
    classId: z.string().uuid('Invalid class ID format'),
    userId: z.string().uuid('Invalid user ID format'),
});

/**
 * Request to join a class (Student can request - status: pending)
 * POST /class-members/request
 */
const requestToJoinClass = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = requestToJoinClassSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { classId, userId: managedUserId } = validationResult.data;

        // Verify class exists
        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                members: {
                    where: {
                        userId: managedUserId
                    }
                }
            }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
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

        // Only students can request to join
        if (managedUser.role !== 'student') {
            return sendErrorResponse(res, "Only student managed users can request to join a class", 400);
        }

        // Check if member already exists
        if (classData.members.length > 0) {
            const existingMember = classData.members[0];
            if (existingMember.status === 'approved') {
                return sendErrorResponse(res, "User is already an approved member of this class", 409);
            }
            if (existingMember.status === 'pending') {
                return sendErrorResponse(res, "A pending request already exists for this user", 409);
            }
        }

        // Create class member with pending status
        const classMember = await prisma.classMember.create({
            data: {
                classId,
                userId: managedUserId,
                role: 'student', // Students can only be students in class
                status: 'pending',
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
        console.error("Error in requestToJoinClass:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default requestToJoinClass;

