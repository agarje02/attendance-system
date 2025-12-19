import { Request, Response } from "express";
import { z } from "zod";
import userSchema from "../../schemas/userSchema";
import UserModel from "../../models/User";
import bcrypt from "bcrypt";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const signup = async (req: Request, res: Response) => {
    try {
    const { name, email, password, role } = req.body;
    // Validate input using Zod
    userSchema.parse({ name, email, password, role });
    const existingUser = await UserModel.findOne({ email });
    console.log({existingUser});
    if (existingUser) {
        return sendErrorResponse(res, "Email already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword, role });
    const { password:_, ...userData } = user.toObject();
    return sendSuccessResponse(res, userData, 201);
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        console.log(error,'error in signup');
        // Handle other errors
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default signup;
