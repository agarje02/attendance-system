import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse, sendNotFoundClassError } from "../../utils/errorResponse";

const deleteClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Check if class exists and user is the owner
        const classData = await prisma.class.findUnique({
            where: { id }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        if (classData.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this class", 403);
        }

        // Delete class (members and sessions will be cascade deleted per schema)
        await prisma.class.delete({
            where: { id }
        });

        return sendSuccessResponse(res, { message: "Class deleted successfully" });
    } catch (error) {
        console.error("Error in deleteClass:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default deleteClass;
