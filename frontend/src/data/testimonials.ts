export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string | null;
  initials: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "HR Director",
    company: "TechCorp Inc.",
    image: null,
    initials: "SC",
    content:
      "Attendify has completely transformed how we manage attendance. What used to take hours now happens automatically. Our HR team's productivity has increased by 40%.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "School Principal",
    company: "Lincoln High School",
    image: null,
    initials: "MR",
    content:
      "The real-time notifications are a game-changer for our school. Parents love getting instant updates about their children's attendance. It's made communication so much easier.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Operations Manager",
    company: "Global Retail Co.",
    image: null,
    initials: "EJ",
    content:
      "Managing attendance across 50 locations used to be a nightmare. With Attendify, I can see everything from one dashboard. The analytics have helped us reduce absenteeism by 25%.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "CEO",
    company: "StartupHub",
    image: null,
    initials: "DK",
    content:
      "As a startup, we needed something simple yet powerful. Attendify delivers on both fronts. Setup took 10 minutes, and our team loves how easy it is to use.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "University Administrator",
    company: "State University",
    image: null,
    initials: "LT",
    content:
      "With over 30,000 students, we needed a robust solution. Attendify scales beautifully and the support team is incredibly responsive. Best decision we've made.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Factory Manager",
    company: "Industrial Solutions",
    image: null,
    initials: "JW",
    content:
      "The shift management features are exactly what we needed. Our workers clock in and out seamlessly, and the reports help us optimize schedules perfectly.",
    rating: 5,
  },
];

export const trustedLogos = [
  "TechCorp",
  "EduFirst",
  "HealthPlus",
  "RetailMax",
  "BuildPro",
  "FinanceHub",
];
