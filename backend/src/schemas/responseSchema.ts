import { z } from 'zod';

/**
 * Success response schema
 */
export const successResponseSchema = z.object({
    success: z.literal(true),
    data: z.any(),
});

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
});

/**
 * Union response schema (success or error)
 */
export const responseSchema = z.union([
    successResponseSchema,
    errorResponseSchema,
]);

export default responseSchema;

export type SuccessResponseType = z.infer<typeof successResponseSchema>;
export type ErrorResponseType = z.infer<typeof errorResponseSchema>;
export type ResponseType = z.infer<typeof responseSchema>;