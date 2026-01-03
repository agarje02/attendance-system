import { z } from 'zod';

/**
 * Schema for User signup/registration
 */
export const userSignupSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Schema for User update (all fields optional)
 */
export const userUpdateSchema = z.object({
    fullName: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

/**
 * Schema for User response (without password hash)
 */
export const userResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().nullable(),
    fullName: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Default export for backward compatibility
const userSchema = userSignupSchema;
export default userSchema;

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;