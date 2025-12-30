import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attendify - Smart Attendance Management System",
  description:
    "Transform how you track and manage attendance. Real-time updates, smart analytics, and seamless collaboration for your organization.",
  keywords: [
    "attendance",
    "attendance management",
    "time tracking",
    "employee management",
    "HR software",
    "workforce management",
  ],
  authors: [{ name: "Attendify" }],
  openGraph: {
    title: "Attendify - Smart Attendance Management System",
    description:
      "Transform how you track and manage attendance. Real-time updates, smart analytics, and seamless collaboration.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attendify - Smart Attendance Management System",
    description:
      "Transform how you track and manage attendance. Real-time updates, smart analytics, and seamless collaboration.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
