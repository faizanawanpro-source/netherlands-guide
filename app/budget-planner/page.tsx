"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Trip = {
  city: string;
  days: number;
  budget: string;
  interests: string;
  itinerary: string;
};

type BudgetLevel = "Budget" | "Comfort" | "Premium";

export default function BudgetPlannerPage() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budgetLevel, setBudgetLevel] =
    useState<BudgetLevel>("Comfort");

  useEffect(() => {
    const savedTrip = localStorage.getItem("finalizedTrip");

    if (savedTrip) {
      try {
        setTrip(JSON.parse(savedTrip));
      } catch {
        setTrip(null);
      }
    }
  }, []);

  const estimatedBudget = useMemo(() => {
    if (!trip) return null;

    const days = Math.max(1, Number(trip.days) || 1);

    const rates = {
      Budget: {
        hotel: 55,
        food: 35,
        transport: 12,
        attractions: 15,
        extras: 10,
      },
      Comfort: {
        hotel: 100,
        food: 55,
        transport: 18,
        attractions: 30,
        extras: 20,
      },
      Premium: {
        hotel: 200,
        food: 100,
        transport: 35,
        attractions: 60,
        extras: 40,
      },
    };

    const rate = rates[budgetLevel];

    const hotel = rate.hotel * days;
    const food = rate.food * days;
    const transport = rate.transport * days;
    const attractions = rate.attractions * days;
    const extras = rate.extras * days;

    const total =
      hotel +
      food +
      transport +
      attractions +
      extras;

    return {
      hotel,
      food,
      transport,
      attractions,
      extras,
      total,
    };
  }, [trip, budgetLevel]);

  if (!trip) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link
              href="/dashboard"
              className="font-black text-slate-700"
            >
              🇳🇱 Netherlands Guide
            </Link>

            <Link
              href="/trip-planner"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white"
            >
              Create a Trip
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-5 py-20 text-center">
          <div className="text-6xl">🧳</div>

          <h1 className="mt-6 text-4xl font-black">
            No finalized trip yet
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Create your trip with the AI Trip Planner first.
            Once you finalize it, your budget will appear here
            automatically.
          </p>

          <Link
            href="/trip-planner"
            className="mt-8 inline-block rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:bg-orange-600"
          >
            🤖 Open Trip Planner
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="font-black text-slate-900"
          >
            🇳🇱 Netherlands Guide
          </Link>

          <Link
            href="/trip-planner"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-orange-50"
          >
            ← Edit Trip
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">
            Trip finalized
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-6xl">
            💰 Your Trip Budget
          </h1>

          <p className="mt-4 max-w-2xl text-emerald-50 sm:text-lg">
            Here is an estimated budget based on the trip you
            just finalized.
          </p>
        </div>
      </section>

      {/* TRIP SUMMARY */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Destination
              </p>

              <p className="mt-2 text-2xl font-black">
                📍 {trip.city}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Duration
              </p>

              <p className="mt-2 text-2xl font-black">
                📅 {trip.days}{" "}
                {trip.days === 1 ? "day" : "days"}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Interests
              </p>

              <p className="mt-2 text-lg font-bold text-slate-700">
                ❤️ {trip.interests}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUDGET LEVEL */}
      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
            Choose your spending style
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            How do you want to travel?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(
              [
                {
                  name: "Budget",
                  icon: "💶",
                  description:
                    "Affordable accommodation, food and activities.",
                },
                {
                  name: "Comfort",
                  icon: "💳",
                  description:
                    "A comfortable trip with a good balance.",
                },
                {
                  name: "Premium",
                  icon: "💎",
                  description:
                    "Better hotels, restaurants and experiences.",
                },
              ] as const
            ).map((option) => {
              const active = budgetLevel === option.name;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() =>
                    setBudgetLevel(option.name)
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="text-3xl">
                    {option.icon}
                  </div>

                  <h3 className="mt-3 text-lg font-black">
                    {option.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BUDGET BREAKDOWN */}
      {estimatedBudget && (
        <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
                Estimated costs
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {budgetLevel} trip
              </h2>

              <div className="mt-7 space-y-4">
                <BudgetRow
                  icon="🏨"
                  label="Accommodation"
                  amount={estimatedBudget.hotel}
                />

                <BudgetRow
                  icon="🍔"
                  label="Food"
                  amount={estimatedBudget.food}
                />

                <BudgetRow
                  icon="🚆"
                  label="Transport"
                  amount={estimatedBudget.transport}
                />

                <BudgetRow
                  icon="🎟️"
                  label="Attractions & activities"
                  amount={estimatedBudget.attractions}
                />

                <BudgetRow
                  icon="☕"
                  label="Extras"
                  amount={estimatedBudget.extras}
                />
              </div>
            </div>

            {/* TOTAL */}
            <div className="rounded-[2rem] bg-slate-900 p-7 text-white shadow-xl sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-400">
                Estimated total
              </p>

              <p className="mt-4 text-5xl font-black">
                €{estimatedBudget.total}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Approximate total for {trip.days}{" "}
                {trip.days === 1 ? "day" : "days"}.
              </p>

              <div className="mt-7 rounded-2xl bg-white/5 p-5">
                <p className="text-sm font-bold text-slate-300">
                  Average per day
                </p>

                <p className="mt-1 text-2xl font-black">
                  €
                  {Math.round(
                    estimatedBudget.total /
                      Math.max(1, trip.days)
                  )}
                </p>
              </div>

              <p className="mt-6 text-xs leading-5 text-slate-500">
                These are planning estimates, not live prices.
                Actual costs can change depending on dates,
                availability and bookings.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ITINERARY */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
            Your finalized plan
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Trip itinerary
          </h2>

          <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {trip.itinerary}
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

function BudgetRow({
  icon,
  label,
  amount,
}: {
  icon: string;
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
          {icon}
        </div>

        <p className="font-bold text-slate-700">
          {label}
        </p>
      </div>

      <p className="font-black text-slate-900">
        €{amount}
      </p>
    </div>
  );
}