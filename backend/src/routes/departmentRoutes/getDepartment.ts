import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const getDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Get department with school info
        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                school: {
                    select: {
                        id: true,
                        name: true,
                        ownerId: true,
                    }
                },
                _count: {
                    select: {
                        managedUsers: true,
                        classes: true,
                    }
                }
            }
        });

        if (!department) {
            return sendErrorResponse(res, "Department not found", 404);
        }

        // Check if user owns the school that this department belongs to
        if (department.school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this department", 403);
        }

        return sendSuccessResponse(res, department);
    } catch (error) {
        console.error("Error in getDepartment:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default getDepartment;

