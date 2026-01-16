export interface DashboardStat {
  label: string;
  value: string;
  color: "success" | "primary" | "muted";
}

export interface RecentActivity {
  name: string;
  time: string;
  status: string;
}

export const dashboardStats: DashboardStat[] = [
  { label: "Students Present", value: "234", color: "success" },
  { label: "Classes Today", value: "18", color: "primary" },
  { label: "Teachers Active", value: "12", color: "muted" },
];

export const recentActivity: RecentActivity[] = [
  { name: "Class 10-A", time: "Just now", status: "session started" },
  { name: "Mrs. Sharma", time: "2m ago", status: "marked attendance" },
  { name: "Class 8-B", time: "5m ago", status: "session ended" },
];

export const socialProof = {
  count: "500+",
  text: "schools trust us",
  avatarCount: 5,
};
