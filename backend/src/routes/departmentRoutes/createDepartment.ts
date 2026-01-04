import { Request, Response } from "express";
import { z } from "zod";
import { departmentCreateSchema } from "../../schemas/departmentSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const createDepartment = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = departmentCreateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { schoolId, name } = validationResult.data;

        // Verify user owns the school
        const school = await prisma.school.findUnique({
            where: { id: schoolId }
        });

        if (!school) {
            return sendErrorResponse(res, "School not found", 404);
        }

        if (school.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this school", 403);
        }

        // Check if department with same name already exists for this school
        const existingDepartment = await prisma.department.findUnique({
            where: {
                schoolId_name: {
                    schoolId: schoolId,
                    name: name,
                }
            }
        });

        if (existingDepartment) {
            return sendErrorResponse(res, "Department with this name already exists in this school", 409);
        }

        // Create department
        const department = await prisma.department.create({
            data: {
                name,
                schoolId: schoolId,
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

        return sendSuccessResponse(res, department, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in createDepartment:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default createDepartment;

