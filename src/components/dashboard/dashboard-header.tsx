"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userName?: string | null;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 transition-all duration-200 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm"
          : "bg-white border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard">
          <Logo iconSize={16} className="text-lg" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="hidden sm:inline">{userName}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
