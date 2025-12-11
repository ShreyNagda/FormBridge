"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface MobileMenuProps {
  session: Session | null;
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 flex items-center justify-between border-b border-gray-100">
            <span className="font-display font-bold text-xl">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            <div className="space-y-2">
              <Link
                href="/#features"
                className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#docs"
                className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Docs
              </Link>
            </div>

            <div className="h-1 bg-gray-100" />

            {session ? (
              <div className="space-y-2">
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Start for Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
