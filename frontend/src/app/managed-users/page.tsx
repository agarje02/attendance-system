"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  listManagedUsers,
  createManagedUser,
  deleteManagedUser,
  listDepartments,
  type ManagedUser,
  type Department,
} from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";
import { showToast } from "@/lib/toast";

export default function ManagedUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get("role") || ""
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>(
    searchParams.get("departmentId") || ""
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student" as "teacher" | "student",
    departmentId: "",
    classId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, departmentsData] = await Promise.all([
          listManagedUsers({
            role: roleFilter ? (roleFilter as "teacher" | "student") : undefined,
            departmentId: departmentFilter || undefined,
          }),
          listDepartments(),
        ]);
        setManagedUsers(usersData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleFilter, departmentFilter, router]);

  const handleCreateManagedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        username: formData.username,
        role: formData.role,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      if (formData.departmentId) {
        payload.departmentId = formData.departmentId;
      }
      if (formData.classId) {
        payload.classId = formData.classId;
      }
      const newUser = await createManagedUser(payload);
      setManagedUsers([newUser, ...managedUsers]);
      setFormData({
        username: "",
        password: "",
        role: "student",
        departmentId: "",
        classId: "",
      });
      setIsCreateDialogOpen(false);
      showToast.success("User created successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to create managed user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteManagedUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsDeleting(id);
    try {
      await deleteManagedUser(id);
      setManagedUsers(managedUsers.filter((u) => u.id !== id));
      showToast.success("User deleted successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to delete managed user");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading managed users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      <DashboardNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Managed Users</h1>
            <p className="text-muted-foreground">
              Create and manage students and teachers
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a student or teacher account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateManagedUser}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "teacher" | "student",
                        })
                      }
                      required
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departmentId">Department (optional)</Label>
                    <Select
                      id="departmentId"
                      value={formData.departmentId}
                      onChange={(e) =>
                        setFormData({ ...formData, departmentId: e.target.value })
                      }
                    >
                      <option value="">None</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="roleFilter">Filter by Role</Label>
            <Select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-2"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="departmentFilter">Filter by Department</Label>
            <Select
              id="departmentFilter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="mt-2"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {managedUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No users yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first student or teacher account
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {user.username}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Badge
                          variant={
                            user.role === "teacher" ? "secondary" : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                        {user.department?.name && (
                          <span className="text-xs">
                            {user.department.name}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/managed-users/${user.id}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/managed-users/${user.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteManagedUser(user.id)}
                      disabled={isDeleting === user.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
