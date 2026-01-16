"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Users, Calendar, Plus, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClass, type Class } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { DashboardNav } from "@/components/DashboardNav";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
console.log({isOwner});
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const user = await getAuthUser();
        if (!user) {
          router.push("/login");
          return;
        }
        const data = await getClass(classId);
        setClassData(data);
        const userId = (user as any)?.data?.id || (user as any)?.id;
        setIsOwner((data as any).owner?.id === userId);
        console.log({isOwner: (data as any).owner?.id === userId,data,user});
      } catch (error) {
        console.error("Error fetching class:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClass();
    }
  }, [classId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading class...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Class not found</p>
          <Button onClick={() => router.push("/classes")} className="mt-4">
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  const teachers = classData.members?.filter((m) => m.role === "teacher") || [];
  const students = classData.members?.filter((m) => m.role === "student") || [];
  const pendingRequests = classData.members?.filter((m) => m.status === "pending") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      <DashboardNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/classes")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Classes
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{classData.className}</h1>
          {classData.department && (
            <p className="text-muted-foreground">
              Department: {classData.department.name}
            </p>
          )}
          {classData.description && (
            <p className="text-muted-foreground mt-2">{classData.description}</p>
          )}
        </div>

        {classData.resources && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof classData.resources === "object" &&
              classData.resources.links ? (
                <ul className="list-disc list-inside space-y-2">
                  {(classData.resources.links as string[]).map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No resources available</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members
                </CardTitle>
                {(isOwner || teachers.length > 0) && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/classes/${classId}/members`)}
                  >
                    Manage
                  </Button>
                )}
              </div>
              <CardDescription>
                {teachers.length} teacher{teachers.length !== 1 ? "s" : ""},{" "}
                {students.length} student{students.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">
                    {pendingRequests.length} pending request
                    {pendingRequests.length !== 1 ? "s" : ""}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/classes/${classId}/members?status=pending`)}
                  >
                    Review Requests
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                {teachers.slice(0, 3).map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm">{member.user?.username}</span>
                    <Badge variant="secondary">Teacher</Badge>
                  </div>
                ))}
                {students.slice(0, 3).map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm">{member.user?.username}</span>
                    <Badge>Student</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Sessions
                </CardTitle>
                {(isOwner || teachers.length > 0) && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/classes/${classId}/sessions/create`)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/classes/${classId}/sessions`)}
              >
                View All Sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/classes/${classId}/members`)}
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Members
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/classes/${classId}/sessions`)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
