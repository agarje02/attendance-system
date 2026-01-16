"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Calendar, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthUser, logout, type AuthUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await getAuthUser();
        if (!authUser) {
          router.push('/login');
          return;
        }
        setUser(authUser);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/5">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.fullName || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your attendance and track your records
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="font-semibold mb-1">Today's Attendance</h3>
            <p className="text-sm text-muted-foreground">Mark your attendance for today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-success" />
              <span className="text-2xl font-bold">0%</span>
            </div>
            <h3 className="font-semibold mb-1">Attendance Rate</h3>
            <p className="text-sm text-muted-foreground">Your overall attendance percentage</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-1">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-border p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Your attendance records will appear here</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
