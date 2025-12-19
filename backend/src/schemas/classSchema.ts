import { z } from 'zod';

const classSchema = z.object({
    _id: z.string(),
    className: z.string().min(1, 'Name is required'),
    teacherId: z.string().min(1, 'Teacher ID is required'),
    studentIds: z.array(z.string()),
});

export default classSchema;

export type Class = z.infer<typeof classSchema>;