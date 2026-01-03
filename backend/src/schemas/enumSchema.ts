import { z } from 'zod';

/**
 * Enum schemas matching Prisma enums
 */
export const managedUserRoleSchema = z.enum(['teacher', 'student']);
export const classMemberRoleSchema = z.enum(['teacher', 'student']);
export const classMemberStatusSchema = z.enum(['pending', 'approved']);

export type ManagedUserRole = z.infer<typeof managedUserRoleSchema>;
export type ClassMemberRole = z.infer<typeof classMemberRoleSchema>;
export type ClassMemberStatus = z.infer<typeof classMemberStatusSchema>;

