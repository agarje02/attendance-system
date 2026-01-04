import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Check if department exists and get school info
        const department = await prisma.department.findUnique({
            where: { id },
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

        // Check if user owns the school
        if (department.school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this department", 403);
        }

        // Delete department (managedUsers and classes will have their departmentId set to null per schema)
        await prisma.department.delete({
            where: { id }
        });

        return sendSuccessResponse(res, { message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDepartment:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default deleteDepartment;

