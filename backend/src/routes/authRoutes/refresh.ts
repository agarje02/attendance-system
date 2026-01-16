import { Request, Response } from "express";
import { z } from "zod";
import refreshSchema from "../../schemas/refreshSchema";
import { signJWT, signRefreshJWT, verifyRefreshJWT } from "../../utils/jwt.utils";
import { sendValidationError, sendErrorResponse, sendSuccessResponse, sendUnauthorizedError } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const refresh = async (req: Request, res: Response) => {
    try {
        // Try to get refresh token from cookie first, then from body
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        
        if (!refreshToken) {
            return sendUnauthorizedError(res);
        }

        // Validate refresh token format
        refreshSchema.parse({ refreshToken });

        // Verify the refresh token
        let decoded: any;
        try {
            decoded = verifyRefreshJWT(refreshToken);
        } catch (error) {
            return sendUnauthorizedError(res);
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({ 
            where: { id: decoded.id } 
        });

        if (!user) {
            return sendUnauthorizedError(res);
        }

        // Generate new tokens
        const payload = { email: user.email, id: user.id };
        const newToken = signJWT(payload);
        const newRefreshToken = signRefreshJWT(payload);
        const tokenExpiry = Number(process.env.COOKIE_TOKEN_EXPIRY) || 30 * 24 * 60 * 60 * 1000;
        const refreshTokenExpiry = Number(process.env.COOKIE_REFRESH_TOKEN_EXPIRY) || 90 * 24 * 60 * 60 * 1000;
        // Set cookies
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.SAME_SITE as any || "lax",
            maxAge: tokenExpiry, // 30 days
            path: '/',
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.SAME_SITE as any || "lax",
            maxAge: refreshTokenExpiry, // 90 days
            path: '/',
        });

        return sendSuccessResponse(res, {
            token: newToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sendValidationError(res);
        }
        return sendErrorResponse(res, "Internal server error", 500);
    }
};

export default refresh;

