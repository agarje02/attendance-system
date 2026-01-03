import { z } from 'zod';
import { managedUserRoleSchema } from './enumSchema';

/**
 * Schema for creating a ManagedUser
 */
export const managedUserCreateSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: managedUserRoleSchema,
    departmentId: z.string().uuid().optional(),
});

/**
 * Schema for updating a ManagedUser
 */
export const managedUserUpdateSchema = z.object({
    username: z.string().min(1, 'Username is required').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: managedUserRoleSchema.optional(),
    departmentId: z.string().uuid().nullable().optional(),
});

/**
 * Schema for ManagedUser response
 */
export const managedUserResponseSchema = z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    username: z.string(),
    role: managedUserRoleSchema,
    departmentId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ManagedUserCreate = z.infer<typeof managedUserCreateSchema>;
export type ManagedUserUpdate = z.infer<typeof managedUserUpdateSchema>;
export type ManagedUserResponse = z.infer<typeof managedUserResponseSchema>;

