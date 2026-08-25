"use client";

import { useEffect, useMemo, useState } from "react";

type Profile = {
  profile?: string;
  age?: string;
  city?: string;
  language?: string;
  help?: string[];
};

type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  categories: string[];
};

const roadmapSteps: RoadmapStep[] = [
  {
    id: "municipality",
    title: "Register with your municipality",
    description:
      "Learn how registration with your gemeente works and what documents you may need.",
    icon: "🏛️",
    categories: ["refugee", "local", "dutch"],
  },
  {
    id: "bsn",
    title: "Get your BSN",
    description:
      "Understand what a BSN is and why you need it for life in the Netherlands.",
    icon: "🆔",
    categories: ["refugee", "student", "local", "dutch"],
  },
  {
    id: "digid",
    title: "Set up DigiD",
    description:
      "Learn how to request and use DigiD for government services.",
    icon: "🔐",
    categories: ["refugee", "student", "local", "dutch"],
  },
  {
    id: "bank",
    title: "Open a Dutch bank account",
    description:
      "Learn how Dutch bank accounts and debit cards work.",
    icon: "🏦",
    categories: ["refugee", "student", "local", "dutch"],
  },
  {
    id: "health-insurance",
    title: "Arrange health insurance",
    description:
      "Understand Dutch health insurance and how to find the right information.",
    icon: "❤️",
    categories: ["refugee", "student", "local", "dutch"],
  },
  {
    id: "housing",
    title: "Understand housing",
    description:
      "Learn how renting, housing registration and finding a home work.",
    icon: "🏠",
    categories: ["refugee", "student", "local"],
  },
  {
    id: "benefits",
    title: "Check benefits and discounts",
    description:
      "Find out which Dutch benefits, allowances and discounts may apply to you.",
    icon: "💶",
    categories: ["refugee", "student", "local", "dutch"],
  },
  {
    id: "dutch",
    title: "Learn Dutch",
    description:
      "Find Dutch language courses and understand the different ways to learn Dutch.",
    icon: "🗣️",
    categories: ["refugee", "student", "local"],
  },
  {
    id: "integration",
    title: "Understand inburgering",
    description:
      "Learn what civic integration means and where to find official information.",
    icon: "🇳🇱",
    categories: ["refugee"],
  },
  {
    id: "children-school",
    title: "Find schools for children",
    description:
      "Learn how education works and how to look for a suitable school.",
    icon: "📚",
    categories: ["refugee", "local", "dutch"],
  },
  {
    id: "transport",
    title: "Learn Dutch public transport",
    description:
      "Understand OV-chipkaart, trains, buses, trams and checking in and out.",
    icon: "🚆",
    categories: ["refugee", "student", "tourist", "local", "dutch"],
  },
  {
    id: "daily-life",
    title: "Learn everyday life",
    description:
      "Learn about shopping, ordering food, pharmacies, waste and everyday services.",
    icon: "🛒",
    categories: ["refugee", "student", "tourist", "local", "dutch"],
  },
];

const touristSteps: RoadmapStep[] = [
  {
    id: "transport",
    title: "Understand public transport",
    description:
      "Learn how to travel by train, bus, tram and metro.",
    icon: "🚆",
    categories: ["tourist"],
  },
  {
    id: "tickets",
    title: "Understand tickets and check-in",
    description:
      "Learn how tickets and checking in and out work.",
    icon: "🎫",
    categories: ["tourist"],
  },
  {
    id: "food",
    title: "Find food and restaurants",
    description:
      "Learn how ordering food and eating out works in the Netherlands.",
    icon: "🍽️",
    categories: ["tourist"],
  },
  {
    id: "emergency",
    title: "Know what to do in an emergency",
    description:
      "Learn the important emergency services and what to do if something goes wrong.",
    icon: "🚨",
    categories: ["tourist"],
  },
  {
    id: "culture",
    title: "Understand Dutch culture",
    description:
      "Learn useful Dutch customs, manners and everyday expectations.",
    icon: "🇳🇱",
    categories: ["tourist"],
  },
];

export default function PersonalRoadmap() {
  const [profile, setProfile] = useState<Profile>({});
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedCompleted = localStorage.getItem(
        "netherlandsGuideCompletedSteps"
      );

      if (savedCompleted) {
        setCompleted(JSON.parse(savedCompleted));
      }
    } catch (error) {
      console.error("Could not load roadmap:", error);
    }
  }, []);

  const steps = useMemo(() => {
    if (profile.profile === "tourist") {
      return touristSteps;
    }

    if (!profile.profile) {
      return roadmapSteps.slice(0, 6);
    }

    return roadmapSteps.filter((step) =>
      step.categories.includes(profile.profile || "")
    );
  }, [profile.profile]);

  const toggleCompleted = (id: string) => {
    setCompleted((current) => {
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      localStorage.setItem(
        "netherlandsGuideCompletedSteps",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const completedCount = steps.filter((step) =>
    completed.includes(step.id)
  ).length;

  const progress =
    steps.length === 0
      ? 0
      : Math.round((completedCount / steps.length) * 100);

  return (
    <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Your roadmap
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Your next steps in the Netherlands
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Follow these steps one by one. Your progress is saved
            automatically.
          </p>

          {profile.city && (
            <p className="mt-3 text-sm font-semibold text-slate-700">
              📍 Your city: {profile.city}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-2xl bg-orange-50 px-5 py-4 text-center">
          <p className="text-2xl font-black text-orange-600">
            {progress}%
          </p>

          <p className="text-xs font-semibold text-orange-700">
            completed
          </p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-7 space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completed.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => toggleCompleted(step.id)}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                isCompleted
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                  isCompleted
                    ? "bg-green-100"
                    : "bg-slate-100"
                }`}
              >
                {isCompleted ? "✓" : step.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    STEP {index + 1}
                  </span>

                  {isCompleted && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                      COMPLETED
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-1 font-bold ${
                    isCompleted
                      ? "text-green-800 line-through"
                      : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>

              <span className="mt-1 text-slate-300">
                →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}