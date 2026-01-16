import {
  Clock,
  BarChart3,
  Users,
  Calendar,
  Shield,
  GraduationCap,
  Bell,
  Building2,
  Smartphone,
  FileText,
  QrCode,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "accent" | "success";
  highlights?: string[];
}

export const features: Feature[] = [
  {
    icon: QrCode,
    title: "Digital Attendance",
    description:
      "Say goodbye to paper registers! Mark attendance digitally with QR codes, biometrics, or simple tap-to-mark. Instant sync across all devices with zero paperwork.",
    color: "primary",
    highlights: ["QR Code Check-in", "Biometric Support", "One-tap Marking"],
  },
  {
    icon: GraduationCap,
    title: "Student Management",
    description:
      "Complete student profiles with attendance history, academic progress, and behavioral records. Parents can track their child's daily activities and receive instant updates.",
    color: "accent",
    highlights: ["Student Profiles", "Attendance History", "Parent Portal"],
  },
  {
    icon: Users,
    title: "Teacher Dashboard",
    description:
      "Empower teachers with dedicated dashboards. Manage classes, mark attendance, add session notes, and communicate with parents—all from one intuitive interface.",
    color: "success",
    highlights: ["Class Management", "Session Notes", "Leave Tracking"],
  },
  {
    icon: Calendar,
    title: "Smart Timetable",
    description:
      "Intelligent timetable scheduling that prevents conflicts. Drag-and-drop interface for easy modifications. Auto-notify students and teachers of schedule changes.",
    color: "primary",
    highlights: ["Drag & Drop", "Conflict Detection", "Auto Notifications"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Powerful insights at your fingertips. Track attendance trends, identify patterns, generate PDF reports, and make data-driven decisions to improve student outcomes.",
    color: "accent",
    highlights: ["Visual Dashboards", "PDF Reports", "Trend Analysis"],
  },
  {
    icon: Clock,
    title: "Live Class Sessions",
    description:
      "Start live sessions with one click. Real-time attendance marking, session recordings, topic summaries, and automatic session history for future reference.",
    color: "success",
    highlights: ["One-click Start", "Auto Recording", "Session History"],
  },
  {
    icon: Building2,
    title: "Multi-Branch Support",
    description:
      "Manage multiple schools, departments, or branches from a single admin panel. Compare performance across locations and maintain consistent standards.",
    color: "primary",
    highlights: ["Central Dashboard", "Branch Comparison", "Unified Standards"],
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Automated SMS and email alerts for parents when students are absent or late. Custom reminders for fees, events, PTMs, and important announcements.",
    color: "accent",
    highlights: ["SMS & Email", "Absence Alerts", "Event Reminders"],
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Secure multi-level access control. Principals see everything, teachers see their classes, students see their data. Full audit trails for compliance.",
    color: "success",
    highlights: ["Multi-level Access", "Audit Trails", "Data Privacy"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Ready",
    description:
      "Access everything on the go with our mobile-friendly design. Teachers mark attendance from phones, parents track progress, students check schedules—anywhere, anytime.",
    color: "primary",
    highlights: ["iOS & Android", "Offline Mode", "Push Notifications"],
  },
  {
    icon: FileText,
    title: "Exam & Results",
    description:
      "Manage exams, upload results, and generate report cards. Track academic performance alongside attendance to get the complete picture of student progress.",
    color: "accent",
    highlights: ["Result Management", "Report Cards", "Performance Tracking"],
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description:
      "Built-in messaging system for teacher-parent communication. Broadcast announcements, share updates, and keep everyone in the loop effortlessly.",
    color: "success",
    highlights: ["Direct Messaging", "Announcements", "Group Chats"],
  },
];

// Hero section features (short list)
export const heroFeatures = [
  "Digital attendance tracking",
  "Smart timetable management",
  "Real-time parent updates",
];

// Feature stats for the section
export const featureStats = [
  { value: "2 sec", label: "Average check-in time" },
  { value: "100%", label: "Paperless operation" },
  { value: "24/7", label: "Access anywhere" },
  { value: "99.9%", label: "Uptime guarantee" },
];
