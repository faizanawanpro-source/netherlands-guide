"use client";

import Link from "next/link";

export default function DutchPhoneNumberPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            <span className="text-2xl">←</span>

            <div>
              <p className="font-black">Home</p>
              <p className="text-xs text-slate-500">
                Netherlands Guide
              </p>
            </div>
          </Link>

          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
            📱 Phone Guide
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        {/* HERO IMAGE */}
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <img
            src="/images/phone.jpg"
            alt="Dutch mobile phone and SIM card"
            className="block h-64 w-full object-cover sm:h-96"
          />

          <div className="bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 p-8 text-white sm:p-10">
            <div className="text-4xl">📱</div>

            <h1 className="mt-4 text-3xl font-black sm:text-5xl">
              Dutch Phone Number
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-orange-50 sm:text-lg">
              Everything you need to know about Dutch mobile
              numbers, SIM cards, eSIMs, prepaid and subscriptions.
            </p>
          </div>
        </section>

        {/* TYPES */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon="📱"
            title="SIM card"
            text="A physical SIM card that you put inside your phone."
          />

          <InfoCard
            icon="🌐"
            title="eSIM"
            text="A digital SIM that can be activated without a physical card."
          />

          <InfoCard
            icon="💶"
            title="Prepaid"
            text="Add credit when you need it without a monthly contract."
          />

          <InfoCard
            icon="📅"
            title="Subscription"
            text="Pay monthly for a package with data, calls and texts."
          />
        </section>

        {/* DUTCH NUMBER */}
        <section className="mt-8 rounded-[2rem] border border-orange-200 bg-orange-50 p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              🇳🇱
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-wider text-orange-600">
                Dutch mobile number
              </p>

              <h2 className="mt-2 text-2xl font-black text-orange-950 sm:text-3xl">
                What does a Dutch number look like?
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-orange-950/75">
                Dutch mobile numbers normally start with{" "}
                <strong>06</strong> when calling from inside the
                Netherlands.
              </p>

              <div className="mt-5 rounded-2xl bg-white p-5 font-mono text-xl font-black text-orange-700 shadow-sm">
                06 12345678
              </div>

              <p className="mt-5 max-w-3xl leading-7 text-orange-950/75">
                When calling from outside the Netherlands, replace
                the first <strong>0</strong> with{" "}
                <strong>+31</strong>.
              </p>

              <div className="mt-4 rounded-2xl bg-white p-5 font-mono text-xl font-black text-orange-700 shadow-sm">
                +31 6 12345678
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO GET ONE */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-sm font-black uppercase tracking-wider text-orange-500">
            Getting started
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            How can you get a Dutch number?
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Step
              number="1"
              icon="🏪"
              title="Choose a provider"
              text="Compare mobile providers and choose a plan that fits your needs."
            />

            <Step
              number="2"
              icon="📱"
              title="Choose SIM or eSIM"
              text="Choose a physical SIM or an eSIM if your phone supports it."
            />

            <Step
              number="3"
              icon="✅"
              title="Activate it"
              text="Follow the provider's instructions to activate your number."
            />
          </div>
        </section>

        {/* CHECKLIST */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-sm font-black uppercase tracking-wider text-orange-500">
            Before choosing
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            What should you check?
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <CheckItem text="Amount of mobile data" />
            <CheckItem text="Calls and texts included" />
            <CheckItem text="Monthly price" />
            <CheckItem text="Contract duration" />
            <CheckItem text="Cancellation conditions" />
            <CheckItem text="eSIM support" />
            <CheckItem text="Coverage in your area" />
            <CheckItem text="5G availability" />
          </div>
        </section>

        {/* AI */}
        <section className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-4xl">🤖</div>

              <h2 className="mt-4 text-2xl font-black">
                Need help choosing?
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/80">
                Ask Netherlands Guide AI about SIM cards,
                providers, subscriptions or your own situation.
              </p>
            </div>

            <Link
              href="/chat"
              className="rounded-xl bg-white px-6 py-3 text-center font-black text-indigo-700 transition hover:bg-indigo-50"
            >
              Ask AI →
            </Link>
          </div>
        </section>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱
          <span className="mx-2">·</span>
          Making life in the Netherlands easier
        </footer>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
        {icon}
      </div>

      <h2 className="mt-4 text-lg font-black">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
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
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
          {number}
        </span>

        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
        ✓
      </span>

      <span className="text-sm font-bold">{text}</span>
    </div>
  );
}