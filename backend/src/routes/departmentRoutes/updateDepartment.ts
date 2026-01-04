import { Request, Response } from "express";
import { z } from "zod";
import { departmentUpdateSchema } from "../../schemas/departmentSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = departmentUpdateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { name } = validationResult.data;

        // Check if department exists and get school info
        const existingDepartment = await prisma.department.findUnique({
            where: { id },
            include: {
                school: {
                    select: {
                        ownerId: true,
                    }
                }
            }
        });

        if (!existingDepartment) {
            return sendErrorResponse(res, "Department not found", 404);
        }

        // Check if user owns the school
        if (existingDepartment.school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this department", 403);
        }

        // If name is being updated, check for uniqueness within the school
        if (name && name !== existingDepartment.name) {
            const duplicateDepartment = await prisma.department.findUnique({
                where: {
                    schoolId_name: {
                        schoolId: existingDepartment.schoolId,
                        name: name,
                    }
                }
            });

            if (duplicateDepartment) {
                return sendErrorResponse(res, "Department with this name already exists in this school", 409);
            }
        }

        // Update department
        const updatedDepartment = await prisma.department.update({
            where: { id },
            data: {
                ...(name && { name }),
            },
            include: {
                school: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        managedUsers: true,
                        classes: true,
                    }
                }
            }
        });

        return sendSuccessResponse(res, updatedDepartment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in updateDepartment:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default updateDepartment;

