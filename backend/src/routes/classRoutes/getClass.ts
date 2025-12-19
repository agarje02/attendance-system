import { Request,Response } from "express"
import ClassModel from "../../models/Class";
import { sendNotFoundClassError, sendForbiddenOwnershipError, sendSuccessResponse, sendErrorResponse } from "../../utils/errorResponse";

const getClass = async(req:Request,res:Response)=>{
   try {
    const id = req.params.id;
    // @ts-ignore
    const userId = req.user.id;
    const classData  = await ClassModel.findById(id).populate({path:'studentIds',select:'-password'});
    if(!classData){
        return sendNotFoundClassError(res);
    }
    const usersOfClass = [classData?.teacherId,...classData?.studentIds];
    if(!usersOfClass?.map((id:any)=>id.toString()).includes(userId)){
        return sendForbiddenOwnershipError(res);
    }
    return sendSuccessResponse(res, classData);
   } catch (error) {
    return sendErrorResponse(res, "Internal Server Error", 500);
   }

}
export default getClass