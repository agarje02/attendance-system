import { Request, Response } from "express";
import { z } from "zod";
import { activeSession } from "../../global";
import ClassModel from "../../models/Class";
import { startAttendanceSchema } from "../../schemas/attendanceSchema";
import { validateClassOwnership } from "../../utils/validation";
import { sendValidationError, sendNotFoundClassError, sendForbiddenOwnershipError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const startAttendance = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is set by auth middleware
    const currentUser = req.user;

    // Validate request body using Zod
    const validationResult = startAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return sendValidationError(res);
    }

    const { classId } = validationResult.data;

    // Check if class exists
    const classData = await ClassModel.findById(classId);
    if (!classData) {
      return sendNotFoundClassError(res);
    }

    // Validate class ownership
    const ownershipError = validateClassOwnership(classData.teacherId, currentUser.id);
    if (ownershipError) {
      return sendForbiddenOwnershipError(res);
    }

    // Start attendance session
    activeSession.classId = classId;
    activeSession.startedAt = new Date().toISOString();
    activeSession.attendance = {};
    return sendSuccessResponse(res, {
      classId,
      startedAt: activeSession.startedAt,
      attendance: activeSession.attendance,
    });
  } catch (error) {
    console.error("Error starting attendance:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default startAttendance;