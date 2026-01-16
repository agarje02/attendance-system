"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  School,
  Building2,
  Users,
  BookOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import {
  listSchools,
  listDepartments,
  listManagedUsers,
  listClasses,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    schools: 0,
    departments: 0,
    managedUsers: 0,
    classes: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch stats
        try {
          const [schoolsData, departmentsData, managedUsersData, classesData] =
            await Promise.all([
              listSchools(),
              listDepartments(),
              listManagedUsers(),
              listClasses(),
            ]);

          // Count pending requests (simplified - would need proper endpoint)
          let pendingCount = 0;
          // This would require iterating through classes and checking members
          // For now, we'll set it to 0

          setStats({
            schools: schoolsData.length,
            departments: departmentsData.length,
            managedUsers: managedUsersData.length,
            classes: classesData.length,
            pendingRequests: pendingCount,
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      {/* Header */}
      <DashboardNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your attendance and track your records
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push("/schools")}>
              <School className="w-4 h-4 mr-2" />
              Schools
            </Button>
            <Button onClick={() => router.push("/departments")}>
              <Building2 className="w-4 h-4 mr-2" />
              Departments
            </Button>
            <Button onClick={() => router.push("/managed-users")}>
              <Users className="w-4 h-4 mr-2" />
              Managed Users
            </Button>
            <Button onClick={() => router.push("/classes/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
            <Button onClick={() => router.push("/attendance")} variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              My Attendance
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push("/schools")}
          >
            <div className="flex items-center justify-between mb-4">
              <School className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">{stats.schools}</span>
            </div>
            <h3 className="font-semibold mb-1">Schools</h3>
            <p className="text-sm text-muted-foreground">Manage your schools</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push("/departments")}
          >
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-8 h-8 text-success" />
              <span className="text-2xl font-bold">{stats.departments}</span>
            </div>
            <h3 className="font-semibold mb-1">Departments</h3>
            <p className="text-sm text-muted-foreground">Manage departments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push("/managed-users")}
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">{stats.managedUsers}</span>
            </div>
            <h3 className="font-semibold mb-1">Managed Users</h3>
            <p className="text-sm text-muted-foreground">Students & Teachers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push("/classes")}
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">{stats.classes}</span>
            </div>
            <h3 className="font-semibold mb-1">Classes</h3>
            <p className="text-sm text-muted-foreground">Manage classes</p>
          </motion.div>
        </div>

        {stats.pendingRequests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  You have {stats.pendingRequests} pending class membership request
                  {stats.pendingRequests !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/classes")}>
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-border p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Your attendance records will appear here</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
