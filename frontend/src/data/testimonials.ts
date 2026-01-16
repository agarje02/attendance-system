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
    name: "Dr. Rajesh Patel",
    role: "Principal",
    company: "Delhi Public School",
    image: null,
    initials: "RP",
    content:
      "Attendify has revolutionized how we manage our school. From tracking 2000+ students to scheduling timetables, everything is now streamlined. Parents love the real-time attendance updates!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Vice Principal",
    company: "St. Xavier's High School",
    image: null,
    initials: "PS",
    content:
      "The timetable scheduling feature alone has saved us hours of work every week. Teachers can now focus on teaching instead of paperwork. Highly recommended for any school.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Administrator",
    company: "ABC International School",
    image: null,
    initials: "AV",
    content:
      "Managing multiple departments was chaotic before Attendify. Now I have a single dashboard view of all classes, teachers, and student attendance. The analytics help us identify attendance patterns instantly.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Department Head",
    company: "Global Academy",
    image: null,
    initials: "SJ",
    content:
      "The live class session feature is brilliant! Teachers mark attendance in real-time, add session summaries, and parents can track their child's progress. It's exactly what modern education needs.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "IT Director",
    company: "Tech University",
    image: null,
    initials: "MC",
    content:
      "We needed a scalable solution for 15,000+ students across multiple campuses. Attendify handles it beautifully. The role-based access control ensures everyone sees only what they need.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    role: "School Owner",
    company: "Bright Future Schools",
    image: null,
    initials: "AR",
    content:
      "Running a chain of schools requires robust systems. Attendify lets me monitor all branches from one place. Student progress tracking has helped us improve outcomes significantly.",
    rating: 5,
  },
];

export const trustedLogos = [
  "DPS Group",
  "Ryan Schools",
  "Kendriya Vidyalaya",
  "DAV Schools",
  "Cambridge Int'l",
  "IIT Academy",
];
