export type ActiveSession = {
    classId: string | null;
    startedAt: string | null;
    attendance: Record<string, string>;
}

export const activeSession: ActiveSession = {
    classId: null,
    startedAt: null,
    attendance: {}
}