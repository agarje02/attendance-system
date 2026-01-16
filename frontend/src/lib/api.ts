import type {
  School,
  SchoolCreate,
  SchoolUpdate,
  Department,
  DepartmentCreate,
  DepartmentUpdate,
  ManagedUser,
  ManagedUserCreate,
  ManagedUserUpdate,
  Class,
  ClassCreate,
  ClassUpdate,
  ClassMember,
  ClassMemberCreate,
  ClassMemberUpdate,
  RequestToJoinClass,
  ClassSession,
  ClassSessionCreate,
  ClassSessionUpdate,
  StartAttendanceRequest,
  MarkAttendanceRequest,
  SessionAttendance,
  ApiResponse,
} from '@/types';
export * from '@/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export interface GoogleAuthResponse {
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      (data as any).error || `Request failed with status ${response.status}`
    );
  }

  return data.data;
}

export async function signup(credentials: SignupCredentials): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(credentials),
  });

  const data: SignupResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

export async function loginWithEmail(credentials: LoginCredentials): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Login failed');
  }

  const data = await response.json();
  return data;
}

export async function loginWithGoogle(googleData: GoogleAuthResponse): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/signup-with-google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(googleData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Google login failed');
  }

  const data = await response.json();
  return data;
}

export async function getCurrentUser(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  try {
    // Call logout endpoint if it exists (optional)
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    // Ignore errors if logout endpoint doesn't exist
    // Cookies will be cleared on the client side
  }
}

// ==================== School API ====================

export async function listSchools(): Promise<School[]> {
  return apiCall<School[]>('/schools');
}

export async function createSchool(data: SchoolCreate): Promise<School> {
  return apiCall<School>('/schools', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSchool(id: string): Promise<School> {
  return apiCall<School>(`/schools/${id}`);
}

export async function updateSchool(
  id: string,
  data: SchoolUpdate
): Promise<School> {
  return apiCall<School>(`/schools/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSchool(id: string): Promise<void> {
  await apiCall<void>(`/schools/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Department API ====================

export async function listDepartments(schoolId?: string): Promise<Department[]> {
  const url = schoolId ? `/departments?schoolId=${schoolId}` : '/departments';
  return apiCall<Department[]>(url);
}

export async function createDepartment(
  data: DepartmentCreate
): Promise<Department> {
  return apiCall<Department>('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getDepartment(id: string): Promise<Department> {
  return apiCall<Department>(`/departments/${id}`);
}

export async function updateDepartment(
  id: string,
  data: DepartmentUpdate
): Promise<Department> {
  return apiCall<Department>(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDepartment(id: string): Promise<void> {
  await apiCall<void>(`/departments/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Managed User API ====================

export async function listManagedUsers(filters?: {
  role?: 'teacher' | 'student';
  departmentId?: string;
}): Promise<ManagedUser[]> {
  const params = new URLSearchParams();
  if (filters?.role) params.append('role', filters.role);
  if (filters?.departmentId) params.append('departmentId', filters.departmentId);
  const query = params.toString();
  const url = query ? `/managed-users?${query}` : '/managed-users';
  return apiCall<ManagedUser[]>(url);
}

export async function createManagedUser(
  data: ManagedUserCreate
): Promise<ManagedUser> {
  return apiCall<ManagedUser>('/managed-users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getManagedUser(id: string): Promise<ManagedUser> {
  return apiCall<ManagedUser>(`/managed-users/${id}`);
}

export async function updateManagedUser(
  id: string,
  data: ManagedUserUpdate
): Promise<ManagedUser> {
  return apiCall<ManagedUser>(`/managed-users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteManagedUser(id: string): Promise<void> {
  await apiCall<void>(`/managed-users/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Class API ====================

export async function listClasses(departmentId?: string): Promise<Class[]> {
  const url = departmentId ? `/class?departmentId=${departmentId}` : '/class';
  return apiCall<Class[]>(url);
}

export async function createClass(data: ClassCreate): Promise<Class> {
  return apiCall<Class>('/class', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getClass(id: string): Promise<Class> {
  return apiCall<Class>(`/class/${id}`);
}

export async function updateClass(
  id: string,
  data: ClassUpdate
): Promise<Class> {
  return apiCall<Class>(`/class/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteClass(id: string): Promise<void> {
  await apiCall<void>(`/class/${id}`, {
    method: 'DELETE',
  });
}

export async function getMyAttendanceByClassId(
  classId: string
): Promise<any> {
  return apiCall<any>(`/class/${classId}/my-attendance`);
}

// ==================== Class Member API ====================

export async function listClassMembers(filters: {
  classId: string;
  role?: 'teacher' | 'student';
  status?: 'pending' | 'approved';
}): Promise<ClassMember[]> {
  const params = new URLSearchParams();
  params.append('classId', filters.classId);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  return apiCall<ClassMember[]>(`/class-members?${params.toString()}`);
}

export async function addClassMember(
  data: ClassMemberCreate
): Promise<ClassMember> {
  return apiCall<ClassMember>('/class-members', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function requestToJoinClass(
  data: RequestToJoinClass
): Promise<ClassMember> {
  return apiCall<ClassMember>('/class-members/request', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClassMember(
  classId: string,
  userId: string,
  data: ClassMemberUpdate
): Promise<ClassMember> {
  return apiCall<ClassMember>(`/class-members/${classId}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function removeClassMember(
  classId: string,
  userId: string
): Promise<void> {
  await apiCall<void>(`/class-members/${classId}/${userId}`, {
    method: 'DELETE',
  });
}

// ==================== Attendance/Session API ====================

export async function startAttendance(
  data: StartAttendanceRequest
): Promise<ClassSession> {
  return apiCall<ClassSession>('/attendance/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createSession(
  data: ClassSessionCreate
): Promise<ClassSession> {
  return apiCall<ClassSession>('/attendance/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSessions(filters?: {
  classId?: string;
  isFinalized?: boolean;
  teacherId?: string;
  ownerTeacherId?: string;
}): Promise<ClassSession[]> {
  const params = new URLSearchParams();
  if (filters?.classId) params.append('classId', filters.classId);
  if (filters?.isFinalized !== undefined)
    params.append('isFinalized', String(filters.isFinalized));
  if (filters?.teacherId) params.append('teacherId', filters.teacherId);
  if (filters?.ownerTeacherId)
    params.append('ownerTeacherId', filters.ownerTeacherId);
  const query = params.toString();
  const url = query ? `/attendance/sessions?${query}` : '/attendance/sessions';
  return apiCall<ClassSession[]>(url);
}

export async function getSession(id: string): Promise<ClassSession> {
  return apiCall<ClassSession>(`/attendance/sessions/${id}`);
}

export async function updateSession(
  id: string,
  data: ClassSessionUpdate
): Promise<ClassSession> {
  return apiCall<ClassSession>(`/attendance/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function markAttendance(
  sessionId: string,
  data: MarkAttendanceRequest
): Promise<ClassSession> {
  return apiCall<ClassSession>(`/attendance/sessions/${sessionId}/mark`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function finalizeSession(sessionId: string): Promise<ClassSession> {
  return apiCall<ClassSession>(`/attendance/sessions/${sessionId}/finalize`, {
    method: 'POST',
  });
}

export async function getSessionAttendance(
  sessionId: string
): Promise<SessionAttendance> {
  return apiCall<SessionAttendance>(
    `/attendance/sessions/${sessionId}/attendance`
  );
}
