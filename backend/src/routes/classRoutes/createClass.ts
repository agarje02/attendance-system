import { Request, Response } from "express";
import { z } from "zod";
import ClassModel from "../../models/Class";
import UserModel from "../../models/User";
import { sendValidationError, sendForbiddenTeacherError, sendNotFoundUserError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const classSchema = z.object({
    className: z.string().min(1, 'Class name is required'),
});
const createClass = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        const isTeacher = user?.role === "teacher";
        if(!isTeacher){
            return sendForbiddenTeacherError(res);
        }
        classSchema.parse(req.body);
        const { className } = req.body;
        console.log(user?.id,'user id');
        const teacher = await UserModel.findById({_id:user?.id})
        console.log(teacher,'teacher');
        if(!teacher){
            return sendNotFoundUserError(res);
        }
        const classData = await ClassModel.create({ className, teacherId: teacher._id, studentIds: []});
        return sendSuccessResponse(res, classData, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.log(error,'error in createClass');
        return sendErrorResponse(res, "Internal server error", 500);
    }
}

export default createClass;