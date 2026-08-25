"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  translations,
  type Language,
} from "@/lib/translations";
import VoiceAssistant from "@/components/VoiceAssistant";

type ProfileType =
  | "refugee"
  | "student"
  | "tourist"
  | "resident"
  | "dutch";

type Profile = {
  name?: string;
  age?: string;
  city?: string;
  language?: string;
  profile?: ProfileType;
  hasFamily?: "yes" | "no";
  familyMembers?: string[];
  documents?: string[];
};

type ToolKey = keyof (typeof translations)["en"]["tools"];

type Tool = {
  href: string;
  icon: string;
  key: ToolKey;
  color: string;
};

const tools: Record<ProfileType, Tool[]> = {
  refugee: [
    { href: "/dutch-phone-number", icon: "📱", key: "phone", color: "from-orange-500 to-red-600" },
    { href: "/documents", icon: "📄", key: "documents", color: "from-blue-600 to-cyan-700" },
    { href: "/municipality", icon: "🏛️", key: "municipality", color: "from-indigo-600 to-purple-700" },
    { href: "/healthcare", icon: "🏥", key: "healthcare", color: "from-emerald-600 to-teal-700" },
    { href: "/money", icon: "💶", key: "money", color: "from-green-600 to-emerald-700" },
    { href: "/work", icon: "💼", key: "work", color: "from-slate-700 to-slate-900" },
    { href: "/study", icon: "📚", key: "study", color: "from-violet-600 to-fuchsia-700" },
    { href: "/transport", icon: "🚆", key: "transport", color: "from-blue-600 to-indigo-700" },
    { href: "/what-do-i-do", icon: "🚨", key: "emergency", color: "from-red-600 to-rose-700" },
    { href: "/waste", icon: "♻️", key: "waste", color: "from-lime-600 to-green-700" },
    { href: "/vehicles", icon: "🚗", key: "vehicles", color: "from-violet-600 to-purple-700" },
  ],

  student: [
    { href: "/study", icon: "🎓", key: "study", color: "from-indigo-600 to-purple-700" },
    { href: "/housing", icon: "🏠", key: "housing", color: "from-orange-500 to-red-600" },
    { href: "/dutch-phone-number", icon: "📱", key: "phone", color: "from-orange-500 to-amber-600" },
    { href: "/documents", icon: "📄", key: "documents", color: "from-violet-600 to-purple-700" },
    { href: "/money", icon: "💶", key: "money", color: "from-emerald-600 to-teal-700" },
    { href: "/work", icon: "💼", key: "work", color: "from-slate-700 to-slate-900" },
    { href: "/transport", icon: "🚆", key: "transport", color: "from-blue-600 to-cyan-700" },
    { href: "/healthcare", icon: "🏥", key: "healthcare", color: "from-rose-600 to-red-700" },
    { href: "/what-do-i-do", icon: "🚨", key: "emergency", color: "from-red-600 to-rose-700" },
    { href: "/waste", icon: "♻️", key: "waste", color: "from-lime-600 to-green-700" },
    { href: "/vehicles", icon: "🚗", key: "vehicles", color: "from-violet-600 to-purple-700" },
    { href: "/explore", icon: "🗺️", key: "explore", color: "from-orange-500 to-amber-600" },
  ],

  tourist: [
    { href: "/explore", icon: "🗺️", key: "explore", color: "from-orange-500 to-red-600" },
    { href: "/trip-planner", icon: "🧳", key: "tripPlanner", color: "from-indigo-600 to-purple-700" },
    { href: "/budget-planner", icon: "💶", key: "budgetPlanner", color: "from-emerald-600 to-teal-700" },
    { href: "/transport", icon: "🚆", key: "transport", color: "from-blue-600 to-cyan-700" },
    { href: "/chat", icon: "🤖", key: "travelAI", color: "from-violet-600 to-fuchsia-700" },
    { href: "/plan-day", icon: "📅", key: "planDay", color: "from-rose-600 to-pink-700" },
    { href: "/what-do-i-do", icon: "🚨", key: "emergency", color: "from-red-600 to-rose-700" },
  ],

  resident: [
    { href: "/housing", icon: "🏠", key: "housing", color: "from-orange-500 to-red-600" },
    { href: "/dutch-phone-number", icon: "📱", key: "phone", color: "from-orange-500 to-amber-600" },
    { href: "/documents", icon: "📄", key: "documents", color: "from-blue-600 to-cyan-700" },
    { href: "/municipality", icon: "🏛️", key: "municipality", color: "from-indigo-600 to-purple-700" },
    { href: "/healthcare", icon: "🏥", key: "healthcare", color: "from-emerald-600 to-teal-700" },
    { href: "/money", icon: "💶", key: "money", color: "from-green-600 to-emerald-700" },
    { href: "/work", icon: "💼", key: "work", color: "from-slate-700 to-slate-900" },
    { href: "/transport", icon: "🚆", key: "transport", color: "from-blue-600 to-indigo-700" },
    { href: "/vehicles", icon: "🚗", key: "vehicles", color: "from-violet-600 to-purple-700" },
    { href: "/waste", icon: "♻️", key: "waste", color: "from-lime-600 to-green-700" },
    { href: "/what-do-i-do", icon: "🚨", key: "emergency", color: "from-red-600 to-rose-700" },
    { href: "/explore", icon: "🗺️", key: "explore", color: "from-orange-500 to-amber-600" },
  ],

  dutch: [
    { href: "/municipality", icon: "🏛️", key: "municipality", color: "from-indigo-600 to-purple-700" },
    { href: "/healthcare", icon: "🏥", key: "healthcare", color: "from-emerald-600 to-teal-700" },
    { href: "/money", icon: "💶", key: "money", color: "from-green-600 to-emerald-700" },
    { href: "/work", icon: "💼", key: "work", color: "from-slate-700 to-slate-900" },
    { href: "/transport", icon: "🚆", key: "transport", color: "from-blue-600 to-cyan-700" },
    { href: "/vehicles", icon: "🚗", key: "vehicles", color: "from-violet-600 to-purple-700" },
    { href: "/waste", icon: "♻️", key: "waste", color: "from-lime-600 to-green-700" },
    { href: "/what-do-i-do", icon: "🚨", key: "emergency", color: "from-red-600 to-rose-700" },
    { href: "/explore", icon: "🗺️", key: "explore", color: "from-orange-500 to-amber-600" },
  ],
};

