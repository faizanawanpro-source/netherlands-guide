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
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    } catch (error) {
      console.error(
        "Could not check saved profile:",
        error
      );

      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            🇳🇱
          </div>

          <p className="font-medium text-slate-500">
            Loading Netherlands Guide...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">

        <div className="mb-6 text-6xl">
          🇳🇱
        </div>

        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Netherlands Guide
        </h1>

        <p className="mb-8 text-xl text-gray-600">
          Your personal AI guide to living in the Netherlands.
        </p>

        <p className="mb-10 text-gray-500">
          Get help with housing, work, documents, healthcare,
          transport and everyday life.
        </p>

        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          className="rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Get Started
        </button>

      </div>
    </main>
  );
}
