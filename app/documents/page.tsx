"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DocumentStatus = "yes" | "no";

type Profile = {
  documents?: string[];
  name?: string;
};

type Translation = {
  guide: string;
  assistant: string;
  back: string;
  yourDocuments: string;
  documentsOf: string;
  description: string;
  done: string;
  actionNeeded: string;
  openGuide: string;
  profileConnection: string;
  profileDescription: string;
  editProfile: string;
  postcodeTitle: string;
  postcodeDescription: string;
  postcodePrivacy: string;
  findPostcode: string;
  dontUnderstand: string;
  aiDescription: string;
  askAI: string;
  documentData: Record<
    string,
    {
      title: string;
      description: string;
      yes: string;
      no: string;
    }
  >;
};

const t: Translation = {
  guide: "Netherlands Guide",
  assistant: "Your guide to life in the Netherlands",
  back: "← Back to Dashboard",
  yourDocuments: "Your documents",
  documentsOf: "Your documents",
  description:
    "We use the information you gave us when creating your profile. This helps us avoid showing you tasks for things you already have.",
  done: "✓ DONE",
  actionNeeded: "ACTION NEEDED",
  openGuide: "Open guide →",
  profileConnection: "Your documents follow your profile",
  profileDescription:
    "If you get a new document later, you can update your profile. Your document status will then change automatically.",
  editProfile: "⚙️ Edit my profile",
  postcodeTitle: "Need to find your postcode?",
  postcodeDescription:
    "You don't need to know your postcode by memory. Enter your address and get help finding the correct postcode.",
  postcodePrivacy:
    "Your address will not be saved by this feature.",
  findPostcode: "📍 Find my postcode",
  dontUnderstand: "Don't understand?",
  aiDescription:
    "Ask the AI Guide for a simple explanation about your documents or what you should do next.",
  askAI: "🤖 Ask AI →",

  documentData: {
    bsn: {
      title: "BSN",
      description:
        "Your personal citizen service number used for many Dutch government services.",
      yes: "You have your BSN",
      no: "Learn how to get a BSN",
    },

    digid: {
      title: "DigiD",
      description:
        "Your digital identity for logging in to many Dutch government and public services.",
      yes: "You have DigiD",
      no: "Check if you can apply",
    },

    residence: {
      title: "Residence document",
      description:
        "Your residence document or permit showing your right to stay in the Netherlands.",
      yes: "You have a residence document",
      no: "Learn what you need",
    },

    municipality: {
      title: "Municipality registration",
      description:
        "Your registration with the Dutch municipality where you live.",
      yes: "You are registered",
      no: "Learn how to register",
    },

    letters: {
      title: "Official letters",
      description:
        "Letters from Dutch government organisations can contain important information and deadlines.",
      yes: "You receive official letters",
      no: "Learn how they work",
    },
  },
};

const documentIds = [
  "bsn",
  "digid",
  "residence",
  "municipality",
  "letters",
];

function getStatus(
  selectedDocuments: string[],
  id: string
): DocumentStatus {
  return selectedDocuments.includes(id) ? "yes" : "no";
}

export default function DocumentsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile) as Profile);
      }
    } catch {
      setProfile(null);
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading...
        </p>
      </main>
    );
  }

  const selectedDocuments = profile?.documents ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div>
              <h1 className="font-bold">
                {t.guide}
              </h1>

              <p className="text-xs text-slate-500">
                {t.assistant}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        {/* BACK */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-7 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
        >
          {t.back}
        </button>

        {/* INTRO */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            {t.yourDocuments}
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {profile?.name
              ? `${profile.name}'s ${t.documentsOf}`
              : t.documentsOf}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            {t.description}
          </p>
        </div>

        {/* DOCUMENT CARDS */}
        <div className="grid gap-4 md:grid-cols-2">
          {documentIds.map((id) => {
            const document = t.documentData[id];

            const status = getStatus(
              selectedDocuments,
              id
            );

            const hasDocument = status === "yes";

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  router.push(`/guide?topic=${id}`)
                }
                className={`rounded-3xl border p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  hasDocument
                    ? "border-green-200 bg-green-50"
                    : "border-orange-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-5xl">
                    {id === "bsn" && "🔢"}
                    {id === "digid" && "🪪"}
                    {id === "residence" && "🛂"}
                    {id === "municipality" && "🏛️"}
                    {id === "letters" && "📬"}
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      hasDocument
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {hasDocument
                      ? t.done
                      : t.actionNeeded}
                  </div>
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  {document.title}
                </h2>

                <p className="mt-2 leading-relaxed text-slate-600">
                  {document.description}
                </p>

                <div
                  className={`mt-5 rounded-2xl p-4 font-semibold ${
                    hasDocument
                      ? "bg-white text-green-700"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {hasDocument
                    ? `✅ ${document.yes}`
                    : `→ ${document.no}`}
                </div>

                <div className="mt-4 text-sm font-semibold text-slate-500">
                  {t.openGuide}
                </div>
              </button>
            );
          })}
        </div>

        {/* PROFILE CONNECTION */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">
              💡
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {t.profileConnection}
              </h2>

              <p className="mt-2 leading-relaxed text-slate-500">
                {t.profileDescription}
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/onboarding")
                }
                className="mt-4 rounded-xl bg-slate-100 px-5 py-3 font-semibold transition hover:bg-slate-200"
              >
                {t.editProfile}
              </button>
            </div>
          </div>
        </div>

        {/* POSTCODE */}
        <div className="mt-8 rounded-3xl bg-blue-50 p-6">
          <div className="text-4xl">
            📍
          </div>

          <h2 className="mt-4 text-2xl font-bold text-blue-900">
            {t.postcodeTitle}
          </h2>

          <p className="mt-2 leading-relaxed text-blue-800">
            {t.postcodeDescription}
          </p>

          <p className="mt-3 text-sm text-blue-700">
            {t.postcodePrivacy}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/chat?question=I need help finding the postcode for my address in the Netherlands. Please explain what information I need to enter. Do not save my address."
              )
            }
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {t.findPostcode}
          </button>
        </div>

        {/* AI */}
        <div className="mt-8 rounded-3xl bg-indigo-50 p-7">
          <div className="text-4xl">
            🤖
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            {t.dontUnderstand}
          </h2>

          <p className="mt-2 leading-relaxed text-slate-600">
            {t.aiDescription}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/chat?question=I am not sure which Dutch government document or service I need. Ask me simple questions one at a time and guide me toward the correct official next step. Never ask me for passwords, PINs, or secret login information."
              )
            }
            className="mt-5 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            {t.askAI}
          </button>
        </div>

        {/* BOTTOM BACK */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-10 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
        >
          {t.back}
        </button>
      </section>
    </main>
  );
}