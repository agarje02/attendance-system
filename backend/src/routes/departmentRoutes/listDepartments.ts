import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const listDepartments = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { schoolId } = req.query;

        // If schoolId is provided, verify ownership and list departments for that school
        if (schoolId) {
            // Verify user owns the school
            const school = await prisma.school.findUnique({
                where: { id: schoolId as string }
            });

            if (!school) {
                return sendErrorResponse(res, "School not found", 404);
            }

            if (school.ownerId !== userId) {
                return sendErrorResponse(res, "You don't have access to this school", 403);
            }

            // Get all departments for this school
            const departments = await prisma.department.findMany({
                where: { schoolId: schoolId as string },
                include: {
                    _count: {
                        select: {
                            managedUsers: true,
                            classes: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });

            return sendSuccessResponse(res, departments);
        }

        // If no schoolId provided, get all departments for all schools owned by the user
        const schools = await prisma.school.findMany({
            where: { ownerId: userId },
            select: { id: true }
        });

        const schoolIds = schools.map(school => school.id);

        const departments = await prisma.department.findMany({
            where: {
                schoolId: {
                    in: schoolIds
                }
            },
            include: {
                school: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        managedUsers: true,
                        classes: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return sendSuccessResponse(res, departments);
    } catch (error) {
        console.error("Error in listDepartments:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default listDepartments;

