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
  { label: "Present", value: "156", color: "success" },
  { label: "Late", value: "12", color: "primary" },
  { label: "Absent", value: "8", color: "muted" },
];

export const recentActivity: RecentActivity[] = [
  { name: "Sarah Johnson", time: "Just now", status: "checked in" },
  { name: "Mike Chen", time: "2m ago", status: "checked in" },
  { name: "Emma Wilson", time: "5m ago", status: "checked in" },
];

export const socialProof = {
  count: "2,000+",
  text: "organizations trust us",
  avatarCount: 5,
};
