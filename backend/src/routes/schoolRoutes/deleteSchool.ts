import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const deleteSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Check if school exists and user is the owner
        const school = await prisma.school.findUnique({
            where: { id }
        });

        if (!school) {
            return sendErrorResponse(res, "School not found", 404);
        }

        if (school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this school", 403);
        }

        // Delete school (departments will be cascade deleted per schema)
        await prisma.school.delete({
            where: { id }
        });

        return sendSuccessResponse(res, { message: "School deleted successfully" });
    } catch (error) {
        console.error("Error in deleteSchool:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default deleteSchool;

