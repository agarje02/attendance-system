import { Request, Response } from "express";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";
import { prisma } from "../../config/database";

const me = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const email = req.user.email;
        console.log({email},'email');
        const user = await prisma.user.findUnique({ where: { email },omit: { passwordHash: true } });
        return sendSuccessResponse(res, user);
  } catch (error) {
    console.log(error,'error in me');
    return sendErrorResponse(res, "Internal server error", 500);
  }
};

export default me;