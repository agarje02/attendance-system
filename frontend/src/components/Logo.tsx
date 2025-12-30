"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 40, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient
            id="bgBlue"
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4FACFE" />
            <stop offset="100%" stopColor="#00F2FE" />
          </linearGradient>
          <linearGradient
            id="tickGreen"
            x1="30"
            y1="60"
            x2="75"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2AF598" />
            <stop offset="100%" stopColor="#009EFD" />
          </linearGradient>
        </defs>

        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#bgBlue)" />
        <circle cx="50" cy="50" r="35" fill="white" opacity="0.9" />
        <circle cx="50" cy="22" r="2" fill="#4FACFE" />
        <circle cx="78" cy="50" r="2" fill="#4FACFE" />
        <circle cx="50" cy="78" r="2" fill="#4FACFE" />
        <circle cx="22" cy="50" r="2" fill="#4FACFE" />
        <path
          d="M35 50 L47 62 L68 38"
          stroke="url(#tickGreen)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="font-bold text-xl tracking-tight">
          <span className="text-foreground">Attend</span>
          <span className="gradient-text">ify</span>
        </span>
      )}
    </div>
  );
}
