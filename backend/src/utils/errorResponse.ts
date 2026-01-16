import { Response } from "express";

/**
 * Standard error response interface
 */
export interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Standard success response interface
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * Union type for all responses
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Error message constants
 */
export const ERROR_MESSAGES = {
  VALIDATION: "Invalid request schema",
  UNAUTHORIZED: "Unauthorized, token missing or invalid",
  FORBIDDEN_TEACHER: "Forbidden, teacher access required",
  FORBIDDEN_OWNERSHIP: "Forbidden, not class teacher",
  NOT_FOUND_CLASS: "Class not found",
  NOT_FOUND_USER: "User not found",
  NOT_FOUND_STUDENT: "Student not found",
  NOT_FOUND_SESSION: "Session not found",
  SESSION_ALREADY_FINALIZED: "Session is already finalized and cannot be modified",
} as const;

/**
 * Send validation error response (400)
 */
export const sendValidationError = (res: Response): Response => {
  return res.status(400).json({
    success: false,
    error: ERROR_MESSAGES.VALIDATION,
  });
};

/**
 * Send unauthorized error response (401)
 */
export const sendUnauthorizedError = (res: Response): Response => {
  return res.status(401).json({
    success: false,
    error: ERROR_MESSAGES.UNAUTHORIZED,
  });
};

/**
 * Send forbidden error response for role check (403)
 */
export const sendForbiddenTeacherError = (res: Response): Response => {
  return res.status(403).json({
    success: false,
    error: ERROR_MESSAGES.FORBIDDEN_TEACHER,
  });
};

/**
 * Send forbidden error response for ownership check (403)
 */
export const sendForbiddenOwnershipError = (res: Response): Response => {
  return res.status(403).json({
    success: false,
    error: ERROR_MESSAGES.FORBIDDEN_OWNERSHIP,
  });
};

/**
 * Send not found error response for class (404)
 */
export const sendNotFoundClassError = (res: Response): Response => {
  return res.status(404).json({
    success: false,
    error: ERROR_MESSAGES.NOT_FOUND_CLASS,
  });
};

/**
 * Send not found error response for user (404)
 */
export const sendNotFoundUserError = (res: Response): Response => {
  return res.status(404).json({
    success: false,
    error: ERROR_MESSAGES.NOT_FOUND_USER,
  });
};

/**
 * Send not found error response for student (404)
 */
export const sendNotFoundStudentError = (res: Response): Response => {
  return res.status(404).json({
    success: false,
    error: ERROR_MESSAGES.NOT_FOUND_STUDENT,
  });
};

/**
 * Send not found error response for session (404)
 */
export const sendNotFoundSessionError = (res: Response): Response => {
  return res.status(404).json({
    success: false,
    error: ERROR_MESSAGES.NOT_FOUND_SESSION,
  });
};

/**
 * Send error response for finalized session (400)
 */
export const sendSessionFinalizedError = (res: Response): Response => {
  return res.status(400).json({
    success: false,
    error: ERROR_MESSAGES.SESSION_ALREADY_FINALIZED,
  });
};

/**
 * Generic error response helper
 * Allows custom error messages with appropriate status codes
 */
export const sendErrorResponse = (
  res: Response,
  error: string,
  statusCode: number = 400
): Response => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

/**
 * Success response helper
 */
export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};
