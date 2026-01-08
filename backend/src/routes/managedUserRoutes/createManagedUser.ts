import { Request, Response } from "express";
import { z } from "zod";
import { managedUserCreateSchema } from "../../schemas/managedUserSchema";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";
import bcrypt from "bcrypt";

const createManagedUser = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        // Validate input using Zod schema
        const validationResult = managedUserCreateSchema.safeParse(req.body);
        if (!validationResult.success) {
            return sendValidationError(res);
        }

        const { username, password, role, departmentId, classId } = validationResult.data;

        // Check if username already exists
        const existingUser = await prisma.managedUser.findUnique({
            where: { username }
        });

        if (existingUser) {
            return sendErrorResponse(res, "Username already exists", 409);
        }

        // If departmentId is provided, verify user owns the department (through school ownership)
        if (departmentId) {
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

        // If classId is provided, verify user owns the class
        if (classId) {
            const classData = await prisma.class.findUnique({
                where: { id: classId }
            });

            if (!classData) {
                return sendErrorResponse(res, "Class not found", 404);
            }

            if (classData.ownerId !== userId) {
                return sendErrorResponse(res, "You don't have access to this class", 403);
            }
        }

        // Hash password if provided
        let passwordHash: string | undefined;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        // Create managed user and optionally add to class in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create managed user
            const managedUser = await tx.managedUser.create({
                data: {
                    username,
                    passwordHash,
                    role,
                    departmentId: departmentId || null,
                    ownerId: userId,
                },
            });

            // If classId is provided, add user to class directly (owner can add directly per product.md)
            if (classId) {
                // Check if already a member
                const existingMember = await tx.classMember.findFirst({
                    where: {
                        classId: classId,
                        userId: managedUser.id,
                    }
                });

                if (!existingMember) {
                    await tx.classMember.create({
                        data: {
                            classId: classId,
                            userId: managedUser.id,
                            role: role === 'teacher' ? 'teacher' : 'student',
                            status: 'approved', // Owner can add directly, so approved
                        }
                    });
                }
            }

            // Return user with relations
            return await tx.managedUser.findUnique({
                where: { id: managedUser.id },
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
        });

        // Remove passwordHash from response
        const { passwordHash: _, ...userData } = result!;

        return sendSuccessResponse(res, userData, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.error("Error in createManagedUser:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default createManagedUser;

