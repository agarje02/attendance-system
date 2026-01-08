import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const deleteManagedUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Check if managed user exists and verify ownership
        const managedUser = await prisma.managedUser.findUnique({
            where: { id }
        });

        if (!managedUser) {
            return sendErrorResponse(res, "Managed user not found", 404);
        }

        // Check if user owns this managed user
        if (managedUser.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this managed user", 403);
        }

        // Delete managed user (classMemberships and teachingSessions will be deleted per schema cascade)
        await prisma.managedUser.delete({
            where: { id }
        });

        return sendSuccessResponse(res, { message: "Managed user deleted successfully" });
    } catch (error) {
        console.error("Error in deleteManagedUser:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default deleteManagedUser;

