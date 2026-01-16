import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse, sendNotFoundClassError, sendForbiddenOwnershipError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

/**
 * Remove a class member from a class
 * DELETE /class-members/:classId/:userId
 */
const removeClassMember = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { classId, userId: managedUserId } = req.params;

        // Verify class exists
        const classData = await prisma.class.findUnique({
            where: { id: classId }
        });

        if (!classData) {
            return sendNotFoundClassError(res);
        }

        // Check if class member exists
        const existingMember = await prisma.classMember.findUnique({
            where: {
                classId_userId: {
                    classId,
                    userId: managedUserId
                }
            }
        });

        if (!existingMember) {
            return sendErrorResponse(res, "Class member not found", 404);
        }

        // Check if user is the class owner
        const isOwner = classData.ownerId === userId;

        // Check if user has a managed teacher user that is a member of this class
        const userManagedTeachers = await prisma.managedUser.findMany({
            where: {
                ownerId: userId,
                role: 'teacher'
            }
        });
        const managedTeacherIds = userManagedTeachers.map(mu => mu.id);
        
        // Check if any of the user's managed teachers are approved teacher members of this class
        const teacherMembership = await prisma.classMember.findFirst({
            where: {
                classId,
                userId: { in: managedTeacherIds },
                role: 'teacher',
                status: 'approved'
            }
        });
        const isTeacherMember = !!teacherMembership;

        // Only owner or teacher members can remove class members
        if (!isOwner && !isTeacherMember) {
            return sendForbiddenOwnershipError(res);
        }

        // Delete class member
        await prisma.classMember.delete({
            where: {
                classId_userId: {
                    classId,
                    userId: managedUserId
                }
            }
        });

        return sendSuccessResponse(res, { message: "Class member removed successfully" });
    } catch (error) {
        console.error("Error in removeClassMember:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default removeClassMember;

