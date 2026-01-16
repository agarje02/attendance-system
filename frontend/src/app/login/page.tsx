"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginWithEmail, loginWithGoogle } from "@/lib/api";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
            }) => void;
          }) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // useEffect(() => {
  //   // Load Google Sign-In script on mount
  //   if (typeof window !== "undefined" && !window.google) {
  //     const script = document.createElement("script");
  //     script.src = "https://accounts.google.com/gsi/client";
  //     script.async = true;
  //     script.defer = true;
  //     document.head.appendChild(script);

  //     script.onload = () => {
  //       // Initialize Google Sign-In when script loads
  //       if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  //         window.google.accounts.id.initialize({
  //           client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  //           callback: async (response: { credential: string }) => {
  //             try {
  //               setIsGoogleLoading(true);
  //               // Decode JWT token to get user info
  //               const base64Url = response.credential.split(".")[1];
  //               const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //               const jsonPayload = decodeURIComponent(
  //                 atob(base64)
  //                   .split("")
  //                   .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
  //                   .join("")
  //               );
  //               const userData = JSON.parse(jsonPayload);

  //               await loginWithGoogle({
  //                 email: userData.email,
  //                 name: userData.name,
  //                 picture: userData.picture,
  //               });

  //               // Get redirect URL from query params or default to dashboard
  //               const redirectUrl = searchParams.get('redirect') || '/dashboard';
  //               router.push(redirectUrl);
  //               router.refresh();
  //             } catch (err: any) {
  //               setError(err.message || "Google login failed. Please try again.");
  //               setIsGoogleLoading(false);
  //             }
  //           },
  //         });

  //         // Render button
  //         const buttonElement = document.getElementById("google-signin-button");
  //         if (buttonElement) {
  //           window.google.accounts.id.renderButton(buttonElement, {
  //             theme: "outline",
  //             size: "large",
  //             width: "100%",
  //             text: "signin_with",
  //           });
  //         }
  //       }
  //     };
  //   }
  // }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginWithEmail({ email, password });
      // Fetch user data after successful login
      await fetchUser();
      const redirectUrl = searchParams.get("redirect") || "/dashboard";
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-accent/5 to-success/5 flex-col justify-center px-12 xl:px-20 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10" onClick={() => router.push("/")}>
          <Logo size={50} className="mb-8 cursor-pointer" />
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Welcome back to{" "}
            <span className="gradient-text">Attendify</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Sign in to access your attendance dashboard, track your records, and
            manage your classes seamlessly.
          </p>

          {/* Features list */}
          <div className="space-y-4">
            {[
              "Real-time attendance tracking",
              "Smart analytics and insights",
              "Secure and reliable",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size={40} />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign in</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6 mb-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          {/* <div className="space-y-4">
            <div id="google-signin-button" className="w-full flex justify-center"></div>
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <p className="text-xs text-muted-foreground text-center">
                Google Sign-In requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file
              </p>
            )}
          </div> */}

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

