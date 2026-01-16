"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDepartment, type Department } from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await getDepartment(departmentId);
        setDepartment(data);
      } catch (error) {
        console.error("Error fetching department:", error);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      fetchDepartment();
    }
  }, [departmentId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading department...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Department not found</p>
          <Button onClick={() => router.push("/departments")} className="mt-4">
            Back to Departments
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
          onClick={() => router.push("/departments")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Departments
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{department.name}</h1>
          <p className="text-muted-foreground">
            {department.school?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Managed Users
              </CardTitle>
              <CardDescription>
                {department._count?.managedUsers || 0} user
                {(department._count?.managedUsers || 0) !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => router.push(`/managed-users?departmentId=${departmentId}`)}
              >
                View Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Classes
              </CardTitle>
              <CardDescription>
                {department._count?.classes || 0} class
                {(department._count?.classes || 0) !== 1 ? "es" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => router.push(`/classes?departmentId=${departmentId}`)}
              >
                View Classes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
