"use client";

import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-pulse">
          <div className="text-4xl font-bold text-red-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-red-600 bg-white dark:bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="hover:opacity-75 transition text-left"
          >
            <h1 className="text-3xl font-black text-red-600">F1 ANALYTICS</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">SETTINGS</p>
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Settings Card */}
          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-black text-black dark:text-white mb-8">
              PREFERENCES
            </h2>

            {/* Theme Settings */}
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                  APPEARANCE
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Choose your preferred color scheme
                </p>

                <div className="flex gap-4">
                  {/* Light Mode */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-4 rounded-lg border-2 transition font-bold ${
                      theme === "light"
                        ? "border-red-600 bg-red-50 dark:bg-red-900/20 text-black dark:text-white"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">☀️</div>
                      <div>LIGHT</div>
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-4 rounded-lg border-2 transition font-bold ${
                      theme === "dark"
                        ? "border-red-600 bg-red-900/20 text-white"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌙</div>
                      <div>DARK</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                  ACCOUNT
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                      EMAIL
                    </p>
                    <p className="text-black dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                      DISPLAY NAME
                    </p>
                    <p className="text-black dark:text-white">
                      {user.user_metadata?.display_name || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </main>
    </div>
  );
}
