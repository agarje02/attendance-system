import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const getManagedUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Get managed user
        const managedUser = await prisma.managedUser.findUnique({
            where: { id },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        school: {
                            select: {
                                id: true,
                                name: true,
                                ownerId: true,
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
            }
        });

        if (!managedUser) {
            return sendErrorResponse(res, "Managed user not found", 404);
        }

        // Check if user owns this managed user
        if (managedUser.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this managed user", 403);
        }

        // Remove passwordHash from response
        const { passwordHash, ...userData } = managedUser;

        return sendSuccessResponse(res, userData);
    } catch (error) {
        console.error("Error in getManagedUser:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default getManagedUser;

