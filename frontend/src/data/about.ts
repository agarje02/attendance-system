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
      "We're transforming how schools manage attendance and progress tracking, making education administration effortless.",
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description:
      "Every feature is designed with students, teachers, and parents in mind. Better tracking means better outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovative",
    description:
      "We leverage modern technology to bring real-time insights, live sessions, and smart analytics to educational institutions.",
  },
  {
    icon: TrendingUp,
    title: "Scalable",
    description:
      "From small schools to large universities and organizations, our platform grows with your institution.",
  },
];

export const companyStats: Stat[] = [
  { value: "50K+", label: "Students tracked" },
  { value: "500+", label: "Schools" },
  { value: "99.9%", label: "Uptime" },
  { value: "10K+", label: "Teachers" },
];
