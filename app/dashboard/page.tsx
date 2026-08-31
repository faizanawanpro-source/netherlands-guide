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
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-slate-800 to-slate-900",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-700 to-blue-900",
    },
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-indigo-700 to-indigo-900",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-blue-800 to-slate-900",
    },
    {
      href: "/study",
      icon: "📚",
      key: "study",
      color: "from-violet-700 to-indigo-900",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/what-do-i-do",
      icon: "🚨",
      key: "emergency",
      color: "from-red-700 to-red-900",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-700 to-emerald-900",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-700 to-indigo-900",
    },
  ],

  student: [
    {
      href: "/study",
      icon: "🎓",
      key: "study",
      color: "from-indigo-700 to-indigo-900",
    },
    {
      href: "/housing",
      icon: "🏠",
      key: "housing",
      color: "from-slate-800 to-slate-900",
    },
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-blue-700 to-blue-900",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/what-do-i-do",
      icon: "🚨",
      key: "emergency",
      color: "from-red-700 to-red-900",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-700 to-emerald-900",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-700 to-indigo-900",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-700 to-slate-900",
    },
  ],

  tourist: [
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-slate-800 to-slate-900",
    },
    {
      href: "/trip-planner",
      icon: "🧳",
      key: "tripPlanner",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/budget-planner",
      icon: "💶",
      key: "budgetPlanner",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/chat",
      icon: "🤖",
      key: "travelAI",
      color: "from-slate-800 to-indigo-950",
    },
    {
      href: "/plan-day",
      icon: "📅",
      key: "planDay",
      color: "from-indigo-700 to-slate-900",
    },
    {
      href: "/what-do-i-do",
      icon: "🚨",
      key: "emergency",
      color: "from-red-700 to-red-900",
    },
  ],

  resident: [
    {
      href: "/housing",
      icon: "🏠",
      key: "housing",
      color: "from-slate-800 to-slate-900",
    },
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-blue-700 to-blue-900",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-indigo-700 to-indigo-900",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-blue-800 to-slate-900",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-700 to-indigo-900",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-700 to-emerald-900",
    },
    {
      href: "/what-do-i-do",
      icon: "🚨",
      key: "emergency",
      color: "from-red-700 to-red-900",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-700 to-slate-900",
    },
  ],

  dutch: [
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-indigo-700 to-indigo-900",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-emerald-700 to-teal-800",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-slate-700 to-slate-900",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-blue-800 to-slate-900",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-blue-700 to-indigo-900",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-700 to-indigo-900",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-700 to-emerald-900",
    },
    {
      href: "/what-do-i-do",
      icon: "🚨",
      key: "emergency",
      color: "from-red-700 to-red-900",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-700 to-slate-900",
    },
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
    [
      "student",
      "tourist",
      "resident",
      "refugee",
      "dutch",
    ].includes(profile.profile)
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

  const isRTL =
    language === "ar" || language === "ur";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900"
    >

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-2xl shadow-sm">
              🇳🇱
            </div>

            <div>

              <p className="font-black tracking-tight text-slate-900">
                {t.guide}
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                {t.assistant}
              </p>

            </div>

          </Link>

          <Link
            href="/onboarding"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            {t.edit}
          </Link>

        </div>

      </nav>


      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">


        {/* ================================================== */}
        {/* WELCOME */}
        {/* ================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">

          {/* subtle brand glow */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">

                  {currentProfile === "refugee" && "🕊️"}
                  {currentProfile === "student" && "🎓"}
                  {currentProfile === "tourist" && "✈️"}
                  {currentProfile === "resident" && "🏡"}
                  {currentProfile === "dutch" && "🇳🇱"}{" "}

                  {t.profiles[currentProfile]}

                </span>

                {profile.city && (

                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                    📍 {profile.city}
                  </span>

                )}

              </div>


              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">

                {language === "en"
                  ? `Hi ${displayName}! 👋`
                  : `${displayName}! 👋`}

              </h1>


              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                {t.greetings[currentProfile]}
              </p>


              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {t.subtitles[currentProfile]}
              </p>


              <div className="mt-6 flex flex-wrap gap-2">

                {profile.age && (

                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
                    🎂 {profile.age}
                  </span>

                )}

                {profile.language && (

                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
                    🌐 {profile.language}
                  </span>

                )}

                {profile.hasFamily && (

                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">

                    👨‍👩‍👧‍👦{" "}

                    {profile.hasFamily === "yes"
                      ? t.familyNL
                      : t.noFamily}

                  </span>

                )}

              </div>

            </div>


            {/* PROFILE SUMMARY */}

            <div className="hidden rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur lg:block">

              <p className="text-sm font-bold text-slate-400">
                {t.guide}
              </p>

              <p className="mt-2 text-4xl font-black">
                {t.profile}
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                {t.profileDescription}
              </p>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* RECOMMENDED TOOLS */}
        {/* ================================================== */}

        <section className="mt-12">

          <div className="mb-7">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              {t.recommended}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
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
                  className={`group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tool.color} p-6 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >

                  {/* subtle hover glow */}

                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15" />


                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl backdrop-blur">

                        {tool.icon}

                      </div>

                      <span className="text-2xl text-white/50 transition group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>

                    </div>


                    <h3 className="mt-5 text-xl font-black tracking-tight">
                      {toolText[0]}
                    </h3>


                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {toolText[1]}
                    </p>

                  </div>

                </Link>

              );

            })}

          </div>

        </section>


        {/* ================================================== */}
        {/* SMART TOOLS */}
        {/* ================================================== */}

        <section className="mt-14">

          <div className="mb-7">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              {t.smartTools}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
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
              className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl">
                  🤖
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {t.askAI}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {t.askAIDescription}
                </p>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold">

                  <span>
                    {t.askGuide}
                  </span>

                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </div>

            </Link>


            {/* SCANNER */}

            <Link
              href="/scanner"
              className="group relative overflow-hidden rounded-[2rem] bg-white p-7 text-slate-900 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                  📄
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {t.scanLetter}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {t.scanDescription}
                </p>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold">

                  <span>
                    {t.openScanner}
                  </span>

                  <span className="text-emerald-600 transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </div>

            </Link>


            {/* VOICE */}

            <Link
              href="/voice"
              className="group relative overflow-hidden rounded-[2rem] bg-white p-7 text-slate-900 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                  🎤
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {t.voice}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {t.voiceDescription}
                </p>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold">

                  <span>
                    {t.talkGuide}
                  </span>

                  <span className="text-indigo-600 transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </div>

            </Link>

          </div>

        </section>


        {/* ================================================== */}
        {/* PROFILE */}
        {/* ================================================== */}

        <section className="mt-14">

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  {t.profile}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {t.profiles[currentProfile]}
                </h2>

              </div>

              <Link
                href="/onboarding"
                className="text-sm font-bold text-blue-700 hover:text-blue-800"
              >
                {t.edit} →
              </Link>

            </div>


            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {/* NAME */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {t.name}
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {profile.name || t.notSet}
                </p>

              </div>


              {/* LOCATION */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {t.location}
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {profile.city || t.notSet}
                </p>

              </div>


              {/* LANGUAGE */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {t.language}
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {profile.language || "English"}
                </p>

              </div>

            </div>


            {/* FAMILY */}

            {(currentProfile === "refugee" ||
              currentProfile === "resident") &&
              profile.hasFamily && (

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
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
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
                        >
                          👨‍👩‍👧‍👦 {family}
                        </span>

                      ))}

                    </div>

                  )}

                </div>

              )}


            {/* DOCUMENTS */}

            {(currentProfile === "refugee" ||
              currentProfile === "resident") && (

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
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


        {/* ================================================== */}
        {/* TOURIST */}
        {/* ================================================== */}

        {currentProfile === "tourist" && (

          <section className="mt-10">

            <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-7">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                {t.touristMode}
              </p>

              <h2 className="mt-2 text-2xl font-black text-orange-950">
                {t.ready}
              </h2>

              <Link
                href="/trip-planner"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-orange-700"
              >
                {t.planTrip}
                <span>→</span>
              </Link>

            </div>

          </section>

        )}


        {/* ================================================== */}
        {/* EMERGENCY */}
        {/* ================================================== */}

        <section className="mt-10">

          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-black text-red-950">
                  🚨 {t.emergency}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-red-800">
                  {t.emergencyDescription}
                </p>

              </div>

              <a
                href="tel:112"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-red-700"
              >
                {t.call112}
              </a>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <footer className="py-10 text-center text-sm text-slate-400">
          {t.guide} 🇳🇱 · {t.footer}
        </footer>

      </div>


      {/* ====================================================== */}
      {/* FLOATING VOICE ASSISTANT */}
      {/* ====================================================== */}

      <VoiceAssistant />

    </main>
  );
}

