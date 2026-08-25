"use client";

import Link from "next/link";
import { useState } from "react";

type TripResult = {
  itinerary: string;
};

export default function TripPlannerPage() {
  const [city, setCity] = useState("Amsterdam");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("Comfort");
  const [interests, setInterests] = useState(
    "museums, food, sightseeing and nature"
  );

  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateTrip() {
    setError("");
    setItinerary("");

    if (!city || !days || !budget || !interests) {
      setError("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          days,
          budget,
          interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setItinerary(data.itinerary);
    } catch (err) {
      console.error(err);

      setError(
        "We could not create your trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function finalizeTrip() {
    if (!itinerary) {
      setError("Please generate your trip first.");
      return;
    }

    const finalizedTrip = {
      city,
      days: Number(days),
      budget,
      interests,
      itinerary,
    };

    localStorage.setItem(
      "finalizedTrip",
      JSON.stringify(finalizedTrip)
    );

    window.location.href = "/budget-planner";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div className="hidden sm:block">
              <p className="font-black">
                Netherlands Guide
              </p>

              <p className="text-xs text-slate-500">
                Your AI travel assistant
              </p>
            </div>
          </Link>

          <Link
            href="/explore"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Explore
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200">
              AI Trip Planner
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Let AI build your perfect trip
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Tell us where you are going, how long you
              have, your spending style and what you enjoy.
              Our AI will create a personalized itinerary.
            </p>
          </div>
        </div>
      </section>

      {/* PLANNER */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* FORM */}
          <div className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
              Step 1
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Tell us about your trip
            </h2>

            <div className="mt-7 space-y-6">
              {/* CITY */}
              <div>
                <label className="text-sm font-black text-slate-700">
                  📍 Where are you going?
                </label>

                <select
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option>Amsterdam</option>
                  <option>Rotterdam</option>
                  <option>Utrecht</option>
                  <option>The Hague</option>
                  <option>Eindhoven</option>
                  <option>Maastricht</option>
                  <option>Hilversum</option>
                  <option>Haarlem</option>
                </select>
              </div>

              {/* DAYS */}
              <div>
                <label className="text-sm font-black text-slate-700">
                  📅 How many days?
                </label>

                <select
                  value={days}
                  onChange={(event) =>
                    setDays(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                  <option value="10">10 days</option>
                  <option value="14">14 days</option>
                </select>
              </div>

              {/* BUDGET */}
              <div>
                <label className="text-sm font-black text-slate-700">
                  💰 What is your spending style?
                </label>

                <div className="mt-3 space-y-3">
                  <BudgetOption
                    selected={budget === "Budget"}
                    onClick={() => setBudget("Budget")}
                    icon="💶"
                    title="Budget"
                    description="€50–€100 per day"
                  />

                  <BudgetOption
                    selected={budget === "Comfort"}
                    onClick={() => setBudget("Comfort")}
                    icon="💳"
                    title="Comfort"
                    description="€100–€200 per day"
                  />

                  <BudgetOption
                    selected={budget === "Premium"}
                    onClick={() => setBudget("Premium")}
                    icon="💎"
                    title="Premium"
                    description="€200+ per day"
                  />
                </div>
              </div>

              {/* INTERESTS */}
              <div>
                <label className="text-sm font-black text-slate-700">
                  ❤️ What do you like?
                </label>

                <textarea
                  value={interests}
                  onChange={(event) =>
                    setInterests(event.target.value)
                  }
                  rows={5}
                  placeholder="For example: museums, football, shopping, nature, nightlife, Dutch food..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-600">
                  {error}
                </div>
              )}

              {/* GENERATE */}
              <button
                type="button"
                onClick={generateTrip}
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-base font-black text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "🤖 Creating your trip..."
                  : "🤖 Generate My Trip"}
              </button>
            </div>
          </div>

          {/* RESULT */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {!itinerary && !loading && (
              <div className="flex min-h-[500px] items-center justify-center text-center">
                <div className="max-w-md">
                  <div className="text-7xl">🧳</div>

                  <h2 className="mt-6 text-3xl font-black">
                    Your trip will appear here
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    Choose your destination, number of days,
                    spending style and interests. Then let AI
                    create your personalized itinerary.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[500px] items-center justify-center text-center">
                <div>
                  <div className="text-6xl animate-bounce">
                    🤖
                  </div>

                  <h2 className="mt-6 text-2xl font-black">
                    Creating your trip...
                  </h2>

                  <p className="mt-3 text-sm text-slate-500">
                    Our AI is planning activities, food,
                    transport and experiences for you.
                  </p>
                </div>
              </div>
            )}

            {itinerary && !loading && (
              <div>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-500">
                      Your personalized trip
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                      {city} · {days}{" "}
                      {Number(days) === 1 ? "day" : "days"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {budget} travel style · {interests}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={generateTrip}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    🔄 Regenerate
                  </button>
                </div>

                <div className="mt-7 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 sm:p-7">
                  {itinerary}
                </div>

                {/* FINALIZE */}
                <div className="mt-7 rounded-[1.5rem] bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-emerald-100">
                    Step 2
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Happy with your trip?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-50">
                    Finalize this itinerary and we will
                    automatically create your estimated trip
                    budget.
                  </p>

                  <button
                    type="button"
                    onClick={finalizeTrip}
                    className="mt-5 w-full rounded-xl bg-white px-6 py-4 font-black text-emerald-700 shadow-md transition hover:bg-emerald-50"
                  >
                    ✨ Finalize My Trip →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-6">
        <div className="rounded-[2rem] bg-slate-900 p-7 text-white sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            How it works
          </p>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <Step
              number="1"
              icon="🤖"
              title="Plan"
              text="Tell AI where you want to go and what you enjoy."
            />

            <Step
              number="2"
              icon="✨"
              title="Finalize"
              text="Review your itinerary and finalize the trip when you are happy."
            />

            <Step
              number="3"
              icon="💰"
              title="Budget"
              text="Your finalized trip automatically continues to the Budget Planner."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide 🇳🇱 · Plan smarter, travel better
      </footer>
    </main>
  );
}

function BudgetOption({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-orange-500 bg-orange-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-orange-300"
      }`}
    >
      <div className="text-2xl">{icon}</div>

      <div>
        <p className="font-black">{title}</p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <div className="ml-auto">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            selected
              ? "border-orange-500 bg-orange-500"
              : "border-slate-300"
          }`}
        >
          {selected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </button>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-black">
          {number}
        </div>

        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}