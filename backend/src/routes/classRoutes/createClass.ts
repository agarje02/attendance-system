import { Request, Response } from "express";
import { z } from "zod";
import { classCreateSchema } from "../../schemas/classSchema";
import { sendValidationError, sendNotFoundUserError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const createClass = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = classCreateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { className, departmentId, description, resources } = validationResult.data;

        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return sendNotFoundUserError(res);
        }

        // If departmentId is provided, verify it exists and belongs to user's schools
        if (departmentId) {
            const department = await prisma.department.findUnique({
                where: { id: departmentId },
                include: { school: true }
            });

            if (!department) {
                return sendErrorResponse(res, "Department not found", 404);
            }

            if (department.school.ownerId !== userId) {
                return sendErrorResponse(res, "You don't have access to this department", 403);
            }
        }

        // Create class
        const classData = await prisma.class.create({
            data: {
                className,
                ownerId: userId,
                departmentId: departmentId || null,
                description: description || null,
                resources: resources || null,
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return sendSuccessResponse(res, classData, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in createClass:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default createClass;