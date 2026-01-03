import { z } from 'zod';
import { classMemberRoleSchema, classMemberStatusSchema } from './enumSchema';

/**
 * Schema for creating/adding a ClassMember
 */
export const classMemberCreateSchema = z.object({
    classId: z.string().uuid('Invalid class ID format'),
    userId: z.string().uuid('Invalid user ID format'),
    role: classMemberRoleSchema,
    status: classMemberStatusSchema.default('pending'),
});

/**
 * Schema for updating a ClassMember (e.g., approving membership)
 */
export const classMemberUpdateSchema = z.object({
    role: classMemberRoleSchema.optional(),
    status: classMemberStatusSchema.optional(),
});

/**
 * Schema for ClassMember response
 */
export const classMemberResponseSchema = z.object({
    classId: z.string().uuid(),
    userId: z.string().uuid(),
    role: classMemberRoleSchema,
    status: classMemberStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ClassMemberCreate = z.infer<typeof classMemberCreateSchema>;
export type ClassMemberUpdate = z.infer<typeof classMemberUpdateSchema>;
export type ClassMemberResponse = z.infer<typeof classMemberResponseSchema>;

