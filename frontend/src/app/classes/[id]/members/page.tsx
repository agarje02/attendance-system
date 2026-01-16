"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Check, X, Trash2 } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listClassMembers,
  addClassMember,
  requestToJoinClass,
  updateClassMember,
  removeClassMember,
  listManagedUsers,
  getClass,
  type ClassMember,
  type ManagedUser,
  type Class,
} from "@/lib/api";
import { DashboardNav } from "@/components/DashboardNav";
import { showToast } from "@/lib/toast";
import { useUserStore } from "@/store/userStore";

export default function ClassMembersPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const classId = params.id as string;
  const [classData, setClassData] = useState<Class | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    role: "student" as "teacher" | "student",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>(
    searchParams.get("status") || "all"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classDataRes, membersData, usersData] = await Promise.all([
          getClass(classId),
          listClassMembers({ classId }),
          listManagedUsers(),
        ]);
        setClassData(classDataRes);
        setMembers(membersData);
        setAvailableUsers(usersData);

        // Check user roles
        const userId = user ? ((user as any)?.data?.id || (user as any)?.id) : null;
        const owner = user ? (classDataRes as any).owner?.id === userId : false;
        setIsOwner(owner);

        const userManagedUsers = usersData.map((u) => u.id);
        const teacherMember = membersData.find(
          (m) =>
            m.role === "teacher" &&
            m.status === "approved" &&
            userManagedUsers.includes(m.userId)
        );
        setIsTeacher(!!teacherMember);

        const studentMember = membersData.find(
          (m) =>
            m.role === "student" &&
            m.status === "approved" &&
            userManagedUsers.includes(m.userId)
        );
        setIsStudent(!!studentMember);
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addClassMember({
        classId,
        userId: formData.userId,
        role: formData.role,
      });
      const updatedMembers = await listClassMembers({ classId });
      setMembers(updatedMembers);
      setFormData({ userId: "", role: "student" });
      setIsAddDialogOpen(false);
      showToast.success("Member added successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestToJoin = async () => {
    try {
      await requestToJoinClass({ classId });
      const updatedMembers = await listClassMembers({ classId });
      setMembers(updatedMembers);
      showToast.success("Request sent successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to send request");
    }
  };

  const handleApproveRequest = async (userId: string) => {
    try {
      await updateClassMember(classId, userId, { status: "approved" });
      const updatedMembers = await listClassMembers({ classId });
      setMembers(updatedMembers);
      showToast.success("Request approved successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to approve request");
    }
  };

  const handleRejectRequest = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      await removeClassMember(classId, userId);
      const updatedMembers = await listClassMembers({ classId });
      setMembers(updatedMembers);
      showToast.success("Request rejected");
    } catch (error: any) {
      showToast.error(error.message || "Failed to reject request");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeClassMember(classId, userId);
      const updatedMembers = await listClassMembers({ classId });
      setMembers(updatedMembers);
      showToast.success("Member removed successfully");
    } catch (error: any) {
      showToast.error(error.message || "Failed to remove member");
    }
  };

  const filteredMembers =
    filterStatus === "all"
      ? members
      : members.filter((m) => m.status === filterStatus);

  const pendingRequests = members.filter((m) => m.status === "pending");
  const canManage = isOwner || isTeacher;
  const canRequest = isStudent && !members.some((m) => m.status === "pending");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading members...</p>
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
          onClick={() => router.push(`/classes/${classId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Class
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Class Members</h1>
            <p className="text-muted-foreground">{classData.className}</p>
          </div>
          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                  <DialogDescription>
                    Select a user to add to this class.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="userId">User</Label>
                      <Select
                        id="userId"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        required
                      >
                        <option value="">Select a user</option>
                        {availableUsers
                          .filter(
                            (u) =>
                              !members.some((m) => m.userId === u.id) ||
                              members.find((m) => m.userId === u.id)?.status ===
                                "pending"
                          )
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username} ({user.role})
                            </option>
                          ))}
                      </Select>
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
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Member"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {canRequest && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Want to join this class?</p>
                  <p className="text-sm text-muted-foreground">
                    Send a request to join as a student
                  </p>
                </div>
                <Button onClick={handleRequestToJoin}>Request to Join</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {pendingRequests.length > 0 && canManage && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg">
                Pending Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingRequests.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{member.user?.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Role: {member.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(member.userId)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(member.userId)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-4">
          <Label htmlFor="statusFilter">Filter by Status</Label>
          <Select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="max-w-xs mt-2"
          >
            <option value="all">All Members</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No members found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    {canManage && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.userId}>
                      <TableCell className="font-medium">
                        {member.user?.username}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "teacher" ? "secondary" : "default"
                          }
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.status === "approved"
                              ? "approved"
                              : "pending"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          {member.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleApproveRequest(member.userId)
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRejectRequest(member.userId)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
