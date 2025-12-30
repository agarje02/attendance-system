import { Request, Response } from "express";
import UserModel from "../../models/User";
import { signJWT, signRefreshJWT } from "../../utils/jwt.utils";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/errorResponse";

const signUpWithGoogle = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;
        
        if (!email || !name) {
            return sendErrorResponse(res, "Email and name are required", 400);
        }
        
        // Check if user already exists
        let user = await UserModel.findOne({ email });
        
        if (!user) {
            // Create new user with Google auth
            // Set a random password since Google users don't need password
            // In production, you might want to mark these users differently
            const bcrypt = require("bcrypt");
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            // Default role to 'student' - you can change this logic
            user = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                role: 'student', // Default role, adjust as needed
            });
        }
        
        const payload = { email: user.email, role: user.role, id: user._id };
        const token = signJWT(payload);
        const refreshToken = signRefreshJWT(payload);
        
        // Set cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
            path: '/',
        });
        
        return sendSuccessResponse(res, {
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error, 'error in signUpWithGoogle');
        return sendErrorResponse(res, "Internal server error", 500);
    }
}

export default signUpWithGoogle;