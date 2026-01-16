"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Building2, Edit, Trash2 } from "lucide-react";
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
import { listDepartments, createDepartment, deleteDepartment, listSchools, type Department, type School } from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";
import { showToast } from "@/lib/toast";

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({ schoolId: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, schoolsData] = await Promise.all([
          listDepartments(),
          listSchools(),
        ]);
        setDepartments(departmentsData);
        setSchools(schoolsData);
        if (schoolsData.length > 0 && !selectedSchoolId) {
          setSelectedSchoolId(schoolsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedSchoolId) {
        try {
          const data = await listDepartments(selectedSchoolId);
          setDepartments(data);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      }
    };

    fetchDepartments();
  }, [selectedSchoolId]);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId) {
      showToast.warning("Please select a school");
      return;
    }
    setIsSubmitting(true);
    try {
      const newDepartment = await createDepartment(formData);
      setDepartments([newDepartment, ...departments]);
      setFormData({ schoolId: selectedSchoolId || "", name: "" });
      setIsCreateDialogOpen(false);
      showToast.success("Department created successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    setIsDeleting(id);
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
      showToast.success("Department deleted successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to delete department");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading departments...</p>
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
            <h1 className="text-4xl font-bold mb-2">Departments</h1>
            <p className="text-muted-foreground">
              Manage departments within your schools
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={schools.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Select a school and enter the department name.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDepartment}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolId">School</Label>
                    <Select
                      id="schoolId"
                      value={formData.schoolId}
                      onChange={(e) =>
                        setFormData({ ...formData, schoolId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a school</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter department name"
                      required
                    />
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
                    {isSubmitting ? "Creating..." : "Create Department"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {schools.length > 0 && (
          <div className="mb-6">
            <Label htmlFor="filterSchool">Filter by School</Label>
            <Select
              id="filterSchool"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="max-w-xs mt-2"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {schools.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No schools found</h3>
              <p className="text-muted-foreground mb-4">
                You need to create a school first before creating departments
              </p>
              <Button onClick={() => router.push("/schools")}>
                Create School
              </Button>
            </CardContent>
          </Card>
        ) : departments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first department to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {department.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {department.school?.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/departments/${department.id}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/departments/${department.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDepartment(department.id)}
                      disabled={isDeleting === department.id}
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
