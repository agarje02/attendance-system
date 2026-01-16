"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSession,
  updateSession,
  markAttendance,
  finalizeSession,
  getSessionAttendance,
  getClass,
  listClassMembers,
  type ClassSession,
  type ClassMember,
} from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";
import { showToast } from "@/lib/toast";
import { useUserStore } from "@/store/userStore";

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserStore();
  const classId = params.id as string;
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<ClassSession | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({});
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log({attendance});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, classDataRes, membersData, attendanceData] =
          await Promise.all([
            getSession(sessionId),
            getClass(classId),
            listClassMembers({ classId, role: "student", status: "approved" }),
            getSessionAttendance(sessionId).catch(() => null),
          ]);
        setSession(sessionData);
        setMembers(membersData);
        const userId = user ? ((user as any)?.data?.id || (user as any)?.id) : null;
        setIsOwner(user ? (classDataRes as any).owner?.id === userId : false);

        // Check if user has a teacher member
        const userManagedUsers = await import("@/lib/api").then((api) =>
          api.listManagedUsers()
        );
        const userManagedUserIds = userManagedUsers.map((u) => u.id);
        const teacherMember = classDataRes.members?.find(
          (m) =>
            m.role === "teacher" &&
            m.status === "approved" &&
            userManagedUserIds.includes(m.userId)
        );
        setIsTeacher(!!teacherMember);
        if (attendanceData) {
          setAttendance(attendanceData?.attendance || {});
        } else if (sessionData.attendance) {
          setAttendance(sessionData?.attendance as Record<string, "present" | "absent" | "late">);
        }

        if (sessionData.summary) {
          setSummary(sessionData.summary);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && classId) {
      fetchData();
    }
  }, [sessionId, classId, router]);

  const handleStartSession = async () => {
    setIsSubmitting(true);
    try {
      const updatedSession = await updateSession(sessionId, {
        startTime: new Date().toISOString(),
      });
      setSession(updatedSession);
      showToast.success("Session started successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to start session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAttendance = async (
    userId: string,
    status: "present" | "absent" | "late"
  ) => {
    const newAttendance = { ...attendance, [userId]: status };
    setAttendance(newAttendance);
    try {
      await markAttendance(sessionId, { attendance: newAttendance });
      showToast.success("Attendance marked successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to mark attendance");
      // Revert on error
      setAttendance(attendance);
    }
  };

  const handleUpdateSummary = async () => {
    setIsSubmitting(true);
    try {
      const updatedSession = await updateSession(sessionId, {
        summary,
      });
      setSession(updatedSession);
      showToast.success("Summary updated successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to update summary");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    setIsSubmitting(true);
    try {
      const updatedSession = await updateSession(sessionId, {
        endTime: new Date().toISOString(),
      });
      setSession(updatedSession);
      showToast.success("Session ended successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to end session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeSession = async () => {
    if (
      !confirm(
        "Are you sure you want to finalize this session? This action cannot be undone."
      )
    )
      return;
    setIsSubmitting(true);
    try {
      const finalizedSession = await finalizeSession(sessionId);
      setSession(finalizedSession);
      showToast.success("Session finalized successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to finalize session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not started";
    return new Date(dateString).toLocaleString();
  };

  const canManage = isOwner || isTeacher;
  const isActive = session && !session.isFinalized && session.startTime && !session.endTime;
  const canEdit = canManage && !session?.isFinalized;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Session not found</p>
          <Button
            onClick={() => router.push(`/classes/${classId}/sessions`)}
            className="mt-4"
          >
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      <DashboardNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/classes/${classId}/sessions`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Session Details</h1>
              <Badge
                variant={session.isFinalized ? "approved" : "pending"}
                className="mb-2"
              >
                {session.isFinalized ? "Finalized" : "Active"}
              </Badge>
            </div>
            {canManage && !session.isFinalized && (
              <div className="flex gap-2">
                {!session.startTime && (
                  <Button onClick={handleStartSession} disabled={isSubmitting}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                )}
                {isActive && (
                  <Button
                    onClick={handleEndSession}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                )}
                {session.endTime && !session.isFinalized && (
                  <Button onClick={handleFinalizeSession} disabled={isSubmitting}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalize
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduled: {formatDate(session.scheduledTime)}
            </div>
            {session.startTime && (
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Started: {formatDate(session.startTime)}
              </div>
            )}
            {session.endTime && (
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Ended: {formatDate(session.endTime)}
              </div>
            )}
          </div>
        </div>

        {canEdit && isActive && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Click on the status buttons to mark each student's attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.userId}>
                      <TableCell className="font-medium">
                        {member.user?.username}
                      </TableCell>
                      <TableCell>
                        {attendance[member.userId] ? (
                          <Badge
                            variant={
                              attendance[member.userId] === "present"
                                ? "approved"
                                : attendance[member.userId] === "late"
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {attendance[member.userId]}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not marked</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              attendance[member.userId] === "present"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleMarkAttendance(member.userId, "present")
                            }
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              attendance[member.userId] === "late"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleMarkAttendance(member.userId, "late")
                            }
                          >
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              attendance[member.userId] === "absent"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleMarkAttendance(member.userId, "absent")
                            }
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!canEdit && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.userId}>
                      <TableCell className="font-medium">
                        {member.user?.username}
                      </TableCell>
                      <TableCell>
                        {attendance[member.userId] ? (
                          <Badge
                            variant={
                              attendance[member.userId] === "present"
                                ? "approved"
                                : attendance[member.userId] === "late"
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {attendance[member.userId]}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not marked</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {canEdit ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Enter session summary or notes"
                    rows={6}
                  />
                </div>
                <Button onClick={handleUpdateSummary} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Summary"}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {session.summary || "No summary available"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
