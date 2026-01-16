import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/errorResponse";

const logout = async (req: Request, res: Response) => {
    try {
        // Clear cookies with the same options used when setting them
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.SAME_SITE as any) || "none",
            path: '/',
        };

        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return sendSuccessResponse(res, { message: "Logged out successfully" });
    } catch (error) {
        // Even if there's an error, try to clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.SAME_SITE as any) || "none",
            path: '/',
        };

        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return sendSuccessResponse(res, { message: "Logged out successfully" });
    }
};

export default logout;
