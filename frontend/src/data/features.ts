import {
  Clock,
  BarChart3,
  Users,
  Smartphone,
  Shield,
  Zap,
  Bell,
  Globe,
  LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "accent" | "success";
}

export const features: Feature[] = [
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Track attendance instantly with live updates. Know exactly who's present, late, or absent at any moment.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Gain actionable insights with powerful dashboards. Identify patterns, trends, and areas for improvement.",
    color: "accent",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Check in from anywhere with our intuitive mobile app. Works seamlessly on iOS and Android devices.",
    color: "success",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Organize employees into teams and departments. Set custom schedules and attendance policies.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with end-to-end encryption. GDPR and HIPAA compliant for peace of mind.",
    color: "accent",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Check-ins take less than 2 seconds. No more queues or waiting—just tap and go.",
    color: "success",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Automated reminders for check-ins and check-outs. Custom alerts for managers when attendance drops.",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Multi-Location Support",
    description:
      "Manage attendance across multiple offices, branches, or remote locations from a single dashboard.",
    color: "accent",
  },
];

// Hero section features (short list)
export const heroFeatures = [
  "Real-time attendance tracking",
  "Smart analytics dashboard",
  "Seamless integrations",
];
