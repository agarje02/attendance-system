import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccessResponse, sendErrorResponse, sendNotFoundClassError, sendForbiddenOwnershipError } from "../../utils/errorResponse";

/**
 * List class members with optional filters
 * GET /class-members?classId=:classId&role=:role&status=:status
 */
const listClassMembers = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { classId, role, status } = req.query;

        // classId is required
        if (!classId || typeof classId !== 'string') {
            return sendErrorResponse(res, "classId query parameter is required", 400);
        }

        // Verify class exists
        const classData = await prisma.class.findUnique({
            where: { id: classId as string }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        // Check if user is the class owner
        const isOwner = classData.ownerId === userId;

        // Check if user has a managed user that is a member of this class
        const userManagedUsers = await prisma.managedUser.findMany({
            where: { ownerId: userId }
        });
        const managedUserIds = userManagedUsers.map(mu => mu.id);
        
        const userMembership = await prisma.classMember.findFirst({
            where: {
                classId: classId as string,
                userId: { in: managedUserIds }
            }
        });

        const isMember = !!userMembership;

        // Only owner or members can view class members
        if (!isOwner && !isMember) {
            return sendForbiddenOwnershipError(res);
        }

        // Build where clause
        const where: any = {
            classId: classId as string,
        };

        // Filter by role if provided
        if (role) {
            if (role !== 'teacher' && role !== 'student') {
                return sendErrorResponse(res, "Invalid role. Must be 'teacher' or 'student'", 400);
            }
            where.role = role as string;
        }

        // Filter by status if provided
        if (status) {
            if (status !== 'pending' && status !== 'approved') {
                return sendErrorResponse(res, "Invalid status. Must be 'pending' or 'approved'", 400);
            }
            where.status = status as string;
        }

        // Get all class members
        const classMembers = await prisma.classMember.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        departmentId: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                class: {
                    select: {
                        id: true,
                        className: true,
                    }
                }
            },
            orderBy: [
                { role: 'asc' }, // Teachers first
                { createdAt: 'desc' }
            ]
        });

        return sendSuccessResponse(res, classMembers);
    } catch (error) {
        console.error("Error in listClassMembers:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default listClassMembers;

