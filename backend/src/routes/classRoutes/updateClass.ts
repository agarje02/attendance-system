import { Request, Response } from "express";
import { z } from "zod";
import { classUpdateSchema } from "../../schemas/classSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, sendNotFoundClassError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const updateClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = classUpdateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { className, departmentId, description, resources } = validationResult.data;

        // Check if class exists and user is the owner
        const existingClass = await prisma.class.findUnique({
            where: { id }
        });

        if (!existingClass) {
            return sendNotFoundClassError(res);
        }

        if (existingClass.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this class", 403);
        }

        // If departmentId is being updated, verify it exists and belongs to user's schools
        if (departmentId !== undefined && departmentId !== existingClass.departmentId) {
            if (departmentId !== null) {
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
        }

        // If className is being updated, check for uniqueness within the owner
        if (className && className !== existingClass.className) {
            const duplicateClass = await prisma.class.findFirst({
                where: {
                    ownerId: userId,
                    className: className,
                    id: { not: id }, // Exclude current class
                }
            });

            if (duplicateClass) {
                return sendErrorResponse(res, "Class with this name already exists", 409);
            }
        }

        // Update class
        const updatedClass = await prisma.class.update({
            where: { id },
            data: {
                ...(className && { className }),
                ...(departmentId !== undefined && { departmentId }),
                ...(description !== undefined && { description }),
                ...(resources !== undefined && { resources }),
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        members: true,
                        sessions: true,
                    }
                }
            }
        });

        return sendSuccessResponse(res, updatedClass);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in updateClass:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default updateClass;
