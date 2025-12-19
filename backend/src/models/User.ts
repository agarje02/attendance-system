import { model, Schema } from 'mongoose';
import  { User } from '../schemas/userSchema';

const userSchemaModel = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student'], required: true },
}, { timestamps: true });

const UserModel = model<User>('User', userSchemaModel);

export default UserModel;