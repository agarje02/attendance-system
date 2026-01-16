import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/errorResponse";

const logout = async (req: Request, res: Response) => {
    try {
        // Clear cookies by setting them with maxAge: 0
        // This is more reliable than clearCookie, especially for sameSite: "none" cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: (process.env.SAME_SITE as any) || "lax",
            path: '/',
            maxAge: 0, // Immediately expire the cookie
        };
        res.clearCookie('token',  cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return sendSuccessResponse(res, { message: "Logged out successfully" });
    } catch (error) {
        // Even if there's an error, try to clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: (process.env.SAME_SITE as any) || "lax",
            path: '/',
            maxAge: 0, // Immediately expire the cookie
        };

        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return sendSuccessResponse(res, { message: "Logged out successfully" });
    }
};

export default logout;
