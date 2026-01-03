import { Request, Response } from "express";
import { z } from "zod";
import userSchema from "../../schemas/userSchema";
import bcrypt from "bcrypt";
import { sendValidationError, sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const signup = async (req: Request, res: Response) => {
    try {
    const { fullName, email, password } = req.body;
    // Validate input using Zod
    userSchema.parse({ fullName, email, password });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log({existingUser});
    if (existingUser) {
        return sendErrorResponse(res, "Email already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
        data: { 
            fullName: fullName, 
            email, 
            passwordHash: hashedPassword 
        } 
    });
    const { passwordHash, ...userData } = user;
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
