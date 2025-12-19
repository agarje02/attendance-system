import { Request, Response } from "express";
import SessionModel from "../../models/Session";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const getMyAttendanceByClassId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const user = req.user;
        if(user.role!=='student'){
            return sendErrorResponse(res, "You are not a student", 403);
        }
        const sessionData = await SessionModel.findOne({ classId: id });
        if(!sessionData){
            return sendErrorResponse(res, "Session not found", 404);
        }
        const myAttendance = sessionData?.attendance[user.id];
        return sendSuccessResponse(res, {
            classId: id,
            status: myAttendance??null,
        });
    }
    catch (error) {
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
}

export default getMyAttendanceByClassId;