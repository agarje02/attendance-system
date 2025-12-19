import { WebSocketServer, WebSocket } from "ws";

/**
 * WebSocket error response interface
 */
export interface WebSocketErrorResponse {
  event: "ERROR";
  data: {
    message: string;
  };
}

/**
 * Error message constants for WebSocket
 */
export const WS_ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized or invalid token",
  FORBIDDEN_TEACHER: "Forbidden, teacher event only",
  FORBIDDEN_STUDENT: "Forbidden, student event only",
  NO_ACTIVE_SESSION: "No active attendance session",
  CLASS_NOT_FOUND: "Class not found",
  INTERNAL_ERROR: "Internal server error",
  INVALID_EVENT: "Invalid event",
} as const;

/**
 * Create WebSocket error response object
 */
export const createWebSocketError = (message: string): WebSocketErrorResponse => {
  return {
    event: "ERROR",
    data: {
      message,
    },
  };
};

/**
 * Send error to WebSocketServer (emits to error event)
 */
export const emitWSError = (wss: WebSocketServer, message: string): void => {
  const error = createWebSocketError(message);
  wss.emit("error", JSON.stringify(error));
};

/**
 * Send error to specific WebSocket client
 */
export const sendWSErrorToClient = (ws: WebSocket, message: string): void => {
  const error = createWebSocketError(message);
  ws.send(JSON.stringify(error));
};

/**
 * Send unauthorized error (Invalid JWT) - emits to server
 */
export const sendWSUnauthorizedError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.UNAUTHORIZED);
};

/**
 * Send unauthorized error to specific client
 */
export const sendWSUnauthorizedErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.UNAUTHORIZED);
};

/**
 * Send forbidden error for teacher-only events - emits to server
 */
export const sendWSForbiddenTeacherError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.FORBIDDEN_TEACHER);
};

/**
 * Send forbidden error for teacher-only events to specific client
 */
export const sendWSForbiddenTeacherErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.FORBIDDEN_TEACHER);
};

/**
 * Send forbidden error for student-only events - emits to server
 */
export const sendWSForbiddenStudentError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.FORBIDDEN_STUDENT);
};

/**
 * Send forbidden error for student-only events to specific client
 */
export const sendWSForbiddenStudentErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.FORBIDDEN_STUDENT);
};

/**
 * Send no active session error - emits to server
 */
export const sendWSNoActiveSessionError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.NO_ACTIVE_SESSION);
};

/**
 * Send no active session error to specific client
 */
export const sendWSNoActiveSessionErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.NO_ACTIVE_SESSION);
};

/**
 * Send class not found error - emits to server
 */
export const sendWSClassNotFoundError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.CLASS_NOT_FOUND);
};

/**
 * Send class not found error to specific client
 */
export const sendWSClassNotFoundErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.CLASS_NOT_FOUND);
};

/**
 * Send internal server error - emits to server
 */
export const sendWSInternalError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.INTERNAL_ERROR);
};

/**
 * Send internal server error to specific client
 */
export const sendWSInternalErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.INTERNAL_ERROR);
};

/**
 * Send invalid event error - emits to server
 */
export const sendWSInvalidEventError = (wss: WebSocketServer): void => {
  emitWSError(wss, WS_ERROR_MESSAGES.INVALID_EVENT);
};

/**
 * Send invalid event error to specific client
 */
export const sendWSInvalidEventErrorToClient = (ws: WebSocket): void => {
  sendWSErrorToClient(ws, WS_ERROR_MESSAGES.INVALID_EVENT);
};

/**
 * Generic WebSocket error helper - emits to server
 * Allows custom error messages
 */
export const sendWSError = (wss: WebSocketServer, message: string): void => {
  emitWSError(wss, message);
};

/**
 * Generic WebSocket error helper - sends to client
 * Allows custom error messages
 */
export const sendWSCustomErrorToClient = (ws: WebSocket, message: string): void => {
  sendWSErrorToClient(ws, message);
};
