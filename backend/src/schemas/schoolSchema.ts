import { z } from 'zod';

/**
 * Schema for creating a School
 */
export const schoolCreateSchema = z.object({
    name: z.string().min(1, 'School name is required'),
});

/**
 * Schema for updating a School
 */
export const schoolUpdateSchema = z.object({
    name: z.string().min(1, 'School name is required').optional(),
});

/**
 * Schema for School response
 */
export const schoolResponseSchema = z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type SchoolCreate = z.infer<typeof schoolCreateSchema>;
export type SchoolUpdate = z.infer<typeof schoolUpdateSchema>;
export type SchoolResponse = z.infer<typeof schoolResponseSchema>;

