import {Request,Response} from "express"
import {z} from "zod"
import UserModel from "../../models/User";
import ClassModel from "../../models/Class";
import { sendValidationError, sendNotFoundStudentError, sendNotFoundClassError, sendForbiddenOwnershipError, sendSuccessResponse, sendErrorResponse, sendForbiddenTeacherError } from "../../utils/errorResponse";

const reqSchema = z.object({
    studentId:z.string().min(1,"student id is required")
})
const addStudent = async (req:Request,res:Response)=>{
    try{
    const body = req.body;
    const { id:classId } = req.params;
    //@ts-ignore
    const user = req.user;
    if(user?.role!=="teacher"){
        return sendForbiddenTeacherError(res);
    }
    reqSchema.parse(body);
    const {studentId} = body;
    const isStudentExist =await UserModel.findById({_id:studentId});
    
    if(!isStudentExist ){
        return sendNotFoundStudentError(res);
    }
    if(isStudentExist.role!=="student"){
        return sendNotFoundStudentError(res);
    } 
    
    const classData  = await ClassModel.findById(classId);
   
    if(!classData){
        return sendNotFoundClassError(res);
    }
    if(classData?.teacherId.toString()!==user.id.toString()){
        return sendForbiddenOwnershipError(res);
    }
    if(classData.studentIds.filter((id:string)=>id.toString()===studentId.toString()).length>0){
        return sendErrorResponse(res, "Student already added to the class", 400);
    }
    classData.studentIds.push(studentId)
    const updateClass = await classData?.save();

    return sendSuccessResponse(res, updateClass);
    }
    catch(e){
        if (e instanceof z.ZodError) {
            return sendValidationError(res);
        }
        return sendErrorResponse(res, "Internal Server Error", 500);
    }
}
export default addStudent;