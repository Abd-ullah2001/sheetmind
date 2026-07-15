"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

interface OAuthButtonsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showOrDivider?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-[13px] gap-2",
  md: "h-11 px-5 text-[14px] gap-2.5",
  lg: "h-12 px-6 text-[15px] gap-3",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-5 w-5",
};

export function OAuthButtons({ size = "lg", className = "", showOrDivider = true }: OAuthButtonsProps) {
  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/dashboard" });
  const handleMicrosoftSignIn = () => signIn("azure-ad", { callbackUrl: "/dashboard" });

  return (
    <motion.div variants={fadeUp} className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={handleGoogleSignIn}
          className={`inline-flex items-center rounded-xl border border-neutral-200 bg-white font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md active:scale-[0.98] ${sizeClasses[size]}`}
        >
          <svg className={iconSizes[size]} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={handleMicrosoftSignIn}
          className={`inline-flex items-center rounded-xl border border-neutral-200 bg-white font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md active:scale-[0.98] ${sizeClasses[size]}`}
        >
          <svg className={iconSizes[size]} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/>
            <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
            <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
            <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
          </svg>
          Continue with Microsoft
        </button>
      </div>

      {showOrDivider && (
        <p className="text-[12px] text-neutral-400">
          Free to get started. No credit card required.
        </p>
      )}
    </motion.div>
  );
}