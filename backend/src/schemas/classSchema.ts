import { z } from 'zod';

/**
 * Schema for creating a Class
 */
export const classCreateSchema = z.object({
    className: z.string().min(1, 'Class name is required'),
    departmentId: z.string().uuid('Invalid department ID format').optional(),
    description: z.string().optional(),
    resources: z.any().optional(), // Json type in Prisma
});

/**
 * Schema for updating a Class
 */
export const classUpdateSchema = z.object({
    className: z.string().min(1, 'Class name is required').optional(),
    departmentId: z.string().uuid('Invalid department ID format').nullable().optional(),
    description: z.string().nullable().optional(),
    resources: z.any().optional(), // Json type in Prisma
});

/**
 * Schema for Class response
 */
export const classResponseSchema = z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    departmentId: z.string().uuid().nullable(),
    className: z.string(),
    description: z.string().nullable(),
    resources: z.any().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Default export for backward compatibility
const classSchema = classCreateSchema;
export default classSchema;

export type ClassCreate = z.infer<typeof classCreateSchema>;
export type ClassUpdate = z.infer<typeof classUpdateSchema>;
export type ClassResponse = z.infer<typeof classResponseSchema>;