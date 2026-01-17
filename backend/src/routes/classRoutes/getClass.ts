import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendNotFoundClassError, sendForbiddenOwnershipError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

type ManagedUser = Awaited<ReturnType<typeof prisma.managedUser.findMany>>[number];

const getClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Get class with members
        const classData = await prisma.class.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                role: true,
                                departmentId: true,
                            }
                        }
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                owner: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        // Check if user is the owner
        const isOwner = classData.ownerId === userId;

        // Check if user is a member (via ManagedUser)
        const userManagedUsers = await prisma.managedUser.findMany({
            where: { ownerId: userId }
        });
        const managedUserIds = userManagedUsers.map((mu: ManagedUser) => mu.id);
        
        const isMember = classData.members.some(
            (member: typeof classData.members[number]) => managedUserIds.includes(member.userId)
        );

        if (!isOwner && !isMember) {
            return sendForbiddenOwnershipError(res);
        }

        return sendSuccessResponse(res, classData);
    } catch (error) {
        console.error("Error in getClass:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default getClass;