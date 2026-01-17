import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

type ManagedUser = Awaited<ReturnType<typeof prisma.managedUser.findMany>>[number];
type ClassSession = Awaited<ReturnType<typeof prisma.classSession.findMany>>[number];

const getMyAttendanceByClassId = async (req: Request, res: Response) => {
    try {
        const { id: classId } = req.params;
        // @ts-ignore
        const userId = req.user.id;

        // Find the user's managed users that are students
        const managedUsers = await prisma.managedUser.findMany({
            where: {
                ownerId: userId,
                role: 'student'
            }
        });

        if (managedUsers.length === 0) {
            return sendErrorResponse(res, "You don't have any student accounts", 403);
        }

        // Get all class sessions for this class
        const sessions = await prisma.classSession.findMany({
            where: {
                classId,
                isFinalized: true, // Only get finalized sessions
            },
            orderBy: {
                scheduledTime: 'desc'
            }
        });

        // Aggregate attendance for all managed student users
        const attendanceRecords = sessions.map((session: ClassSession) => {
            const attendance = session.attendance as Record<string, string> | null;
            const studentAttendance: Record<string, string> = {};

            managedUsers.forEach((managedUser: ManagedUser) => {
                if (attendance && attendance[managedUser.id]) {
                    studentAttendance[managedUser.id] = attendance[managedUser.id];
                }
            });

            return {
                sessionId: session.id,
                scheduledTime: session.scheduledTime,
                startTime: session.startTime,
                endTime: session.endTime,
                attendance: studentAttendance,
            };
        });

        return sendSuccessResponse(res, {
            classId,
            managedUsers: managedUsers.map((mu: ManagedUser) => ({
                id: mu.id,
                username: mu.username,
            })),
            sessions: attendanceRecords,
        });
    } catch (error) {
        console.error("Error in getMyAttendanceByClassId:", error);
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default getMyAttendanceByClassId;