import { Response } from "express";

/**
 * Validates that a value exists
 */
export const validateRequired = <T>(
  value: T | null | undefined,
  fieldName: string
): string | null => {
  if (value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validates that a class belongs to the user (owner or teacher member)
 * Note: This function is deprecated. Use direct Prisma queries in route handlers instead.
 * @deprecated Use direct ownership checks in route handlers
 */
export const validateClassOwnership = (
  classOwnerId: string,
  currentUserId: string
): string | null => {
  if (classOwnerId !== currentUserId) {
    return "You are not authorized to perform this action on this class";
  }
  return null;
};

/**
 * Helper to send validation error response
 */
export const sendValidationError = (
  res: Response,
  error: string,
  statusCode: number = 400
): Response => {
  return res.status(statusCode).json({ success: false, error });
};
