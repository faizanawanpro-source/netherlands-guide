"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  ChevronRight,
  CircleDollarSign,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  Languages,
  MapPinned,
  Phone,
  Recycle,
  ScanLine,
  Settings,
  Sparkles,
  TrainFront,
  X,
} from "lucide-react";

import {
  translations,
  type Language,
} from "@/lib/translations";
import { supabase } from "@/lib/supabase";

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
  iconBg: string;
};

const tools: Record<ProfileType, Tool[]> = {
  refugee: [
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-slate-900 via-slate-900 to-indigo-950",
      iconBg: "bg-indigo-500/15 ring-indigo-400/20",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-950 via-blue-900 to-indigo-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-indigo-950 via-indigo-900 to-violet-950",
      iconBg: "bg-violet-400/15 ring-violet-300/20",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-red-950 via-rose-900 to-red-950",
      iconBg: "bg-red-400/15 ring-red-300/20",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-emerald-950 via-green-900 to-emerald-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-slate-950 via-blue-950 to-slate-950",
      iconBg: "bg-sky-400/15 ring-sky-300/20",
    },
    {
      href: "/study",
      icon: "📚",
      key: "study",
      color: "from-violet-950 via-purple-900 to-indigo-950",
      iconBg: "bg-violet-400/15 ring-violet-300/20",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-cyan-950 via-blue-900 to-cyan-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-950 via-emerald-900 to-green-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-950 via-slate-800 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
  ],

  student: [
    {
      href: "/study",
      icon: "🎓",
      key: "study",
      color: "from-violet-950 via-purple-900 to-indigo-950",
      iconBg: "bg-violet-400/15 ring-violet-300/20",
    },
    {
      href: "/housing",
      icon: "🏠",
      key: "housing",
      color: "from-orange-950 via-amber-900 to-orange-950",
      iconBg: "bg-orange-400/15 ring-orange-300/20",
    },
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-blue-950 via-blue-900 to-indigo-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-950 via-indigo-900 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-emerald-950 via-green-900 to-emerald-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-slate-950 via-blue-950 to-slate-950",
      iconBg: "bg-sky-400/15 ring-sky-300/20",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-cyan-950 via-blue-900 to-cyan-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-red-950 via-rose-900 to-red-950",
      iconBg: "bg-red-400/15 ring-red-300/20",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-950 via-emerald-900 to-green-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-950 via-slate-800 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-950 via-cyan-900 to-indigo-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
  ],

  tourist: [
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-950 via-cyan-900 to-indigo-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/trip-planner",
      icon: "🧳",
      key: "tripPlanner",
      color: "from-indigo-950 via-blue-900 to-violet-950",
      iconBg: "bg-indigo-400/15 ring-indigo-300/20",
    },
    {
      href: "/budget-planner",
      icon: "💶",
      key: "budgetPlanner",
      color: "from-emerald-950 via-green-900 to-teal-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-cyan-950 via-blue-900 to-cyan-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/chat",
      icon: "🤖",
      key: "travelAI",
      color: "from-slate-950 via-indigo-950 to-violet-950",
      iconBg: "bg-violet-400/15 ring-violet-300/20",
    },
    {
      href: "/plan-day",
      icon: "📅",
      key: "planDay",
      color: "from-orange-950 via-amber-900 to-orange-950",
      iconBg: "bg-orange-400/15 ring-orange-300/20",
    },
  ],

  resident: [
    {
      href: "/housing",
      icon: "🏠",
      key: "housing",
      color: "from-orange-950 via-amber-900 to-orange-950",
      iconBg: "bg-orange-400/15 ring-orange-300/20",
    },
    {
      href: "/dutch-phone-number",
      icon: "📱",
      key: "phone",
      color: "from-blue-950 via-blue-900 to-indigo-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/documents",
      icon: "📄",
      key: "documents",
      color: "from-blue-950 via-indigo-900 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-amber-950 via-orange-900 to-amber-950",
      iconBg: "bg-amber-400/15 ring-amber-300/20",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-red-950 via-rose-900 to-red-950",
      iconBg: "bg-red-400/15 ring-red-300/20",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-emerald-950 via-green-900 to-emerald-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-slate-950 via-blue-950 to-slate-950",
      iconBg: "bg-sky-400/15 ring-sky-300/20",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-cyan-950 via-blue-900 to-cyan-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-950 via-slate-800 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-950 via-emerald-900 to-green-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-950 via-cyan-900 to-indigo-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
  ],

  dutch: [
    {
      href: "/municipality",
      icon: "🏛️",
      key: "municipality",
      color: "from-amber-950 via-orange-900 to-amber-950",
      iconBg: "bg-amber-400/15 ring-amber-300/20",
    },
    {
      href: "/healthcare",
      icon: "🏥",
      key: "healthcare",
      color: "from-red-950 via-rose-900 to-red-950",
      iconBg: "bg-red-400/15 ring-red-300/20",
    },
    {
      href: "/money",
      icon: "💶",
      key: "money",
      color: "from-emerald-950 via-green-900 to-emerald-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/work",
      icon: "💼",
      key: "work",
      color: "from-slate-950 via-blue-950 to-slate-950",
      iconBg: "bg-sky-400/15 ring-sky-300/20",
    },
    {
      href: "/transport",
      icon: "🚆",
      key: "transport",
      color: "from-cyan-950 via-blue-900 to-cyan-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    },
    {
      href: "/vehicles",
      icon: "🚗",
      key: "vehicles",
      color: "from-slate-950 via-slate-800 to-blue-950",
      iconBg: "bg-blue-400/15 ring-blue-300/20",
    },
    {
      href: "/waste",
      icon: "♻️",
      key: "waste",
      color: "from-green-950 via-emerald-900 to-green-950",
      iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    },
    {
      href: "/explore",
      icon: "🗺️",
      key: "explore",
      color: "from-blue-950 via-cyan-900 to-indigo-950",
      iconBg: "bg-cyan-400/15 ring-cyan-300/20",
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
  residence: "Residence permit",
  passport: "Passport",
  other: "Other documents",
};

const languageNames: Record<string, string> = {
  en: "English",
  nl: "Dutch",
  ur: "Urdu",
  hi: "Hindi",
  pa: "Punjabi",
  ar: "Arabic",
  tr: "Turkish",
  es: "Spanish",
  fr: "French",
  de: "German",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  bn: "Bengali",
};

const serviceVisuals: Record<
  string,
  {
    icon: ComponentType<{
      className?: string;
    }>;
    gradient: string;
    iconBg: string;
    accent: string;
    pattern: string;
  }
> = {
  phone: {
    icon: Languages,
    gradient: "from-slate-950 via-slate-900 to-indigo-950",
    iconBg: "bg-indigo-400/15 ring-indigo-300/20",
    accent: "text-indigo-200",
    pattern: "bg-indigo-400/10",
  },

  documents: {
    icon: FileText,
    gradient: "from-blue-950 via-indigo-900 to-blue-950",
    iconBg: "bg-blue-400/15 ring-blue-300/20",
    accent: "text-blue-200",
    pattern: "bg-blue-400/10",
  },

  municipality: {
    icon: Building2,
    gradient: "from-indigo-950 via-indigo-900 to-violet-950",
    iconBg: "bg-violet-400/15 ring-violet-300/20",
    accent: "text-violet-200",
    pattern: "bg-violet-400/10",
  },

  healthcare: {
    icon: HeartPulse,
    gradient: "from-red-950 via-rose-900 to-red-950",
    iconBg: "bg-red-400/15 ring-red-300/20",
    accent: "text-red-200",
    pattern: "bg-red-400/10",
  },

  money: {
    icon: CircleDollarSign,
    gradient: "from-emerald-950 via-teal-900 to-emerald-950",
    iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    accent: "text-emerald-200",
    pattern: "bg-emerald-400/10",
  },

  work: {
    icon: BriefcaseBusiness,
    gradient: "from-slate-950 via-blue-950 to-slate-950",
    iconBg: "bg-sky-400/15 ring-sky-300/20",
    accent: "text-sky-200",
    pattern: "bg-sky-400/10",
  },

  study: {
    icon: GraduationCap,
    gradient: "from-violet-950 via-purple-900 to-indigo-950",
    iconBg: "bg-violet-400/15 ring-violet-300/20",
    accent: "text-violet-200",
    pattern: "bg-violet-400/10",
  },

  housing: {
    icon: Home,
    gradient: "from-orange-950 via-amber-900 to-orange-950",
    iconBg: "bg-orange-400/15 ring-orange-300/20",
    accent: "text-orange-200",
    pattern: "bg-orange-400/10",
  },

  transport: {
    icon: TrainFront,
    gradient: "from-cyan-950 via-blue-900 to-cyan-950",
    iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    accent: "text-cyan-200",
    pattern: "bg-cyan-400/10",
  },

  waste: {
    icon: Recycle,
    gradient: "from-green-950 via-emerald-900 to-green-950",
    iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    accent: "text-emerald-200",
    pattern: "bg-emerald-400/10",
  },

  vehicles: {
    icon: Car,
    gradient: "from-slate-950 via-slate-800 to-blue-950",
    iconBg: "bg-blue-400/15 ring-blue-300/20",
    accent: "text-blue-200",
    pattern: "bg-blue-400/10",
  },

  explore: {
    icon: MapPinned,
    gradient: "from-blue-950 via-cyan-900 to-indigo-950",
    iconBg: "bg-cyan-400/15 ring-cyan-300/20",
    accent: "text-cyan-200",
    pattern: "bg-cyan-400/10",
  },

  tripPlanner: {
    icon: CalendarDays,
    gradient: "from-indigo-950 via-blue-900 to-violet-950",
    iconBg: "bg-indigo-400/15 ring-indigo-300/20",
    accent: "text-indigo-200",
    pattern: "bg-indigo-400/10",
  },

  budgetPlanner: {
    icon: CircleDollarSign,
    gradient: "from-emerald-950 via-teal-900 to-emerald-950",
    iconBg: "bg-emerald-400/15 ring-emerald-300/20",
    accent: "text-emerald-200",
    pattern: "bg-emerald-400/10",
  },

  travelAI: {
    icon: Sparkles,
    gradient: "from-slate-950 via-indigo-950 to-violet-950",
    iconBg: "bg-violet-400/15 ring-violet-300/20",
    accent: "text-violet-200",
    pattern: "bg-violet-400/10",
  },

  planDay: {
    icon: CalendarDays,
    gradient: "from-orange-950 via-amber-900 to-orange-950",
    iconBg: "bg-orange-400/15 ring-orange-300/20",
    accent: "text-orange-200",
    pattern: "bg-orange-400/10",
  },
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

    const loadUnreadNotifications = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUnreadNotifications(0);
          return;
        }

        const { count, error } = await supabase
          .from("notifications")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", session.user.id)
          .eq("read", false);

        if (error) {
          console.error(
            "Could not load notification count:",
            error
          );
          return;
        }

        setUnreadNotifications(count ?? 0);
      } catch (error) {
        console.error(
          "Could not load notification count:",
          error
        );
      }
    };

    loadUnreadNotifications();

    const notificationInterval = window.setInterval(
      loadUnreadNotifications,
      30000
    );

    return () => {
      window.clearInterval(notificationInterval);
    };
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

  const isRTL = language === "ar" || language === "ur";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f4f7fb] pb-28 text-slate-950"
    >
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 text-white shadow-[0_10px_40px_rgba(2,8,23,0.15)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/40 bg-[#07111f] shadow-[0_8px_30px_rgba(212,175,55,0.22)]">
              <img
                src="/netherway-icon.png"
                alt="Netherway"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="font-black tracking-tight">{t.guide}</p>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">
                {t.assistant}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* NOTIFICATIONS */}

            <Link
              href="/notifications"
              aria-label={
                unreadNotifications > 0
                  ? `${unreadNotifications} unread notifications`
                  : "Notifications"
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/15 active:scale-95"
            >
              <Bell className="h-5 w-5" />

              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#07111f] bg-red-500 px-1 text-[10px] font-black text-white">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </Link>

            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/15 active:scale-95"
            >
              <span>
                {profile.name?.trim()
                  ? profile.name.trim().slice(0, 2).toUpperCase()
                  : "NG"}
              </span>

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07111f] bg-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* PROFILE DRAWER */}

      {profileOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close profile"
            onClick={() => setProfileOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <aside
            className={`absolute top-0 h-full w-full max-w-sm bg-white shadow-2xl ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="flex h-full flex-col">
              {/* PROFILE HEADER */}

              <div className="relative overflow-hidden bg-[#07111f] px-6 pb-7 pt-6 text-white">
                <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/10">
                      {profile.name?.trim()
                        ? profile.name.trim().slice(0, 2).toUpperCase()
                        : "NG"}
                    </div>

                    <h2 className="mt-4 text-xl font-black">
                      {displayName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {t.profiles[currentProfile]}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Close profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/15"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PROFILE DETAILS */}

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {t.name}
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {profile.name || t.notSet}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {t.location}
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {profile.city || t.notSet}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {t.language}
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {languageNames[language] ||
                        profile.language ||
                        "English"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {t.profile}
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {t.profiles[currentProfile]}
                    </p>
                  </div>

                  {(currentProfile === "refugee" ||
                    currentProfile === "resident") &&
                    profile.hasFamily && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
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
                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
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
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
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

                <Link
                  href="/onboarding"
                  onClick={() => setProfileOpen(false)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" />
                  {t.edit}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN DASHBOARD */}

      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-7 sm:py-10">
        {/* WELCOME */}

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#07111f] via-blue-950 to-indigo-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
                {t.assistant}
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {language === "en"
                  ? `Welcome${profile.name?.trim() ? `, ${profile.name.trim()}` : ""}!`
                  : `Welcome ${profile.name?.trim() || ""}`}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                {language === "en"
                  ? "Your personal guide to everyday life in the Netherlands."
                  : t.profileDescription}
              </p>
            </div>

            <Link
              href="/chat"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-blue-50 active:scale-[0.98]"
            >
              <Bot className="h-5 w-5" />
              {t.askAI}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/scanner"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black">
                {language === "en" ? "Scan a letter" : t.scanLetter}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {language === "en" ? "Understand Dutch mail" : t.assistant}
              </p>
            </div>
          </Link>

          <Link
            href="/notifications"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-black">Notifications</p>
              <p className="mt-1 text-xs text-slate-500">
                {unreadNotifications > 0
                  ? `${unreadNotifications} unread`
                  : language === "en"
                    ? "You're all caught up"
                    : t.assistant}
              </p>
            </div>
          </Link>
        </section>

        {/* SERVICES */}

        <section className="mt-11 sm:mt-14">
          <div className="mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
              {t.recommended}
            </p>

            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {language === "en"
                ? "Everything you need"
                : t.usefulTools}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {language === "en"
                ? "Practical tools for everyday life in the Netherlands."
                : t.profileDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3">
            {personalizedTools.map((tool) => {
              const toolText = t.tools[tool.key];

              const visual =
                serviceVisuals[String(tool.key)] ||
                serviceVisuals.documents;

              const Icon = visual.icon;

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group relative min-h-[205px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${visual.gradient} p-5 text-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.2)] active:scale-[0.98] sm:min-h-[225px] sm:p-6`}
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full ${visual.pattern} blur-3xl`}
                  />

                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${visual.iconBg} ${visual.accent} shadow-lg ring-1 backdrop-blur-xl sm:h-16 sm:w-16`}
                      >
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                      </div>

                      <ArrowRight className="h-5 w-5 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
                    </div>

                    <div className="mt-8">
                      <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                        Netherway
                      </p>

                      <h3 className="text-lg font-black tracking-tight sm:text-xl">
                        {toolText[0]}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/65 sm:text-sm">
                        {toolText[1]}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* WHAT DO I DO? — LAST SERVICE CARD */}

            <Link
              href="/what-do-i-do"
              className="group relative min-h-[205px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-5 text-white shadow-[0_14px_40px_rgba(124,58,237,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(124,58,237,0.25)] active:scale-[0.98] sm:min-h-[225px] sm:p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/15 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-200 ring-1 ring-violet-300/20 backdrop-blur-xl sm:h-16 sm:w-16">
                    <Bot className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-white/50 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>

                <div className="mt-8">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-violet-200/60">
                    YOUR NEXT STEP
                  </p>

                  <h3 className="text-lg font-black tracking-tight sm:text-xl">
                    What Do I Do?
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/70 sm:text-sm">
                    Get practical guidance on what to do next in the Netherlands.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* PROFILE INFORMATION */}

        <section className="mt-11 sm:mt-14">
          <details className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5 sm:p-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {t.profile}
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {t.profiles[currentProfile]}
                </h2>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-400 transition group-open:rotate-90" />
            </summary>

            <div className="border-t border-slate-100 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t.name}
                  </p>
                  <p className="mt-2 font-bold text-slate-900">
                    {profile.name || t.notSet}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t.location}
                  </p>
                  <p className="mt-2 font-bold text-slate-900">
                    {profile.city || t.notSet}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t.language}
                  </p>
                  <p className="mt-2 font-bold text-slate-900">
                    {languageNames[language] ||
                      profile.language ||
                      "English"}
                  </p>
                </div>
              </div>

              {(currentProfile === "refugee" ||
                currentProfile === "resident") &&
                profile.hasFamily && (
                  <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
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
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
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
                <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t.documentsServices}
                  </p>
                  <p className="mt-2 font-bold">
                    {documentList.length > 0
                      ? `${documentList.length} ${t.selected}`
                      : t.noneSelected}
                  </p>
                </div>
              )}

              <Link
                href="/onboarding"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                {t.edit}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </details>
        </section>

        {/* TOURIST PLANNER */}

        {currentProfile === "tourist" && (
          <section className="mt-11 sm:mt-14">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-blue-950 to-violet-950 p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.16)] sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    {t.touristMode}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {t.ready}
                  </h2>
                </div>

                <Link
                  href="/trip-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-slate-950 shadow-lg transition hover:bg-slate-100"
                >
                  {t.planTrip}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}

        <footer className="py-10 text-center text-xs font-medium text-slate-400">
          {t.guide} 🇳🇱 · {t.footer}
        </footer>
      </div>

      {/* BOTTOM NAVIGATION */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-xl grid-cols-4 items-end">
          {/* HOME */}

          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-blue-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <Home className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-black">
              {language === "en" ? "Home" : t.guide}
            </span>
          </Link>

          {/* SCANNER */}

          <Link
            href="/scanner"
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-slate-500 transition hover:text-blue-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
              <ScanLine className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-black">
              {language === "en" ? "Scanner" : t.scanLetter}
            </span>
          </Link>

          {/* AI */}

          <Link
            href="/chat"
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-slate-500 transition hover:text-indigo-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
              <Bot className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-black">
              {language === "en" ? "AI" : t.askAI}
            </span>
          </Link>

          {/* ADMINISTRATION */}

          <Link
            href="/administration"
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-slate-500 transition hover:text-violet-700"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
              <FileText className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-black">
              {language === "en" ? "Admin" : "Administration"}
            </span>
          </Link>
        </div>
      </nav>
    </main>
  );
}