const familyLabels: Record<string, string> = {
  partner: "Partner",
  children: "Children",
  parents: "Parents",
  siblings: "Brothers / sisters",
  other: "Other family",
};

const documentLabels: Record<string, string> = {
  bsn: "BSN",
  digid: "DigiD",
  residence: "Residence document",
  municipality: "Municipality registration",
  letters: "Official letters",
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedLanguage = localStorage.getItem(
        "netherlandsGuideLanguage"
      ) as Language | null;

      if (savedLanguage && savedLanguage in translations) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Could not load dashboard data:", error);
    }
  }, []);

  const currentProfile: ProfileType =
    profile.profile &&
    ["student", "tourist", "resident", "refugee", "dutch"].includes(
      profile.profile
    )
      ? profile.profile
      : "refugee";

  const t = translations[language];

  const personalizedTools = useMemo(
    () => tools[currentProfile],
    [currentProfile]
  );

  if (!mounted) return null;

  const displayName = profile.name?.trim() || "there";

  const familyList =
    profile.familyMembers?.map(
      (member) => familyLabels[member] || member
    ) || [];

  const documentList =
    profile.documents?.map(
      (document) => documentLabels[document] || document
    ) || [];

  const isRTL = language === "ar" || language === "ur";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {/* NAVIGATION */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div>
              <p className="font-black">
                {t.guide}
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                {t.assistant}
              </p>
            </div>
          </Link>

          {/* ONLY EDIT BUTTON */}
          {/* The old custom language selector has been removed. */}

          <Link
            href="/onboarding"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold"
          >
            {t.edit}
          </Link>

        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">

        {/* WELCOME */}

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                  {currentProfile === "refugee" && "🕊️"}
                  {currentProfile === "student" && "🎓"}
                  {currentProfile === "tourist" && "✈️"}
                  {currentProfile === "resident" && "🏡"}
                  {currentProfile === "dutch" && "🇳🇱"}{" "}
                  {t.profiles[currentProfile]}
                </span>

                {profile.city && (
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                    📍 {profile.city}
                  </span>
                )}

              </div>

              <h1 className="mt-5 text-3xl font-black sm:text-5xl">
                {language === "en"
                  ? `Hi ${displayName}! 👋`
                  : `${displayName}! 👋`}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-50">
                {t.greetings[currentProfile]}
              </p>

              <p className="mt-2 max-w-2xl text-sm text-orange-100">
                {t.subtitles[currentProfile]}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">

                {profile.age && (
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                    🎂 {profile.age}
                  </span>
                )}

                {profile.language && (
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                    🌐 {profile.language}
                  </span>
                )}

                {profile.hasFamily && (
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                    👨‍👩‍👧‍👦{" "}
                    {profile.hasFamily === "yes"
                      ? t.familyNL
                      : t.noFamily}
                  </span>
                )}

              </div>

            </div>

            <div className="hidden rounded-3xl bg-white/10 p-7 lg:block">

              <p className="text-sm font-bold text-orange-100">
                {t.guide}
              </p>

              <p className="mt-2 text-4xl font-black">
                {t.profile}
              </p>

              <p className="mt-2 max-w-xs text-sm text-orange-100">
                {t.profileDescription}
              </p>

            </div>

          </div>

        </section>

        {/* RECOMMENDED TOOLS */}

        <section className="mt-10">

          <div className="mb-6">

            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
              {t.recommended}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {t.usefulTools}
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              {t.selectedBased}
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {personalizedTools.map((tool) => {

              const toolText = t.tools[tool.key];

              return (
                <Link
                  key={`${tool.href}-${tool.key}-${tool.icon}`}
                  href={tool.href}
                  className={`group overflow-hidden rounded-[2rem] bg-gradient-to-br ${tool.color} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                      {tool.icon}
                    </div>

                    <span className="text-2xl text-white/60">
                      →
                    </span>

                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    {toolText[0]}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {toolText[1]}
                  </p>

                </Link>
              );
            })}

          </div>

        </section>

        {/* SMART TOOLS */}

        <section className="mt-12">

          <div className="mb-6">

            <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
              {t.smartTools}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {t.getHelp}
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              {t.aiDescription}
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* AI */}

            <Link
              href="/chat"
              className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-7 text-white shadow-lg"
            >

              <div className="text-4xl">
                🤖
              </div>

              <h3 className="mt-6 text-2xl font-black">
                {t.askAI}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {t.askAIDescription}
              </p>

              <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold">
                {t.askGuide}
              </div>

            </Link>

            {/* SCANNER */}

            <Link
              href="/scanner"
              className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-7 text-white shadow-lg"
            >

              <div className="text-4xl">
                📄
              </div>

              <h3 className="mt-6 text-2xl font-black">
                {t.scanLetter}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/80">
                {t.scanDescription}
              </p>

              <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold">
                {t.openScanner}
              </div>

            </Link>

            {/* VOICE PAGE */}

            <Link
              href="/voice"
              className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-7 text-white shadow-lg"
            >

              <div className="text-4xl">
                🎤
              </div>

              <h3 className="mt-6 text-2xl font-black">
                {t.voice}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/80">
                {t.voiceDescription}
              </p>

              <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold">
                {t.talkGuide}
              </div>

            </Link>

          </div>

        </section>

        {/* PROFILE */}

        <section className="mt-12">

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              {t.profile}
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {t.profiles[currentProfile]}
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  {t.name}
                </p>

                <p className="mt-1 font-bold">
                  {profile.name || t.notSet}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  {t.location}
                </p>

                <p className="mt-1 font-bold">
                  {profile.city || t.notSet}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  {t.language}
                </p>

                <p className="mt-1 font-bold">
                  {profile.language || "English"}
                </p>
              </div>

            </div>

            {(currentProfile === "refugee" ||
              currentProfile === "resident") &&
              profile.hasFamily && (

                <div className="mt-4 rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-bold uppercase text-slate-400">
                    {t.family}
                  </p>

                  <p className="mt-2 font-bold">
                    {profile.hasFamily === "yes"
                      ? t.familyNL
                      : t.noFamily}
                  </p>

                  {familyList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">

                      {familyList.map((family) => (
                        <span
                          key={family}
                          className="rounded-full bg-white px-3 py-1 text-sm font-semibold"
                        >
                          👨‍👩‍👧‍👦 {family}
                        </span>
                      ))}

                    </div>
                  )}

                </div>
              )}

            {(currentProfile === "refugee" ||
              currentProfile === "resident") && (

              <div className="mt-4 rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase text-slate-400">
                  {t.documentsServices}
                </p>

                <p className="mt-2 font-bold">
                  {documentList.length > 0
                    ? `${documentList.length} ${t.selected}`
                    : t.noneSelected}
                </p>

              </div>
            )}

          </div>

        </section>

        {/* TOURIST */}

        {currentProfile === "tourist" && (

          <section className="mt-10">

            <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-7">

              <p className="text-sm font-black uppercase tracking-widest text-orange-600">
                {t.touristMode}
              </p>

              <h2 className="mt-2 text-2xl font-black text-orange-950">
                {t.ready}
              </h2>

              <Link
                href="/trip-planner"
                className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-black text-white"
              >
                {t.planTrip}
              </Link>

            </div>

          </section>
        )}

        {/* EMERGENCY */}

        <section className="mt-10">

          <div className="rounded-[2rem] border-2 border-red-200 bg-red-50 p-6">

            <h2 className="text-xl font-black text-red-900">
              🚨 {t.emergency}
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-800">
              {t.emergencyDescription}
            </p>

            <a
              href="tel:112"
              className="mt-5 inline-block rounded-xl bg-red-600 px-6 py-3 font-black text-white"
            >
              {t.call112}
            </a>

          </div>

        </section>

        <footer className="py-10 text-center text-sm text-slate-400">
          {t.guide} 🇳🇱 · {t.footer}
        </footer>

      </div>

      {/* YOUR ORIGINAL FLOATING VOICE ASSISTANT */}

      <VoiceAssistant />

    </main>
  );
}