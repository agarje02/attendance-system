"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessions, getClass, type ClassSession, type Class } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { DashboardNav } from "@/components/DashboardNav";

export default function SessionsPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getAuthUser();
        if (!user) {
          router.push("/login");
          return;
        }
        const [sessionsData, classDataRes] = await Promise.all([
          getSessions({ classId }),
          getClass(classId),
        ]);
        setSessions(sessionsData);
        setClassData(classDataRes);
        const userId = (user as any)?.data?.id || (user as any)?.id;
        setIsOwner((classDataRes as any).owner?.id === userId);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const canManage = isOwner || isTeacher;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
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
          onClick={() => router.push(`/classes/${classId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Class
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Attendance Sessions</h1>
            <p className="text-muted-foreground">
              {classData?.className}
            </p>
          </div>
          {canManage && (
            <Button onClick={() => router.push(`/classes/${classId}/sessions/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-4">
                {canManage
                  ? "Create your first attendance session"
                  : "No attendance sessions have been created yet"}
              </p>
              {canManage && (
                <Button
                  onClick={() => router.push(`/classes/${classId}/sessions/create`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/classes/${classId}/sessions/${session.id}`)
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Session
                    </CardTitle>
                    <Badge
                      variant={session.isFinalized ? "approved" : "pending"}
                    >
                      {session.isFinalized ? "Finalized" : "Active"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Scheduled: {formatDate(session.scheduledTime)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {session.startTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        Started: {formatDate(session.startTime)}
                      </div>
                    )}
                    {session.endTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Ended: {formatDate(session.endTime)}
                      </div>
                    )}
                    {session.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.summary}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
