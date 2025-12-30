const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: "teacher" | "student";
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

export async function signup(credentials: SignupCredentials): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Signup failed');
  }

  const data = await response.json();
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

