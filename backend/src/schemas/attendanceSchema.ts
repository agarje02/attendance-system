import { z } from "zod";

/**
 * Schema for starting attendance request (ClassSession)
 */
export const startAttendanceSchema = z.object({
  classId: z.string().uuid("Invalid class ID format"),
});

/**
 * Schema for creating a ClassSession
 */
export const classSessionCreateSchema = z.object({
  classId: z.string().uuid("Invalid class ID format"),
  teacherId: z.string().uuid("Invalid teacher ID format").optional(),
  ownerTeacherId: z.string().uuid("Invalid owner teacher ID format").optional(),
  scheduledTime: z.string().datetime("Invalid datetime format").or(z.date()),
  summary: z.string().optional(),
});

/**
 * Schema for updating a ClassSession (e.g., starting, ending, finalizing)
 */
export const classSessionUpdateSchema = z.object({
  startTime: z.string().datetime("Invalid datetime format").or(z.date()).nullable().optional(),
  endTime: z.string().datetime("Invalid datetime format").or(z.date()).nullable().optional(),
  summary: z.string().nullable().optional(),
  attendance: z.any().optional(), // Json type in Prisma
  isFinalized: z.boolean().optional(),
});

/**
 * Schema for marking attendance in a session
 */
export const markAttendanceSchema = z.object({
  attendance: z.record(z.string().uuid(), z.enum(['present', 'absent', 'late'])), // userId -> status
});

/**
 * Schema for querying sessions (filters)
 */
export const getSessionsQuerySchema = z.object({
  classId: z.string().uuid("Invalid class ID format").optional(),
  isFinalized: z.string().transform((val) => val === 'true').optional(),
  teacherId: z.string().uuid("Invalid teacher ID format").optional(),
  ownerTeacherId: z.string().uuid("Invalid owner teacher ID format").optional(),
});

/**
 * Schema for ClassSession response
 */
export const classSessionResponseSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  teacherId: z.string().uuid().nullable(),
  ownerTeacherId: z.string().uuid().nullable(),
  scheduledTime: z.date(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  summary: z.string().nullable(),
  attendance: z.any().nullable(),
  isFinalized: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StartAttendanceRequest = z.infer<typeof startAttendanceSchema>;
export type ClassSessionCreate = z.infer<typeof classSessionCreateSchema>;
export type ClassSessionUpdate = z.infer<typeof classSessionUpdateSchema>;
export type MarkAttendance = z.infer<typeof markAttendanceSchema>;
export type ClassSessionResponse = z.infer<typeof classSessionResponseSchema>;
