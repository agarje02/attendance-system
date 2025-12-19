import { z } from 'zod';

const userSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(["teacher", "student"],"Role is required"),
});

export default userSchema;

export type User = z.infer<typeof userSchema>;