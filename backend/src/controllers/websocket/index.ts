import { WebSocketServer, WebSocket } from "ws";
import { ATTENDANCE_MARKED, DONE, EVENTS, MY_ATTENDANCE, TODAY_SUMMARY } from "../../types/websocket.events";
import { activeSession } from "../../global";
import { prisma } from "../../config/database";
import { sendWSUnauthorizedErrorToClient, sendWSNoActiveSessionErrorToClient, sendWSClassNotFoundErrorToClient, sendWSInternalErrorToClient, sendWSForbiddenTeacherErrorToClient, sendWSForbiddenStudentErrorToClient, sendWSCustomErrorToClient } from "../../utils/websocketError";

const handleIncomingMessage = async (wss: WebSocketServer, ws: WebSocket, msg: EVENTS) => {
    console.log("Message received:", msg.toString());
    // @ts-ignore
    const user = ws.user;
    if(!user){
        sendWSUnauthorizedErrorToClient(ws);
        return;
    }
    console.log(activeSession,'activeSession.classId');
    if(activeSession.classId===null){
        sendWSNoActiveSessionErrorToClient(ws);
        return;
    }
    try {
        const classData = await prisma.class.findUnique({
            where: { id: activeSession.classId! },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        if(!await userHasAccessToClass(user, classData)){
            sendWSUnauthorizedErrorToClient(ws);
            return;
        }
        switch(msg.event){
            case "ATTENDANCE_MARKED":
                handleAttendanceMarked(wss, ws, msg, user);
                break;
            case "TODAY_SUMMARY":
                handleTodaySummary(wss, ws, msg, user);
                break;
            case "MY_ATTENDANCE":
                handleMyAttendance(wss, ws, msg, user);
                break;
            case "DONE":
                handleDone(wss, ws, msg, user);
                break;
            default:
                sendWSCustomErrorToClient(ws, "Unknown event");
                return;
        }

        return;
    } catch (error) {
        sendWSInternalErrorToClient(ws);
        return;
    }
}

const userHasAccessToClass = async (user: any, classData: any) => {
    if(!classData){
        return false;
    }
    // Check if user is the owner
    if(classData.ownerId === user.id){
        return true;
    }
    // Check if user has managed users that are members of this class
    const userManagedUsers = await prisma.managedUser.findMany({
        where: { ownerId: user.id }
    });
    const managedUserIds = userManagedUsers.map(mu => mu.id);
    const isMember = classData.members.some(
        (member: any) => managedUserIds.includes(member.userId)    
    );
    return isMember;
}

const isUserTeacher = async (user: any, classId?: string) => {
    // Check if user owns the class
    if(classId){
        const classData = await prisma.class.findUnique({
            where: { id: classId }
        });
        if(classData?.ownerId === user.id){
            return true;
        }
    }
    // Check if user manages teacher ManagedUsers
    const managedTeachers = await prisma.managedUser.findFirst({
        where: {
            ownerId: user.id,
            role: 'teacher'
        }
    });
    return !!managedTeachers;
}

const handleAttendanceMarked = async (wss: WebSocketServer, ws: WebSocket, msg: ATTENDANCE_MARKED, user: any) => {
    try {
        if(!await isUserTeacher(user, activeSession.classId || undefined)){
            sendWSForbiddenTeacherErrorToClient(ws);
            return;
        }
       activeSession.attendance[msg?.data?.studentId] = msg?.data?.status;
       // Broadcast to all clients
       const broadcastData = { event: "ATTENDANCE_MARKED", data: { studentId: msg.data.studentId, status: msg.data.status } };
       wss.clients.forEach((client) => {
         if (client.readyState === WebSocket.OPEN) {
           client.send(JSON.stringify(broadcastData));
         }
       });
    } catch (error) {
        sendWSInternalErrorToClient(ws);
        return;
    }
}


const handleTodaySummary = async (wss: WebSocketServer, ws: WebSocket, msg: TODAY_SUMMARY, user: any) => {
    try {
        const classId = activeSession.classId;
        if(!classId){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                members: {
                    where: {
                        role: 'student',
                        status: 'approved'
                    }
                }
            }
        });
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        if(!await isUserTeacher(user, classId)){
            sendWSForbiddenTeacherErrorToClient(ws);
            return;
         }
         const total = classData.members.length;
         const present = Object.values(activeSession.attendance).filter((status:any)=>status==='present').length;
         const absent = total - present;
         // Broadcast to all clients
         const broadcastData = { event: "TODAY_SUMMARY", data: { present, absent, total } };
         wss.clients.forEach((client) => {
           if (client.readyState === WebSocket.OPEN) {
             client.send(JSON.stringify(broadcastData));
           }
         });
         return;
    }
    catch (error) {
        sendWSInternalErrorToClient(ws);
        return;
    }
}

const handleMyAttendance = async (wss: WebSocketServer, ws: WebSocket, msg: MY_ATTENDANCE, user: any) => {
    try {
        // Check if user has managed student users
        const managedStudents = await prisma.managedUser.findMany({
            where: {
                ownerId: user.id,
                role: 'student'
            }
        });
        if(managedStudents.length === 0){
            sendWSForbiddenStudentErrorToClient(ws);
            return;
        }
        // Get attendance for all managed student users
        const attendanceStatuses: Record<string, string> = {};
        managedStudents.forEach(student => {
            attendanceStatuses[student.id] = activeSession.attendance[student.id] || 'not yet updated';
        });
        // Send only to the requesting client (unicast)
        ws.send(JSON.stringify({ event: "MY_ATTENDANCE", data: { attendance: attendanceStatuses } }));
        return;
    }
    catch (error) {
        sendWSInternalErrorToClient(ws);
        return;
    }
}
const handleDone = async (wss: WebSocketServer, ws: WebSocket, msg: DONE, user: any) => {
    try {
        const classId = activeSession.classId;
        if(!classId){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        if(!await isUserTeacher(user, classId)){
            sendWSForbiddenTeacherErrorToClient(ws);
            return;
        }
        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                members: {
                    where: {
                        role: 'student',
                        status: 'approved'
                    }
                }
            }
        });
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        // Find the active session to update
        const activeSessionRecord = await prisma.classSession.findFirst({
            where: {
                classId,
                isFinalized: false,
                startTime: { not: null },
                endTime: null
            },
            orderBy: {
                startTime: 'desc'
            }
        });
        if(!activeSessionRecord){
            sendWSCustomErrorToClient(ws, "No active session found");
            return;
        }
        // Update session with attendance and finalize it
        const session = await prisma.classSession.update({
            where: { id: activeSessionRecord.id },
            data: {
                endTime: new Date(),
                attendance: activeSession.attendance,
                isFinalized: true,
            }
        });
        const total = classData.members.length;
        const present = Object.values(activeSession.attendance).filter((status:any)=>status==='present').length;
        const absent = total - present;
        // Broadcast to all clients
        const broadcastData = { event: "DONE", data: { message: "Attendance persisted", present, absent, total } };
        wss.clients.forEach((client) => {
         if (client.readyState === WebSocket.OPEN) {
           client.send(JSON.stringify(broadcastData));
         }
       });
       // Clear active session
       activeSession.classId = null;
       activeSession.startedAt = null;
       activeSession.attendance = {};
       return;
    }
    catch (error) {
        console.error("Error in handleDone:", error);
        sendWSInternalErrorToClient(ws);
        return;
    }
}
export { handleIncomingMessage }