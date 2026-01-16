import { getCurrentUser, logout as apiLogout } from './api';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  [key: string]: any;
}

/**
 * Check if user is authenticated by verifying token exists
 * This is a client-side check - actual verification happens on the server
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if token cookie exists
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('token=')
  );
  
  return !!tokenCookie;
}

/**
 * Get current authenticated user
 * Returns null if not authenticated or if there's an error
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Logout user by clearing cookies and calling logout API
 */
export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Call logout API endpoint to clear httpOnly cookies on the server
    await apiLogout();
  } catch (error) {
    // Ignore errors - backend should still clear cookies
    console.error(error);
  }
  

}
