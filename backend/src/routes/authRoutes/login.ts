import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../../models/User";
import loginSchema from "../../schemas/loginSchema";
import { signJWT } from "../../utils/jwt.utils";
import bcrypt from "bcrypt";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, ERROR_MESSAGES } from "../../utils/errorResponse";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        loginSchema.parse({ email, password });
        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, "Invalid email or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendErrorResponse(res, "Invalid email or password", 400);
        }
        const token = signJWT({email: user.email,role: user.role,id:user._id});
        return sendSuccessResponse(res, { token });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        return sendErrorResponse(res, "Internal server error", 500);
    }
}

export default login;