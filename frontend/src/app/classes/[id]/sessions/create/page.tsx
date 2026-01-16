"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSession, getClass, listManagedUsers, type Class, type ManagedUser } from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";
import { showToast } from "@/lib/toast";

export default function CreateSessionPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const [classData, setClassData] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    scheduledTime: "",
    teacherId: "",
    summary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classDataRes, teachersData] = await Promise.all([
          getClass(classId),
          listManagedUsers({ role: "teacher" }),
        ]);
        setClassData(classDataRes);
        setTeachers(teachersData);
        // Set default scheduled time to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setFormData({
          ...formData,
          scheduledTime: now.toISOString().slice(0, 16),
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const scheduledDateTime = new Date(formData.scheduledTime);
      const payload: any = {
        classId,
        scheduledTime: scheduledDateTime.toISOString(),
      };
      if (formData.teacherId) {
        payload.teacherId = formData.teacherId;
      }
      if (formData.summary) {
        payload.summary = formData.summary;
      }
      const session = await createSession(payload);
      showToast.success("Session created successfully");
      router.push(`/classes/${classId}/sessions/${session.id}`);
    } catch (error: any) {
      showToast.error(error.message || "Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Create Attendance Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacherId">Teacher (optional)</Label>
                <select
                  id="teacherId"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className="flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2 text-sm"
                >
                  <option value="">None (use owner)</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="summary">Summary/Notes (optional)</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Enter session summary or notes"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/classes/${classId}/sessions`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Session"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
