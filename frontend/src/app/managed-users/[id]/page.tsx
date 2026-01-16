"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getManagedUser, type ManagedUser } from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";

export default function ManagedUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getManagedUser(userId);
        setUser(data);
      } catch (error) {
        console.error("Error fetching managed user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
          <Button onClick={() => router.push("/managed-users")} className="mt-4">
            Back to Users
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
          onClick={() => router.push("/managed-users")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription className="mt-2">
                  <Badge
                    variant={user.role === "teacher" ? "secondary" : "default"}
                  >
                    {user.role}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Department
              </h3>
              <p className="text-lg">
                {user.department?.name || "No department assigned"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Class Memberships
              </h3>
              <p className="text-lg">
                {user._count?.classMemberships || 0} class
                {(user._count?.classMemberships || 0) !== 1 ? "es" : ""}
              </p>
            </div>
            {user.role === "teacher" && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Teaching Sessions
                </h3>
                <p className="text-lg">
                  {user._count?.teachingSessions || 0} session
                  {(user._count?.teachingSessions || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            <div className="pt-4">
              <Button
                onClick={() => router.push(`/managed-users/${userId}/edit`)}
              >
                Edit User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
