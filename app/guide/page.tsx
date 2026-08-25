"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Answer = "yes" | "no" | "unknown";

type Question = {
  id: string;
  question: string;
  explanation: string;
};

const questions: Question[] = [
  {
    id: "registered",
    question: "Are you registered with a Dutch municipality?",
    explanation:
      "This means your address is officially registered with a Dutch municipality and recorded in the Dutch population register.",
  },
  {
    id: "mobile",
    question: "Do you have a mobile phone you can use?",
    explanation:
      "A mobile phone can be used for DigiD verification and for the official DigiD app.",
  },
  {
    id: "age",
    question: "Are you 14 years old or older?",
    explanation:
      "DigiD applications are normally made by the person who will use the DigiD. Age can affect how the application works.",
  },
];

function DigiDGuide() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[step];

  function answerQuestion(answer: Answer) {
    if (!currentQuestion) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));

    setShowExplanation(false);

    setTimeout(() => {
      setStep((previous) => previous + 1);
    }, 200);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setShowExplanation(false);
  }

  function askAI(question: string) {
    router.push(
      `/chat?question=${encodeURIComponent(question)}`
    );
  }

  const finished = step >= questions.length;

  const hasNo = Object.values(answers).includes("no");
  const hasUnknown = Object.values(answers).includes("unknown");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-5 py-8">

        <button
          onClick={() => router.push("/documents")}
          className="text-gray-500 hover:text-black mb-8"
        >
          ← Back to Documents
        </button>

        <div className="bg-white rounded-3xl shadow-sm p-7 md:p-10">

          <div className="text-6xl mb-5">🪪</div>

          <h1 className="text-4xl font-bold text-gray-900">
            DigiD
          </h1>

          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            DigiD is your digital identity for logging in to many Dutch
            government and public services.
          </p>

          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="font-semibold text-blue-900">
              👋 Let&apos;s figure this out together.
            </p>

            <p className="text-blue-800 mt-2">
              We&apos;ll ask a few simple questions. If you don&apos;t
              understand something, you can ask the AI to explain it.
            </p>
          </div>

          {!finished ? (
            <div className="mt-10">

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-500">
                  Question {step + 1} of {questions.length}
                </span>

                <span className="text-sm text-gray-400">
                  {Math.round(
                    (step / questions.length) * 100
                  )}
                  %
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div
                  className="bg-black h-2 rounded-full transition-all"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="border border-gray-200 rounded-3xl p-6 md:p-8">

                <div className="text-sm font-semibold text-gray-400">
                  QUICK CHECK
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {currentQuestion.question}
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <button
                  onClick={() =>
                    setShowExplanation(!showExplanation)
                  }
                  className="mt-4 text-sm font-semibold underline text-gray-700"
                >
                  {showExplanation
                    ? "Hide explanation"
                    : "Explain this more simply"}
                </button>

                {showExplanation && (
                  <div className="mt-4 bg-gray-50 rounded-2xl p-5">
                    <p className="text-gray-700">
                      In simple words: we are checking whether this
                      part of your situation matches what you need
                      for the normal DigiD process.
                    </p>

                    <button
                      onClick={() =>
                        askAI(
                          `I am on the DigiD guide in the Netherlands Guide app. The question is: "${currentQuestion.question}". Explain this question to me in very simple English, give me a real-life example, and tell me what I should look for before answering. Do not ask for passwords, PINs or other secret information.`
                        )
                      }
                      className="mt-4 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                    >
                      🤖 I still don&apos;t understand
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-3 mt-7">

                  <button
                    onClick={() => answerQuestion("yes")}
                    className="border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-black hover:bg-gray-50 transition"
                  >
                    <div className="text-3xl">✅</div>

                    <div className="font-bold mt-3">
                      Yes
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      This applies to me
                    </div>
                  </button>

                  <button
                    onClick={() => answerQuestion("no")}
                    className="border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-black hover:bg-gray-50 transition"
                  >
                    <div className="text-3xl">❌</div>

                    <div className="font-bold mt-3">
                      No
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      This does not apply
                    </div>
                  </button>

                  <button
                    onClick={() => answerQuestion("unknown")}
                    className="border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-black hover:bg-gray-50 transition"
                  >
                    <div className="text-3xl">❓</div>

                    <div className="font-bold mt-3">
                      I don&apos;t know
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      Help me understand
                    </div>
                  </button>

                </div>

              </div>
            </div>
          ) : (
            <div className="mt-10">

              {hasNo ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-7">

                  <div className="text-5xl">🤔</div>

                  <h2 className="text-2xl font-bold text-yellow-900 mt-4">
                    You may need to arrange something first
                  </h2>

                  <p className="text-yellow-800 mt-3 leading-relaxed">
                    One or more of your answers does not match the
                    normal situation for applying for DigiD.
                  </p>

                  <p className="text-yellow-800 mt-3 leading-relaxed">
                    This does not automatically mean you cannot get
                    DigiD. Your personal situation matters.
                  </p>

                  <button
                    onClick={() =>
                      askAI(
                        "I am trying to get DigiD in the Netherlands. My answers suggest I may need to arrange something first. Ask me simple questions about my situation and explain what I should check next. Do not ask for passwords, PINs or secret information."
                      )
                    }
                    className="mt-5 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    🤖 Ask AI what I should check
                  </button>

                </div>
              ) : hasUnknown ? (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-7">

                  <div className="text-5xl">💡</div>

                  <h2 className="text-2xl font-bold text-blue-900 mt-4">
                    You&apos;re not sure about something
                  </h2>

                  <p className="text-blue-800 mt-3 leading-relaxed">
                    That&apos;s completely okay. You do not need to
                    guess.
                  </p>

                  <p className="text-blue-800 mt-3 leading-relaxed">
                    The AI can ask you about your situation and
                    explain what you should check.
                  </p>

                  <button
                    onClick={() =>
                      askAI(
                        "I am trying to understand whether I can arrange DigiD in the Netherlands, but I am not sure about some of the requirements. Please ask me one simple question at a time and explain each question before I answer. Do not ask for passwords, PINs or secret information."
                      )
                    }
                    className="mt-5 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    🤖 Let AI guide me
                  </button>

                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-7">

                  <div className="text-5xl">🎉</div>

                  <h2 className="text-2xl font-bold text-green-900 mt-4">
                    Your answers look good
                  </h2>

                  <p className="text-green-800 mt-3 leading-relaxed">
                    Based on your answers, nothing in this quick
                    check suggests that you need to stop before
                    checking the official DigiD application process.
                  </p>

                  <p className="text-green-800 mt-3 leading-relaxed">
                    This app does not make an official eligibility
                    decision. Always check DigiD&apos;s current
                    requirements before applying.
                  </p>

                </div>
              )}

              <div className="mt-10">

                <h2 className="text-2xl font-bold text-gray-900">
                  What to do next
                </h2>

                <div className="mt-5 space-y-4">

                  <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                    <div className="text-3xl">1️⃣</div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Check the official DigiD website
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Read the current requirements and start the
                        official process there.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                    <div className="text-3xl">2️⃣</div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Complete the application
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Follow the instructions provided by DigiD.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                    <div className="text-3xl">3️⃣</div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Activate your DigiD
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Follow the official activation instructions
                        when you receive them.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-7">

                <h2 className="text-2xl font-bold text-blue-900">
                  📱 DigiD is also an app
                </h2>

                <p className="text-blue-800 mt-3 leading-relaxed">
                  DigiD is not only a website. There is also an official
                  DigiD app that can be used for secure login on supported
                  services.
                </p>

                <div className="mt-5 space-y-3 text-blue-800">

                  <p>
                    • Download the official DigiD app only from the
                    Apple App Store or Google Play.
                  </p>

                  <p>
                    • If DigiD does not work in your phone&apos;s
                    private/incognito browser, try a normal browser
                    window.
                  </p>

                  <p>
                    • Make sure you are using the official DigiD app
                    when the service asks you to use it.
                  </p>

                  <p>
                    • Never give your DigiD password or PIN to anyone,
                    including the AI.
                  </p>

                </div>

              </div>

              <div className="mt-8 border-t pt-8">

                <h2 className="text-2xl font-bold text-gray-900">
                  🔗 Official DigiD website
                </h2>

                <p className="text-gray-500 mt-2 leading-relaxed">
                  Use the official homepage when you need to apply or
                  manage your DigiD.
                </p>

                <a
                  href="https://www.digid.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Open DigiD homepage →
                </a>

              </div>

              <div className="mt-8 bg-gray-900 text-white rounded-3xl p-7">

                <div className="text-4xl">🤖</div>

                <h2 className="text-2xl font-bold mt-4">
                  Still confused?
                </h2>

                <p className="text-gray-300 mt-2 leading-relaxed">
                  You can explain your situation to the AI in your own
                  words. It will ask questions one at a time and explain
                  things simply.
                </p>

                <button
                  onClick={() =>
                    askAI(
                      "I need help understanding DigiD in the Netherlands. Ask me one simple question at a time, explain anything I do not understand, and guide me toward the correct official next step. Never ask me for my DigiD password, PIN, verification code or other secret information."
                    )
                  }
                  className="mt-5 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  🤖 Ask AI about my situation
                </button>

              </div>

              <button
                onClick={restart}
                className="mt-6 text-gray-500 hover:text-black font-semibold"
              >
                ↻ Start the questionnaire again
              </button>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}

function SimpleGuide({
  title,
  icon,
  description,
}: {
  title: string;
  icon: string;
  description: string;
}) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-5 py-8">

        <button
          onClick={() => router.push("/documents")}
          className="text-gray-500 hover:text-black mb-8"
        >
          ← Back to Documents
        </button>

        <div className="bg-white rounded-3xl shadow-sm p-7 md:p-10">

          <div className="text-6xl">{icon}</div>

          <h1 className="text-4xl font-bold text-gray-900 mt-5">
            {title}
          </h1>

          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            {description}
          </p>

          <div className="mt-8 bg-blue-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-900">
              🤖 Want help with this?
            </h2>

            <p className="text-blue-800 mt-2">
              The AI can ask you simple questions and explain what
              you should do next.
            </p>

            <button
              onClick={() =>
                router.push(
                  `/chat?question=${encodeURIComponent(
                    `I need help with ${title} in the Netherlands. Ask me simple questions about my situation and explain what I should do next. Do not ask for passwords, PINs or secret information.`
                  )}`
                )
              }
              className="mt-5 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              🤖 Ask AI →
            </button>
          </div>

          <div className="mt-8 border-t pt-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Official information
            </h2>

            <p className="text-gray-500 mt-2">
              Always use the official Dutch government organisation
              when providing personal information or submitting an
              application.
            </p>

            <button
              onClick={() => router.push("/documents")}
              className="mt-5 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              ← Back to Documents
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}

function GuidePageContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "digid";

  if (topic === "digid") {
    return <DigiDGuide />;
  }

  if (topic === "bsn") {
    return (
      <SimpleGuide
        title="BSN"
        icon="🔢"
        description="A BSN (burgerservicenummer) is your personal citizen service number in the Netherlands. You normally receive it when you register with a Dutch municipality."
      />
    );
  }

  if (topic === "municipality") {
    return (
      <SimpleGuide
        title="Municipality (Gemeente)"
        icon="🏛️"
        description="Your municipality handles many local government matters, including registration, addresses and personal records."
      />
    );
  }

  if (topic === "residence") {
    return (
      <SimpleGuide
        title="Residence documents"
        icon="🛂"
        description="Residence documents can show your right to stay in the Netherlands. The correct document depends on your personal situation."
      />
    );
  }

  if (topic === "letters") {
    return (
      <SimpleGuide
        title="Official letters"
        icon="📬"
        description="Government organisations may send letters containing important information, deadlines, payments or requests for documents."
      />
    );
  }

  return (
    <SimpleGuide
      title="Government services"
      icon="📋"
      description="Different Dutch government organisations are responsible for different services. The AI can help you understand where to start."
    />
  );
}

export default function GuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-gray-500">
            Loading guide...
          </div>
        </div>
      }
    >
      <GuidePageContent />
    </Suspense>
  );
}