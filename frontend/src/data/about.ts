import { Target, Heart, Lightbulb, TrendingUp, LucideIcon } from "lucide-react";

export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const companyValues: Value[] = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're on a mission to eliminate manual attendance tracking and give organizations the tools they need to thrive.",
  },
  {
    icon: Heart,
    title: "User-Focused",
    description:
      "Every feature we build starts with understanding our users' needs. Your success is our priority.",
  },
  {
    icon: Lightbulb,
    title: "Innovative",
    description:
      "We continuously push boundaries with cutting-edge technology like AI and real-time analytics.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Oriented",
    description:
      "We scale with you—from startups to enterprises, our platform grows alongside your organization.",
  },
];

export const companyStats: Stat[] = [
  { value: "2M+", label: "Check-ins daily" },
  { value: "150+", label: "Countries" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "2,000+", label: "Organizations" },
];
