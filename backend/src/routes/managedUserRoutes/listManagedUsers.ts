import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const listManagedUsers = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { departmentId, role } = req.query;

        // Build where clause
        const where: any = {
            ownerId: userId,
        };

        // Filter by departmentId if provided
        if (departmentId) {
            // Verify user owns the department (through school ownership)
            const department = await prisma.department.findUnique({
                where: { id: departmentId as string },
                include: {
                    school: {
                        select: {
                            ownerId: true,
                        }
                    }
                }
            });

            if (!department) {
                return sendErrorResponse(res, "Department not found", 404);
            }

            if (department.school.ownerId !== userId) {
                return sendErrorResponse(res, "You don't have access to this department", 403);
            }

            where.departmentId = departmentId as string;
        }

        // Filter by role if provided
        if (role) {
            where.role = role as string;
        }

        // Get all managed users for the authenticated user
        const managedUsers = await prisma.managedUser.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        school: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        classMemberships: true,
                        teachingSessions: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Remove passwordHash from response
        const sanitizedUsers = managedUsers.map(({ passwordHash, ...user }) => user);

        return sendSuccessResponse(res, sanitizedUsers);
    } catch (error) {
        console.error("Error in listManagedUsers:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default listManagedUsers;

