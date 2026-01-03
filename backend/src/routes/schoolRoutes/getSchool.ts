import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const getSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Get school with departments
        const school = await prisma.school.findUnique({
            where: { id },
            include: {
                departments: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                managedUsers: true,
                                classes: true,
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                },
                _count: {
                    select: {
                        departments: true,
                    }
                }
            }
        });

        if (!school) {
            return sendErrorResponse(res, "School not found", 404);
        }

        // Check if user is the owner
        if (school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this school", 403);
        }

        return sendSuccessResponse(res, school);
    } catch (error) {
        console.error("Error in getSchool:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default getSchool;

