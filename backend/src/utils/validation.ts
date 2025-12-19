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
 * Validates that a class belongs to the teacher
 */
export const validateClassOwnership = (
  classTeacherId: string,
  currentUserId: string
): string | null => {
  if (classTeacherId != currentUserId) {
    return "You are not authorized to start attendance for this class";
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
