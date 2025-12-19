import UserModel from "../../models/User";
import { Request, Response } from "express";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const me = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const email = req.user.email;
        console.log({email},'email');
        const user = await UserModel.findOne({ email },{password: 0});
        return sendSuccessResponse(res, user);
  } catch (error) {
    return sendErrorResponse(res, "Internal server error", 500);
  }
};

export default me;