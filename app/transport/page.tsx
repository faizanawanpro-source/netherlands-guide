"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TransportSection = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const sections: TransportSection[] = [
  {
    id: "train",
    title: "Trains",
    description:
      "Learn how Dutch trains work, how to find your platform, check departures and travel with NS.",
    image: "/transport/train.jpg",
  },
  {
    id: "bus",
    title: "Buses",
    description:
      "Understand bus stops, routes, boarding, checking in and checking out.",
    image: "/transport/bus.jpg",
  },
  {
    id: "tram",
    title: "Trams",
    description:
      "Learn how to use trams in Dutch cities and understand stops and routes.",
    image: "/transport/tram.jpg",
  },
  {
    id: "metro",
    title: "Metro",
    description:
      "Learn how metro stations, lines, platforms and transfers work.",
    image: "/transport/metro.jpg",
  },
  {
    id: "tickets",
    title: "Tickets & OVpay",
    description:
      "Understand OV-chipkaart, contactless payment, tickets and checking in and out.",
    image: "/transport/ovpay.jpg",
  },
  {
    id: "apps",
    title: "NS & 9292",
    description:
      "Learn which apps to use for journey planning, delays, departures and routes.",
    image: "/transport/transport-map.jpg",
  },
  {
    id: "discounts",
    title: "Discounts",
    description:
      "Learn about travel discounts, subscriptions and student travel products.",
    image: "/transport/car.jpg",
  },
  {
    id: "platform",
    title: "Stations & platforms",
    description:
      "Learn how to find your platform, track, departure time and train information.",
    image: "/transport/train.jpg",
  },
];

