import { Request, Response } from "express";
import { z } from "zod";
import { schoolUpdateSchema } from "../../schemas/schoolSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const updateSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = schoolUpdateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { name } = validationResult.data;

        // Check if school exists and user is the owner
        const existingSchool = await prisma.school.findUnique({
            where: { id }
        });

        if (!existingSchool) {
            return sendErrorResponse(res, "School not found", 404);
        }

        if (existingSchool.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this school", 403);
        }

        // If name is being updated, check for uniqueness
        if (name && name !== existingSchool.name) {
            const duplicateSchool = await prisma.school.findUnique({
                where: {
                    ownerId_name: {
                        ownerId: userId,
                        name: name,
                    }
                }
            });

            if (duplicateSchool) {
                return sendErrorResponse(res, "School with this name already exists", 409);
            }
        }

        // Update school
        const updatedSchool = await prisma.school.update({
            where: { id },
            data: {
                ...(name && { name }),
            },
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
            }
        });

        return sendSuccessResponse(res, updatedSchool);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in updateSchool:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default updateSchool;

