import { model, Schema } from 'mongoose';
import { Class } from '../schemas/classSchema';

const classSchema = new Schema({
    className: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentIds: { type: [Schema.Types.ObjectId], ref: 'User', required: false, default: () => [] },
}, { timestamps: true });

const ClassModel = model<Class>('Class', classSchema);

export default ClassModel;