export default function TransportPage() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSection((current) => (current === id ? null : id));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
          </button>

          <div className="ml-auto">
            <p className="font-bold">Netherlands Guide</p>
            <p className="text-xs text-slate-500">
              Your guide to life in the Netherlands
            </p>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 text-white shadow-xl sm:p-10">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/10" />

          <div className="relative z-10 max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
              Getting around the Netherlands
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Public transport made simple
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
              Learn how trains, buses, trams and metros work in the
              Netherlands — without complicated explanations.
            </p>

          </div>

          <img
            src="/transport/train.jpg"
            alt="Dutch train"
            className="absolute bottom-0 right-0 hidden h-56 w-80 object-cover opacity-90 lg:block"
          />

        </div>

        {/* QUICK INTRO */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Start here
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            How does public transport work?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Public transport in the Netherlands includes trains, buses,
            trams and metros. You can often use a contactless bank card,
            phone, OV-chipkaart or another valid ticket to travel.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-blue-50">
              <img
                src="/transport/train.jpg"
                alt="Train"
                className="h-36 w-full object-cover"
              />
              <div className="p-4">
                <p className="font-bold">Train</p>
                <p className="mt-1 text-sm text-slate-600">
                  Mainly for travelling between cities.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-orange-50">
              <img
                src="/transport/bus.jpg"
                alt="Bus"
                className="h-36 w-full object-cover"
              />
              <div className="p-4">
                <p className="font-bold">Bus</p>
                <p className="mt-1 text-sm text-slate-600">
                  Useful for local and regional travel.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-purple-50">
              <img
                src="/transport/tram.jpg"
                alt="Tram"
                className="h-36 w-full object-cover"
              />
              <div className="p-4">
                <p className="font-bold">Tram & Metro</p>
                <p className="mt-1 text-sm text-slate-600">
                  Common in larger cities.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* MAIN SECTIONS */}
        <section className="mt-8">

          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Public transport guide
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Everything you need to know
            </h2>

            <p className="mt-2 text-slate-500">
              Choose a topic to learn how it works.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {sections.map((section) => {
              const isOpen = openSection === section.id;

              return (
                <div
                  key={section.id}
                  className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
                    isOpen
                      ? "border-blue-300 shadow-md"
                      : "border-slate-200 hover:border-blue-200"
                  }`}
                >

                  {/* CARD */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left"
                  >

                    <img
                      src={section.image}
                      alt={section.title}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-6">

                      <div className="flex items-center justify-between gap-3">

                        <h3 className="text-xl font-black">
                          {section.title}
                        </h3>

                        <span className="text-2xl font-light text-slate-400">
                          {isOpen ? "−" : "+"}
                        </span>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {section.description}
                      </p>

                    </div>

                  </button>

                  {/* OPEN CONTENT */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 px-6 pb-6 pt-5">

                      {section.id === "train" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Travelling by train
                          </h4>

                          <p>
                            Dutch trains are commonly used to travel between
                            cities and towns. NS is the main railway operator
                            for many journeys in the Netherlands.
                          </p>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="font-bold text-slate-900">
                              Before you leave
                            </p>

                            <ul className="mt-2 space-y-2">
                              <li>✓ Check your departure time.</li>
                              <li>✓ Check the train destination.</li>
                              <li>✓ Check your platform.</li>
                              <li>✓ Check whether there are disruptions.</li>
                            </ul>
                          </div>

                        </div>
                      )}

                      {section.id === "bus" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Travelling by bus
                          </h4>

                          <p>
                            Buses are useful for local and regional journeys.
                            Your journey planner normally tells you the bus
                            number, stop and departure time.
                          </p>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="font-bold text-slate-900">
                              Simple process
                            </p>

                            <p className="mt-2">
                              Find your stop → wait for your bus → check the
                              destination → board → check in → get off at your
                              stop → check out if required.
                            </p>
                          </div>

                        </div>
                      )}

                      {section.id === "tram" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Travelling by tram
                          </h4>

                          <p>
                            Trams are especially common in cities such as
                            Amsterdam, Rotterdam, The Hague and Utrecht.
                          </p>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="font-bold text-slate-900">
                              Remember
                            </p>

                            <p className="mt-2">
                              Check the tram number and direction before
                              boarding. Your journey planner can show which
                              stop you need.
                            </p>
                          </div>

                        </div>
                      )}

                      {section.id === "metro" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Travelling by metro
                          </h4>

                          <p>
                            Metro systems operate mainly in larger urban
                            areas. Stations normally have clear signs showing
                            the line and direction.
                          </p>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="font-bold text-slate-900">
                              Tip
                            </p>

                            <p className="mt-2">
                              Always check the final destination shown for
                              your direction, not just the line number.
                            </p>
                          </div>

                        </div>
                      )}

                      {section.id === "tickets" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Paying for your journey
                          </h4>

                          <p>
                            Depending on the journey and operator, you may be
                            able to use contactless payment, OV-chipkaart or
                            a separate ticket.
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">

                            <div className="rounded-2xl bg-white p-4">
                              <p className="font-bold text-slate-900">
                                OVpay
                              </p>

                              <p className="mt-1">
                                Travel using a suitable contactless bank card,
                                phone or other supported payment method.
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-4">
                              <p className="font-bold text-slate-900">
                                OV-chipkaart
                              </p>

                              <p className="mt-1">
                                A Dutch public transport card that can be used
                                for eligible journeys.
                              </p>
                            </div>

                          </div>

                          <div className="rounded-2xl bg-orange-50 p-4">
                            <p className="font-bold text-orange-900">
                              Important
                            </p>

                            <p className="mt-1 text-orange-800">
                              When your journey uses check-in and check-out,
                              remember to check out at the end of your trip.
                            </p>
                          </div>

                        </div>
                      )}

                      {section.id === "apps" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Useful transport apps
                          </h4>

                          <div className="grid gap-3 sm:grid-cols-2">

                            <div className="rounded-2xl bg-white p-4">
                              <p className="text-lg font-black">
                                NS
                              </p>

                              <p className="mt-1">
                                Useful for train journeys, departures,
                                disruptions and journey information.
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-4">
                              <p className="text-lg font-black">
                                9292
                              </p>

                              <p className="mt-1">
                                Useful for planning journeys using different
                                types of public transport.
                              </p>
                            </div>

                          </div>

                        </div>
                      )}

                      {section.id === "discounts" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Travel discounts
                          </h4>

                          <p>
                            There are different subscriptions and discounts
                            depending on your age, travel pattern, education
                            and personal situation.
                          </p>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="font-bold text-slate-900">
                              You may want to check
                            </p>

                            <ul className="mt-2 space-y-2">
                              <li>• NS travel subscriptions</li>
                              <li>• Student travel products</li>
                              <li>• Regional transport products</li>
                              <li>• Age-related discounts</li>
                            </ul>
                          </div>

                        </div>
                      )}

                      {section.id === "platform" && (
                        <div className="space-y-4 text-sm leading-6 text-slate-600">

                          <h4 className="font-bold text-slate-900">
                            Finding your platform
                          </h4>

                          <p>
                            Your journey planner normally shows the platform
                            or track information when it is available.
                          </p>

                          <div className="rounded-2xl bg-white p-4">

                            <p className="font-bold text-slate-900">
                              At the station
                            </p>

                            <ol className="mt-2 space-y-2">
                              <li>1. Find the departure information screens.</li>
                              <li>2. Find your train number or destination.</li>
                              <li>3. Check the platform or track.</li>
                              <li>4. Follow the signs.</li>
                              <li>
                                5. Check the train destination before
                                boarding.
                              </li>
                            </ol>

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </section>

        {/* OTHER TRANSPORT */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Other ways to travel
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            More transport options
          </h2>

          <p className="mt-2 text-slate-500">
            Public transport isn't the only way to get around the Netherlands.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="/transport/bike.jpg"
                alt="Bicycle"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">Cycling</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Bicycles are one of the most common ways to travel locally.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="/transport/taxi.jpg"
                alt="Taxi"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">Taxi</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Useful when you need direct door-to-door transport.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="/transport/airport.jpg"
                alt="Airport"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">Air travel</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Schiphol connects the Netherlands with destinations around
                  the world.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* SIMPLE TRAVEL STEPS */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Quick guide
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Taking public transport for the first time?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-black">01</div>
              <h3 className="mt-3 font-bold">Plan</h3>
              <p className="mt-1 text-sm text-slate-500">
                Check your route and departure time.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-black">02</div>
              <h3 className="mt-3 font-bold">Find</h3>
              <p className="mt-1 text-sm text-slate-500">
                Find your stop, station or platform.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-black">03</div>
              <h3 className="mt-3 font-bold">Travel</h3>
              <p className="mt-1 text-sm text-slate-500">
                Board the correct vehicle and follow your route.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-black">04</div>
              <h3 className="mt-3 font-bold">Check out</h3>
              <p className="mt-1 text-sm text-slate-500">
                Check out when required at the end of your journey.
              </p>
            </div>

          </div>
        </section>

        {/* AI HELP */}
        <section className="mt-8 rounded-[2rem] bg-slate-900 p-6 text-white shadow-lg sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                AI Guide
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Don't understand something?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Ask the AI Guide to explain public transport in simple
                language.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/chat")}
              className="shrink-0 rounded-xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-orange-50"
            >
              Ask AI →
            </button>

          </div>

        </section>

        {/* BACK */}
        <div className="py-8">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-semibold text-slate-500 transition hover:text-orange-500"
          >
            ← Back to Home
          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide · Making life in the Netherlands easier
      </footer>

    </main>
  );
}