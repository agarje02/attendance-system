import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const listClasses = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { departmentId } = req.query;

        // If departmentId is provided, verify ownership and list classes for that department
        if (departmentId) {
            // Verify user owns the department's school
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

            // Get all classes for this department
            const classes = await prisma.class.findMany({
                where: { departmentId: departmentId as string },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            members: true,
                            sessions: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });

            return sendSuccessResponse(res, classes);
        }

        // If no departmentId provided, get all classes owned by the user
        const classes = await prisma.class.findMany({
            where: { ownerId: userId },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        members: true,
                        sessions: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return sendSuccessResponse(res, classes);
    } catch (error) {
        console.error("Error in listClasses:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default listClasses;
