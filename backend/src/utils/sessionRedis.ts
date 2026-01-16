import { redis } from '../config/redis';

const SESSION_PREFIX = 'session:';
const SESSION_ATTENDANCE_PREFIX = 'session:attendance:';

/**
 * Get a live session from Redis
 */
export const getLiveSession = async (sessionId: string): Promise<any | null> => {
    try {
        const sessionData = await redis.get(`${SESSION_PREFIX}${sessionId}`);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error('Error getting live session from Redis:', error);
        return null;
    }
};

/**
 * Store a live session in Redis
 */
export const setLiveSession = async (sessionId: string, sessionData: any, ttl: number = 86400): Promise<void> => {
    try {
        await redis.setEx(`${SESSION_PREFIX}${sessionId}`, ttl, JSON.stringify(sessionData));
    } catch (error) {
        console.error('Error setting live session in Redis:', error);
        throw error;
    }
};

/**
 * Get attendance for a live session from Redis
 */
export const getLiveSessionAttendance = async (sessionId: string): Promise<Record<string, string> | null> => {
    try {
        const attendanceData = await redis.get(`${SESSION_ATTENDANCE_PREFIX}${sessionId}`);
        return attendanceData ? JSON.parse(attendanceData) : null;
    } catch (error) {
        console.error('Error getting live session attendance from Redis:', error);
        return null;
    }
};

/**
 * Update attendance for a live session in Redis
 */
export const updateLiveSessionAttendance = async (
    sessionId: string,
    attendance: Record<string, string>,
    ttl: number = 86400
): Promise<void> => {
    try {
        await redis.setEx(`${SESSION_ATTENDANCE_PREFIX}${sessionId}`, ttl, JSON.stringify(attendance));
    } catch (error) {
        console.error('Error updating live session attendance in Redis:', error);
        throw error;
    }
};

/**
 * Delete a live session from Redis
 */
export const deleteLiveSession = async (sessionId: string): Promise<void> => {
    try {
        await redis.del(`${SESSION_PREFIX}${sessionId}`);
        await redis.del(`${SESSION_ATTENDANCE_PREFIX}${sessionId}`);
    } catch (error) {
        console.error('Error deleting live session from Redis:', error);
        throw error;
    }
};

/**
 * Check if a session is live (exists in Redis)
 */
export const isLiveSession = async (sessionId: string): Promise<boolean> => {
    try {
        const exists = await redis.exists(`${SESSION_PREFIX}${sessionId}`);
        return exists === 1;
    } catch (error) {
        console.error('Error checking if session is live:', error);
        return false;
    }
};
