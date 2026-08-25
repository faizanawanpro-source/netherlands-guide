"use client";

import { useState } from "react";
import Link from "next/link";

const cities = [
  "Amsterdam",
  "Rotterdam",
  "Utrecht",
  "The Hague",
  "Eindhoven",
  "Groningen",
  "Maastricht",
];

const interests = [
  "Museums",
  "Food",
  "Canals & boats",
  "Nature",
  "History",
  "Shopping",
  "Architecture",
  "Nightlife",
];

export default function PlanDayPage() {
  const [city, setCity] = useState("Amsterdam");
  const [hours, setHours] = useState("6");
  const [budget, setBudget] = useState("50");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Museums",
    "Food",
  ]);
  const [showPlan, setShowPlan] = useState(false);

  function toggleInterest(interest: string) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function createPlan() {
    setShowPlan(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/explore"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Explore
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div className="hidden sm:block">
              <p className="font-black">Netherlands Guide</p>
              <p className="text-xs text-slate-500">
                Your personal travel guide
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 p-7 text-white shadow-xl sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-100">
            Smart travel planner
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Plan my day
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
            Tell us where you are going, how much time you have and what
            you enjoy. Netherlands Guide will build a simple day plan.
          </p>
        </div>

        {/* FORM */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black">
            Tell us about your day
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You can change these options whenever you want.
          </p>

          {/* CITY */}
          <div className="mt-7">
            <label className="text-sm font-black">
              Where are you going?
            </label>

            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* HOURS */}
          <div className="mt-7">
            <label className="text-sm font-black">
              How many hours do you have?
            </label>

            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {["3", "4", "5", "6", "8", "10"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setHours(item)}
                  className={`rounded-xl border px-4 py-3 font-bold transition ${
                    hours === item
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {item}h
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET */}
          <div className="mt-7">
            <label className="text-sm font-black">
              What is your budget?
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {["20", "50", "75", "100", "150"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBudget(item)}
                  className={`rounded-xl border px-4 py-3 font-bold transition ${
                    budget === item
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  €{item}
                </button>
              ))}
            </div>
          </div>

          {/* INTERESTS */}
          <div className="mt-7">
            <label className="text-sm font-black">
              What are you interested in?
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {interests.map((interest) => {
                const selected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-xl border p-4 text-left font-bold transition ${
                      selected
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{interest}</span>

                      <span>
                        {selected ? "✓" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CREATE BUTTON */}
          <button
            type="button"
            onClick={createPlan}
            className="mt-8 w-full rounded-xl bg-slate-900 px-5 py-4 font-black text-white transition hover:bg-slate-800"
          >
            Create my day plan →
          </button>
        </section>

        {/* PLAN */}
        {showPlan && (
          <section className="mt-8 rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
                  Your plan
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {city} in {hours} hours
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Budget: €{budget} · Interests:{" "}
                  {selectedInterests.length > 0
                    ? selectedInterests.join(", ")
                    : "General sightseeing"}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 px-5 py-4 text-center">
                <p className="text-xs font-bold uppercase text-orange-500">
                  Budget
                </p>

                <p className="text-2xl font-black text-orange-700">
                  €{budget}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="font-black text-orange-500">
                  10:00
                </div>

                <div>
                  <h3 className="font-black">
                    Start exploring {city}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Start your day at a central location and explore the
                    area around you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="font-black text-orange-500">
                  12:00
                </div>

                <div>
                  <h3 className="font-black">
                    Visit a popular attraction
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose an attraction matching your interests:
                    {selectedInterests.length > 0
                      ? ` ${selectedInterests.join(", ")}.`
                      : " museums, landmarks or local attractions."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="font-black text-orange-500">
                  14:00
                </div>

                <div>
                  <h3 className="font-black">
                    Lunch & local food
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Take a break and try a local restaurant, café or
                    Dutch snack.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="font-black text-orange-500">
                  15:30
                </div>

                <div>
                  <h3 className="font-black">
                    Explore another part of the city
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Walk, cycle or use public transport to your next
                    destination.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="font-black text-orange-500">
                  17:00
                </div>

                <div>
                  <h3 className="font-black">
                    Finish with something memorable
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    End your day with a viewpoint, park, canal,
                    shopping area or another activity.
                  </p>
                </div>
              </div>
            </div>

            {/* AI */}
            <div className="mt-7 rounded-2xl bg-slate-900 p-5 text-white">
              <p className="font-black">
                🤖 Want a smarter plan?
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Later, Netherlands Guide will use AI to create a
                personalised itinerary using your exact interests,
                budget and available time.
              </p>

              <Link
                href="/chat"
                className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900 hover:bg-orange-50"
              >
                Ask AI →
              </Link>
            </div>
          </section>
        )}

        {/* BACK */}
        <div className="py-8">
          <Link
            href="/explore"
            className="font-bold text-slate-500 transition hover:text-orange-500"
          >
            ← Back to Explore
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide 🇳🇱 · Your personal travel guide
      </footer>
    </main>
  );
}