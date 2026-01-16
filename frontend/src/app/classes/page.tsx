"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Edit, Trash2, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listClasses, deleteClass, type Class } from "@/lib/api";
import { showToast } from "@/lib/toast";

interface ClassWithCount extends Class {
  _count?: {
    members?: number;
    sessions?: number;
  };
}

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await listClasses();
        setClasses(data as ClassWithCount[]);
      } catch (error: any) {
        console.error("Error fetching classes:", error);
        showToast.error(error.message || "Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await deleteClass(id);
      setClasses(classes.filter((c) => c.id !== id));
      showToast.success("Class deleted successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to delete class");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading classes...</p>
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
            <h1 className="text-4xl font-bold mb-2">Classes</h1>
            <p className="text-muted-foreground">
              Manage your classes and attendance
            </p>
          </div>
          <Button onClick={() => router.push("/classes/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        </div>

        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first class to get started
              </p>
              <Button onClick={() => router.push("/classes/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {classItem.className}
                      </CardTitle>
                      {classItem.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {classItem.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        {classItem.department && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Dept:</span> {classItem.department.name}
                          </span>
                        )}
                        {classItem._count?.members !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {classItem._count.members} member{classItem._count.members !== 1 ? "s" : ""}
                          </span>
                        )}
                        {classItem._count?.sessions !== undefined && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {classItem._count.sessions} session{classItem._count.sessions !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/classes/${classItem.id}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/classes/${classItem.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClass(classItem.id)}
                      disabled={isDeleting === classItem.id}
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
