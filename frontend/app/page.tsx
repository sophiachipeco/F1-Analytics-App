"use client";

import { UserMenu } from "@/components/user-menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse">
          <div className="text-4xl font-bold text-red-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-red-600 bg-white dark:bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => window.location.reload()}
            className="hover:opacity-75 transition text-left"
          >
            <h1 className="text-4xl font-black text-red-600">F1 ANALYTICS</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">FORMULA 1 DASHBOARD</p>
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-gray-50 dark:bg-black border-2 border-red-600 rounded-lg p-8 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition">
            <h2 className="text-3xl font-black text-black dark:text-white mb-2">
              WELCOME, {(session.user?.name || session.user?.email)?.toUpperCase()}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              EXPLORE F1 ANALYTICS, TELEMETRY DATA, AND RACE REPLAYS.
            </p>
          </div>

          {/* Temporary Cards */}
          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition">
            <div className="w-12 h-12 bg-red-600 rounded-lg mb-4"></div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">ANALYTICS</h3>
            <p className="text-gray-600 dark:text-gray-400">View detailed race analytics</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition">
            <div className="w-12 h-12 bg-red-600 rounded-lg mb-4"></div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">TELEMETRY</h3>
            <p className="text-gray-600 dark:text-gray-400">Real-time telemetry data</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition">
            <div className="w-12 h-12 bg-red-600 rounded-lg mb-4"></div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">REPLAYS</h3>
            <p className="text-gray-600 dark:text-gray-400">Watch race replays</p>
          </div>
        </div>
      </main>
    </div>
  );
}
