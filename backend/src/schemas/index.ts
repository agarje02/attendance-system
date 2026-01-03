/**
 * Central export file for all Zod schemas
 * This file exports all schemas for easy importing throughout the application
 */

// User schemas
export {
  userSignupSchema,
  userUpdateSchema,
  userResponseSchema,
  type UserSignup,
  type UserUpdate,
  type UserResponse,
} from './userSchema';
export { default as userSchema } from './userSchema';

// ManagedUser schemas
export {
  managedUserCreateSchema,
  managedUserUpdateSchema,
  managedUserResponseSchema,
  type ManagedUserCreate,
  type ManagedUserUpdate,
  type ManagedUserResponse,
} from './managedUserSchema';

// School schemas
export {
  schoolCreateSchema,
  schoolUpdateSchema,
  schoolResponseSchema,
  type SchoolCreate,
  type SchoolUpdate,
  type SchoolResponse,
} from './schoolSchema';

// Department schemas
export {
  departmentCreateSchema,
  departmentUpdateSchema,
  departmentResponseSchema,
  type DepartmentCreate,
  type DepartmentUpdate,
  type DepartmentResponse,
} from './departmentSchema';

// Class schemas
export {
  classCreateSchema,
  classUpdateSchema,
  classResponseSchema,
  type ClassCreate,
  type ClassUpdate,
  type ClassResponse,
} from './classSchema';
export { default as classSchema } from './classSchema';

// ClassMember schemas
export {
  classMemberCreateSchema,
  classMemberUpdateSchema,
  classMemberResponseSchema,
  type ClassMemberCreate,
  type ClassMemberUpdate,
  type ClassMemberResponse,
} from './classMemberSchema';

// ClassSession/Attendance schemas
export {
  startAttendanceSchema,
  classSessionCreateSchema,
  classSessionUpdateSchema,
  markAttendanceSchema,
  classSessionResponseSchema,
  type StartAttendanceRequest,
  type ClassSessionCreate,
  type ClassSessionUpdate,
  type MarkAttendance,
  type ClassSessionResponse,
} from './attendanceSchema';

// Enum schemas
export {
  managedUserRoleSchema,
  classMemberRoleSchema,
  classMemberStatusSchema,
  type ManagedUserRole,
  type ClassMemberRole,
  type ClassMemberStatus,
} from './enumSchema';

// Login schema
export { default as loginSchema } from './loginSchema';

// Response schema
export {
  successResponseSchema,
  errorResponseSchema,
  responseSchema,
  type SuccessResponseType,
  type ErrorResponseType,
  type ResponseType,
} from './responseSchema';
export { default as responseSchemaDefault } from './responseSchema';

