import { Request, Response } from "express";
import UserModel from "../../models/User";
import { sendForbiddenTeacherError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const getStudents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    if (user.role !== "teacher") {
      return sendForbiddenTeacherError(res);
    }
    const students = await UserModel.find({ role: "student" }, { password: 0 });
    return sendSuccessResponse(res, students);
  } catch (error) {
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default getStudents;
