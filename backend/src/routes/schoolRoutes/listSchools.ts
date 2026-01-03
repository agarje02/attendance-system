import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const listSchools = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Get all schools owned by the authenticated user
        const schools = await prisma.school.findMany({
            where: { ownerId: userId },
            include: {
                departments: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                _count: {
                    select: {
                        departments: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return sendSuccessResponse(res, schools);
    } catch (error) {
        console.error("Error in listSchools:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default listSchools;

