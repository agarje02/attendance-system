import { Request, Response } from "express";
import { z } from "zod";
import loginSchema from "../../schemas/loginSchema";
import { signJWT, signRefreshJWT } from "../../utils/jwt.utils";
import bcrypt from "bcrypt";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, ERROR_MESSAGES } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        loginSchema.parse({ email, password });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return sendErrorResponse(res, "Invalid email or password", 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user?.passwordHash || '');
        if (!isPasswordValid) {
            return sendErrorResponse(res, "Invalid email or password", 400);
        }
        
        const payload = { email: user.email, id: user.id };
        const token = signJWT(payload);
        const refreshToken = signRefreshJWT(payload);
        
        // Set cookies
        const tokenExpiry = Number(process.env.COOKIE_TOKEN_EXPIRY) || 30 * 24 * 60 * 60 * 1000;
        const refreshTokenExpiry = Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRY) || 90 * 24 * 60 * 60 * 1000;
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.SAME_SITE as any || "none",
            maxAge: tokenExpiry, // 30 days
            path: '/',
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.SAME_SITE as any || "none",
            maxAge: refreshTokenExpiry, // 90 days
            path: '/',
        });
        
        return sendSuccessResponse(res, { 
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            }
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        return sendErrorResponse(res, "Internal server error", 500);
    }
}

export default login;