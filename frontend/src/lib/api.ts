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
