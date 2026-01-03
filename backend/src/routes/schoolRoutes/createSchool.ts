import { Request, Response } from "express";
import { z } from "zod";
import { schoolCreateSchema } from "../../schemas/schoolSchema";
import { sendValidationError, sendNotFoundUserError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const createSchool = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = schoolCreateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { name } = validationResult.data;

        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return sendNotFoundUserError(res);
        }

        // Check if school with same name already exists for this user
        const existingSchool = await prisma.school.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: name,
                }
            }
        });

        if (existingSchool) {
            return sendErrorResponse(res, "School with this name already exists", 409);
        }

        // Create school
        const school = await prisma.school.create({
            data: {
                name,
                ownerId: userId,
            },
            include: {
                departments: true,
                _count: {
                    select: {
                        departments: true,
                    }
                }
            }
        });

        return sendSuccessResponse(res, school, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in createSchool:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default createSchool;

