"use client";

import { useEffect, useState } from "react";
import { Calendar, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/DashboardNav";

interface AttendanceRecord {
  classId: string;
  className: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

export default function AttendanceOverviewPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {

        // Get all classes where user has student memberships
        const managedUsers = await import("@/lib/api").then((api) =>
          api.listManagedUsers({ role: "student" })
        );

        const records: AttendanceRecord[] = [];

        // For each managed student user, get their class memberships and attendance
        for (const managedUser of managedUsers) {
          // Get class memberships for this student
          // Note: This would require a backend endpoint to get classes by member
          // For now, we'll show a placeholder message
        }

        setAttendanceRecords(records);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      <DashboardNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Attendance</h1>
          <p className="text-muted-foreground">
            View your attendance across all classes
          </p>
        </div>

        {attendanceRecords.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No attendance records</h3>
              <p className="text-muted-foreground">
                Your attendance records will appear here once sessions are finalized
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {attendanceRecords.map((record) => (
              <Card key={record.classId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {record.className}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {record.totalSessions} session
                        {record.totalSessions !== 1 ? "s" : ""} recorded
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        record.attendancePercentage >= 80
                          ? "approved"
                          : record.attendancePercentage >= 60
                          ? "warning"
                          : "destructive"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {record.attendancePercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {record.presentCount}
                      </div>
                      <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">
                        {record.lateCount}
                      </div>
                      <div className="text-sm text-yellow-600">Late</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">
                        {record.absentCount}
                      </div>
                      <div className="text-sm text-red-600">Absent</div>
                    </div>
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
