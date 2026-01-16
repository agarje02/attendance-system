"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogIn, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/api";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  email?: string;
  password?: string;
  onAutoLogin?: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  email,
  password,
  onAutoLogin,
}: SuccessDialogProps) {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleAutoLogin = async () => {
    if (!email || !password) {
      router.push("/login");
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithEmail({ email, password });
      if (onAutoLogin) {
        onAutoLogin();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      // If auto-login fails, redirect to login page
      router.push("/login");
    } finally {
      setIsLoggingIn(false);
      onOpenChange(false);
    }
  };

  const handleGoToLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
          {email && password && (
            <Button
              onClick={handleAutoLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isLoggingIn ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login with credentials
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleGoToLogin}
            variant="outline"
            className="w-full sm:w-auto"
            size="lg"
          >
            Go to Login Form
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
