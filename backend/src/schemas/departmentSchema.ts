import { z } from 'zod';

/**
 * Schema for creating a Department
 */
export const departmentCreateSchema = z.object({
    schoolId: z.string().uuid('Invalid school ID format'),
    name: z.string().min(1, 'Department name is required'),
});

/**
 * Schema for updating a Department
 */
export const departmentUpdateSchema = z.object({
    name: z.string().min(1, 'Department name is required').optional(),
});

/**
 * Schema for Department response
 */
export const departmentResponseSchema = z.object({
    id: z.string().uuid(),
    schoolId: z.string().uuid(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type DepartmentCreate = z.infer<typeof departmentCreateSchema>;
export type DepartmentUpdate = z.infer<typeof departmentUpdateSchema>;
export type DepartmentResponse = z.infer<typeof departmentResponseSchema>;

