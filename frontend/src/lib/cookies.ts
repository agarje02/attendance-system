"use client";

import Cookies from "universal-cookie";

// Create a singleton instance for setting cookies outside React components
const cookies = typeof window !== "undefined" ? new Cookies() : null;

/**
 * Set a cookie value
 */
export function setCookie(name: string, value: string, options?: {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}): void {
  if (typeof window === "undefined" || !cookies) return;
  
  cookies.set(name, value, {
    path: "/",
    ...options,
  });
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | undefined {
  if (typeof window === "undefined" || !cookies) return undefined;
  return cookies.get(name);
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string, options?: {
  path?: string;
  domain?: string;
}): void {
  if (typeof window === "undefined" || !cookies) return;
  cookies.remove(name, {
    path: "/",
    ...options,
  });
}
