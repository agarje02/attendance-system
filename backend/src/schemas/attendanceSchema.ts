import { z } from "zod";

/**
 * Schema for starting attendance request
 */
export const startAttendanceSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
});

export type StartAttendanceRequest = z.infer<typeof startAttendanceSchema>;
