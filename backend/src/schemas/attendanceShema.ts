  import { z } from 'zod';  

  const attendanceSchema = z.object({
    _id: z.string(),
    classId: z.string(),
    studentId: z.string(),
    status: z.enum(["present", "absent"]),
  });

  export default attendanceSchema;

  export type Attendance = z.infer<typeof attendanceSchema>;