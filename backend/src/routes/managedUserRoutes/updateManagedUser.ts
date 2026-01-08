import { Request, Response } from "express";
import { z } from "zod";
import { managedUserUpdateSchema } from "../../schemas/managedUserSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";
import bcrypt from "bcrypt";

const updateManagedUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = managedUserUpdateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { username, password, role, departmentId } = validationResult.data;

        // Check if managed user exists and verify ownership
        const existingUser = await prisma.managedUser.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return sendErrorResponse(res, "Managed user not found", 404);
        }

        // Check if user owns this managed user
        if (existingUser.ownerId !== userId) {
            return sendErrorResponse(res, "You don't have access to this managed user", 403);
        }

        // If username is being updated, check for uniqueness
        if (username && username !== existingUser.username) {
            const duplicateUser = await prisma.managedUser.findUnique({
                where: { username }
            });

            if (duplicateUser) {
                return sendErrorResponse(res, "Username already exists", 409);
            }
        }

        // If departmentId is being updated, verify user owns the department
        if (departmentId !== undefined && departmentId !== existingUser.departmentId) {
            if (departmentId !== null) {
                const department = await prisma.department.findUnique({
                    where: { id: departmentId },
                    include: {
                        school: {
                            select: {
                                ownerId: true,
                            }
                        }
                    }
                });

                if (!department) {
                    return sendErrorResponse(res, "Department not found", 404);
                }

                if (department.school.ownerId !== userId) {
                    return sendErrorResponse(res, "You don't have access to this department", 403);
                }
            }
        }

        // Hash password if provided
        let passwordHash: string | undefined;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        // Update managed user
        const updatedUser = await prisma.managedUser.update({
            where: { id },
            data: {
                ...(username && { username }),
                ...(passwordHash && { passwordHash }),
                ...(role && { role }),
                ...(departmentId !== undefined && { departmentId: departmentId || null }),
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        school: {
                            select: {
                                id: true,
                                name: true,
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

        // Remove passwordHash from response
        const { passwordHash: _, ...userData } = updatedUser;

        return sendSuccessResponse(res, userData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in updateManagedUser:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default updateManagedUser;

