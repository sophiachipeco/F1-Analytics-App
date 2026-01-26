"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";

export function UserMenu() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => router.push("/login")}
          className="bg-red-600 hover:bg-red-700"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition border border-gray-300 dark:border-gray-700"
      >
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {(user.user_metadata?.display_name || user.email)?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="text-black dark:text-white text-sm font-medium hidden sm:inline">
          {user.user_metadata?.display_name || user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
            <p className="text-black dark:text-white font-semibold text-sm truncate">
              {user.user_metadata?.display_name || user.email}
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/settings");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-semibold"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-semibold border-t border-gray-300 dark:border-gray-700"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
