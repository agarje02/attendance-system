import { WebSocketServer, WebSocket } from "ws";
import { ATTENDANCE_MARKED, DONE, EVENTS, MY_ATTENDANCE, TODAY_SUMMARY } from "../../types/websocket.events";
import {activeSession} from "../../global";
import ClassModel from "../../models/Class";
import { Class } from "../../schemas/classSchema";
import SessionModel from "../../models/Session";
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
        const classData = await ClassModel.findById(activeSession.classId);
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        if(!userHasAccessToClass(user, classData)){
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

const userHasAccessToClass = async (user: any, classData: Class) => {
    if(!classData){
        return false;
    }
    const usersOfClass = [classData?.teacherId,...classData?.studentIds];
    if(!usersOfClass?.map((id:any)=>id.toString()).includes(user.id)){
        return false;
    }
    return true;
}
const isUserTeacher = (user: any) => {
    return user.role === 'teacher';
}

const handleAttendanceMarked = async (wss: WebSocketServer, ws: WebSocket, msg: ATTENDANCE_MARKED, user: any) => {
    try {
        if(!isUserTeacher(user)){
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
        const classData = await ClassModel.findById(classId);
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
        if(user.role!=='teacher'){
            sendWSForbiddenTeacherErrorToClient(ws);
            return;
         }
         const total = classData?.studentIds?.length;
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
        if(user.role!=='student'){
            sendWSForbiddenStudentErrorToClient(ws);
            return;
        }
        const status = activeSession.attendance[user.id] || 'not yet updated';
        // Send only to the requesting client (unicast)
        ws.send(JSON.stringify({ event: "MY_ATTENDANCE", data: { status } }));
        return;
    }
    catch (error) {
        sendWSInternalErrorToClient(ws);
        return;
    }
}
const handleDone = async (wss: WebSocketServer, ws: WebSocket, msg: DONE, user: any) => {
    try {
        if(!isUserTeacher(user)){
            sendWSForbiddenTeacherErrorToClient(ws);
            return;
        }
        const classId = activeSession.classId;
        const classData = await ClassModel.findById(classId);
        if(!classData){
            sendWSClassNotFoundErrorToClient(ws);
            return;
        }
       const session = await SessionModel.create({
        classId: classId,
        startedAt: activeSession.startedAt,
        attendance: activeSession.attendance,
       });
       if(!session){
        sendWSCustomErrorToClient(ws, "Failed to create session");
        return;
       }
       const total = classData?.studentIds?.length;
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
        sendWSInternalErrorToClient(ws);
        return;
    }
}
export { handleIncomingMessage }