"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (savedProfile) {
        // User already created a profile
        router.replace("/dashboard");
      } else {
        // First-time user
        setChecking(false);
      }
    } catch (error) {
      console.error("Could not check saved profile:", error);
      setChecking(false);
    }
  }, [router]);

  // Don't show the landing page while checking storage
  if (checking) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🇳🇱</div>
          <p className="text-slate-500 font-medium">
            Loading Netherlands Guide...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">

        <div className="text-6xl mb-6">
          🇳🇱
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Netherlands Guide
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Your personal AI guide to living in the Netherlands.
        </p>

        <p className="text-gray-500 mb-10">
          Get help with housing, work, documents, healthcare,
          transport and everyday life.
        </p>

        <button
          onClick={() => router.push("/onboarding")}
          className="bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Get Started
        </button>

      </div>
    </main>
  );
}