import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { CookiesProviderWrapper } from "@/components/CookiesProviderWrapper";
import { Suspense } from "react";

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
        <CookiesProviderWrapper>
           <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div><p className="text-muted-foreground">Loading...</p></div>}>{children}</Suspense>
            <ToastProvider />
        </CookiesProviderWrapper>
      </body>
    </html>
  );
}
