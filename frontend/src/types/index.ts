// Enums matching Prisma schema
export type ManagedUserRole = 'teacher' | 'student';
export type ClassMemberRole = 'teacher' | 'student';
export type ClassMemberStatus = 'pending' | 'approved';
export type AttendanceStatus = 'present' | 'absent' | 'late';

// Base API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// School types
export interface School {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  departments?: Department[];
  _count?: {
    departments: number;
  };
}

export interface SchoolCreate {
  name: string;
}

export interface SchoolUpdate {
  name?: string;
}

// Department types
export interface Department {
  id: string;
  schoolId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
  };
  _count?: {
    managedUsers: number;
    classes: number;
  };
}

export interface DepartmentCreate {
  schoolId: string;
  name: string;
}

export interface DepartmentUpdate {
  name?: string;
}

// Managed User types
export interface ManagedUser {
  id: string;
  ownerId: string;
  username: string;
  role: ManagedUserRole;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    school?: {
      id: string;
      name: string;
    };
  };
  _count?: {
    classMemberships: number;
    teachingSessions: number;
  };
}

export interface ManagedUserCreate {
  username: string;
  password?: string;
  role: ManagedUserRole;
  departmentId?: string;
  classId?: string; // Optional class to add user to directly
}

export interface ManagedUserUpdate {
  username?: string;
  password?: string;
  role?: ManagedUserRole;
  departmentId?: string | null;
}

// Class types
export interface Class {
  id: string;
  ownerId: string;
  departmentId: string | null;
  className: string;
  description: string | null;
  resources: any | null; // JSON type
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    email: string;
    fullName?: string;
  };
  members?: ClassMember[];
  sessions?: ClassSession[];
}

export interface ClassCreate {
  className: string;
  departmentId?: string;
  description?: string;
  resources?: any;
}

export interface ClassUpdate {
  className?: string;
  departmentId?: string | null;
  description?: string | null;
  resources?: any;
}

// Class Member types
export interface ClassMember {
  classId: string;
  userId: string;
  role: ClassMemberRole;
  status: ClassMemberStatus;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    className: string;
  };
  user?: {
    id: string;
    username: string;
    role: ManagedUserRole;
    departmentId: string | null;
    department?: {
      id: string;
      name: string;
    };
  };
}

export interface ClassMemberCreate {
  classId: string;
  userId: string;
  role: ClassMemberRole;
}

export interface ClassMemberUpdate {
  role?: ClassMemberRole;
  status?: ClassMemberStatus;
}

export interface RequestToJoinClass {
  classId: string;
}

// Class Session / Attendance types
export interface ClassSession {
  id: string;
  classId: string;
  teacherId: string | null;
  ownerTeacherId: string | null;
  scheduledTime: string;
  startTime: string | null;
  endTime: string | null;
  summary: string | null;
  attendance: Record<string, AttendanceStatus> | null; // userId -> status
  isFinalized: boolean;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    className: string;
  };
}

export interface ClassSessionCreate {
  classId: string;
  teacherId?: string;
  ownerTeacherId?: string;
  scheduledTime: string | Date;
  summary?: string;
}

export interface ClassSessionUpdate {
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  summary?: string | null;
  attendance?: Record<string, AttendanceStatus>;
  isFinalized?: boolean;
}

export interface StartAttendanceRequest {
  classId: string;
}

export interface MarkAttendanceRequest {
  attendance: Record<string, AttendanceStatus>; // userId -> status
}

export interface SessionAttendance {
  sessionId: string;
  classId: string;
  attendance: Record<string, AttendanceStatus>;
  students: Array<{
    userId: string;
    username: string;
    status: AttendanceStatus;
  }>;
}
