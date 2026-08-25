"use client";

import { useRouter } from "next/navigation";

type HousingLink = {
  name: string;
  description: string;
  icon: string;
  href: string;
};

const housingLinks: HousingLink[] = [
  {
    name: "Funda",
    description:
      "Search for rental homes and apartments across the Netherlands.",
    icon: "🏠",
    href: "https://www.funda.nl/en/",
  },
  {
    name: "Pararius",
    description:
      "A major platform for finding rental apartments and houses.",
    icon: "🔎",
    href: "https://www.pararius.com/english",
  },
  {
    name: "Kamernet",
    description:
      "Useful for rooms, studios, apartments and finding roommates.",
    icon: "🛏️",
    href: "https://kamernet.nl/en",
  },
];

const housingSteps = [
  {
    icon: "1️⃣",
    title: "Decide what you need",
    text: "Choose between a room, studio, apartment, house or social housing.",
  },
  {
    icon: "2️⃣",
    title: "Choose your location",
    text: "Think about the city, neighbourhood, school, work, public transport and how far you want to travel.",
  },
  {
    icon: "3️⃣",
    title: "Set your budget",
    text: "Work out what you can comfortably afford every month, not just the advertised rent.",
  },
  {
    icon: "4️⃣",
    title: "Search online",
    text: "Use several housing websites and check regularly because good properties can disappear quickly.",
  },
  {
    icon: "5️⃣",
    title: "Contact the landlord",
    text: "Ask whether the property is available, whether registration is possible and how you can arrange a viewing.",
  },
  {
    icon: "6️⃣",
    title: "View the property",
    text: "Check the condition, heating, windows, kitchen, bathroom, appliances and the surrounding area.",
  },
  {
    icon: "7️⃣",
    title: "Check the contract",
    text: "Understand the rent, deposit, service costs, utilities, contract period and termination rules before signing.",
  },
  {
    icon: "8️⃣",
    title: "Move in",
    text: "Arrange registration, utilities, internet, insurance and other services you need at your new address.",
  },
];

const viewingChecklist = [
  "Is registration at this address possible?",
  "What is the total monthly cost?",
  "How much is the deposit?",
  "Are gas, electricity and water included?",
  "Are service costs included?",
  "Is internet included?",
  "How long is the rental contract?",
  "Who is the landlord or agency?",
  "Can you see the property before paying?",
  "Are there existing damages?",
];

const contractPoints = [
  {
    icon: "💶",
    title: "Rent",
    text: "Check exactly how much rent you have to pay and when it is due.",
  },
  {
    icon: "💰",
    title: "Deposit",
    text: "Check the amount of the security deposit and the conditions for getting it back.",
  },
  {
    icon: "🧾",
    title: "Service costs",
    text: "Some buildings charge additional costs for shared services or facilities.",
  },
  {
    icon: "📅",
    title: "Contract period",
    text: "Check whether your contract is temporary or indefinite and understand the rules that apply.",
  },
  {
    icon: "📤",
    title: "Ending the contract",
    text: "Read the notice period and the correct way to give notice before leaving.",
  },
  {
    icon: "🏠",
    title: "Condition of the property",
    text: "Make sure the condition of the home is clear when you move in.",
  },
];

const utilityCards = [
  {
    icon: "🔥",
    title: "Gas",
    text: "If gas is not included in your rent, you normally need an energy contract that covers your home. Gas may be used for heating or cooking.",
    color: "bg-orange-50",
  },
  {
    icon: "⚡",
    title: "Electricity",
    text: "You may need to choose an energy supplier and pay for the electricity you use. Your supplier can usually offer monthly advance payments.",
    color: "bg-yellow-50",
  },
  {
    icon: "💧",
    title: "Water",
    text: "Water is handled separately from electricity and gas. Depending on your situation, you may receive charges from the regional water company.",
    color: "bg-blue-50",
  },
  {
    icon: "🌐",
    title: "Internet",
    text: "Internet is often arranged separately. Compare providers and check whether the property already has a connection.",
    color: "bg-purple-50",
  },
  {
    icon: "📱",
    title: "Mobile phone",
    text: "Your mobile phone contract is normally separate from your home bills. Choose a plan that fits your usage.",
    color: "bg-pink-50",
  },
  {
    icon: "🏛️",
    title: "Municipal charges",
    text: "Your municipality or other authorities may send bills for certain local taxes or charges.",
    color: "bg-green-50",
  },
];

const billSteps = [
  {
    icon: "📄",
    title: "You receive a bill",
    text: "A bill normally explains what you are paying, the amount and the payment deadline.",
  },
  {
    icon: "📱",
    title: "Pay online",
    text: "Many Dutch bills can be paid through iDEAL, your bank app or another payment method offered by the organisation.",
  },
  {
    icon: "🏦",
    title: "Automatic payment",
    text: "Some companies allow direct debit. This means the amount is automatically taken from your bank account.",
  },
  {
    icon: "⏰",
    title: "Do not ignore deadlines",
    text: "Keep track of payment dates. Late payments can result in reminders or additional costs.",
  },
];

const moveInChecklist = [
  "Register your address with the municipality if required.",
  "Take photos of the property when you move in.",
  "Record electricity, gas and water meter readings if applicable.",
  "Arrange energy if it is not included.",
  "Check how water charges work.",
  "Arrange internet if needed.",
  "Check your rental contract again.",
  "Keep your landlord's or agency's contact details.",
  "Keep copies of important documents and payment confirmations.",
];

const scamWarnings = [
  "The property is extremely cheap compared with similar properties.",
  "The person refuses to let you view the property.",
  "You are pressured to pay immediately.",
  "You are asked to transfer money before you can verify the property.",
  "The landlord refuses to provide clear information about the contract.",
  "The listing contains suspicious or inconsistent information.",
  "Someone asks for your DigiD password, PIN or banking login.",
];

export default function HousingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            ← Home
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div className="hidden sm:block">
              <p className="font-bold">Netherlands Guide</p>
              <p className="text-xs text-slate-500">
                Your guide to life in the Netherlands
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        {/* HERO */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 p-7 text-white shadow-xl sm:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              🏠 Housing in the Netherlands
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Find a home and understand what comes next
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
              From finding a room or apartment to signing a contract,
              paying your bills and moving in — this guide explains the
              whole process in simple steps.
            </p>
          </div>
        </section>

        {/* HOUSING TYPES */}
        <section className="mt-8 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Start here
          </p>

          <h2 className="mt-2 text-3xl font-black">
            What type of housing are you looking for?
          </h2>

          <p className="mt-2 text-slate-500">
            The best option depends on your budget and situation.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-orange-50 p-5">
              <div className="text-3xl">🛏️</div>
              <h3 className="mt-4 font-bold">Room</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Often cheaper and useful for students or people starting
                out.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="text-3xl">🏢</div>
              <h3 className="mt-4 font-bold">Studio</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                A smaller private home, often with your own kitchen and
                bathroom.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-3xl">🏠</div>
              <h3 className="mt-4 font-bold">Apartment</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                A private home with living space and one or more bedrooms.
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <div className="text-3xl">🏘️</div>
              <h3 className="mt-4 font-bold">Social housing</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Regulated housing for people who meet the applicable
                requirements.
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              🔎 Search online
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Where can you look?
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              Check multiple websites and compare listings.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {housingLinks.map((site) => (
              <a
                key={site.name}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                    {site.icon}
                  </div>

                  <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black">{site.name}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {site.description}
                </p>

                <p className="mt-5 text-sm font-bold text-orange-500">
                  Open website →
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* SOCIAL HOUSING */}
        <section className="mt-8 rounded-[2rem] bg-blue-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              🏘️
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Social housing
              </p>

              <h2 className="mt-1 text-2xl font-black text-blue-950">
                Looking for regulated or lower-cost housing?
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-blue-900/70">
                Social housing works differently from private renting.
                Depending on your region, you may need to register with
                a housing platform or housing corporation. Waiting times
                can be long, so registering early can be important.
              </p>

              <div className="mt-5 rounded-2xl bg-white p-5">
                <h3 className="font-bold">Things to check</h3>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>✓ Which housing organisation covers your area?</li>
                  <li>✓ Do you meet the income requirements?</li>
                  <li>✓ Do you need to register?</li>
                  <li>✓ How does waiting time work?</li>
                  <li>✓ Do you need to renew or update your registration?</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STEP BY STEP */}
        <section className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Your housing journey
          </p>

          <h2 className="mt-2 text-3xl font-black">
            From searching to moving in
          </h2>

          <p className="mt-2 text-slate-500">
            Follow these steps so you know what comes next.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {housingSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{step.icon}</div>

                  <div>
                    <h3 className="text-lg font-black">{step.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BUDGET */}
        <section className="mt-10 rounded-[2rem] bg-orange-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💶</div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                Budget
              </p>

              <h2 className="mt-1 text-3xl font-black text-orange-950">
                Look beyond the advertised rent
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-orange-950/70">
                A property advertised at one monthly price can have
                additional costs. Before agreeing to rent, find out what
                you will actually pay each month.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">🏠 Basic rent</p>
                  <p className="mt-1 text-sm text-slate-500">
                    The main rent for the property.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">🧾 Service costs</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Additional charges for certain services.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">💡 Utilities</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Energy, water and other household costs may be separate.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">🌐 Internet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Often arranged separately.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">💰 Deposit</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Money paid as security under the rental agreement.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="font-bold">🏛️ Local charges</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Some municipal or water-related charges may apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIEWING */}
        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">👀</div>

            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                Before signing
              </p>

              <h2 className="mt-1 text-3xl font-black">
                Viewing checklist
              </h2>

              <p className="mt-2 text-slate-500">
                Take your time. Ask questions before you pay or sign.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {viewingChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
                  >
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTRACT */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              📄 Rental contract
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Understand what you are signing
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              Your rental agreement contains important information about
              your home and your responsibilities.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contractPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl">{item.icon}</div>

                <h3 className="mt-4 text-lg font-black">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BILLS AND UTILITIES */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              🧾 After you move in
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Gas, electricity, water and other bills
            </h2>

            <p className="mt-2 max-w-3xl text-slate-500">
              Some costs may be included in your rent. Others may need to
              be arranged and paid separately.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {utilityCards.map((item) => (
              <div
                key={item.title}
                className={`rounded-[1.5rem] p-6 ${item.color}`}
              >
                <div className="text-3xl">{item.icon}</div>

                <h3 className="mt-4 text-lg font-black">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW TO PAY BILLS */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            💳 Paying bills
          </p>

          <h2 className="mt-2 text-3xl font-black">
            How do you actually pay?
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Dutch companies commonly offer several ways to pay. Always
            check the payment instructions on the actual bill.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {billSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-slate-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{step.icon}</div>

                  <div>
                    <h3 className="font-bold">{step.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-5">
            <p className="font-bold text-blue-950">
              💡 Tip
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-900/70">
              Keep your bills and payment confirmations. If you do not
              understand a bill, check who sent it and what it is for
              before paying.
            </p>
          </div>
        </section>

        {/* MOVE IN */}
        <section className="mt-10 rounded-[2rem] bg-green-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📦</div>

            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                Moving in
              </p>

              <h2 className="mt-1 text-3xl font-black text-green-950">
                Your first days in the new home
              </h2>

              <p className="mt-2 text-green-900/70">
                These are useful things to check after receiving the keys.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {moveInChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white p-4 text-sm font-medium text-slate-700"
                  >
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SCAMS */}
        <section className="mt-10 rounded-[2rem] bg-red-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                Stay safe
              </p>

              <h2 className="mt-1 text-3xl font-black text-red-950">
                Watch out for rental scams
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-red-900/70">
                Unfortunately, rental scams can happen. Slow down if
                something feels suspicious.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {scamWarnings.map((warning) => (
                  <div
                    key={warning}
                    className="rounded-xl bg-white p-4 text-sm font-medium text-red-900"
                  >
                    🚩 {warning}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LEAVING */}
        <section className="mt-10 rounded-[2rem] bg-purple-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📤</div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
                Leaving your home
              </p>

              <h2 className="mt-1 text-3xl font-black text-purple-950">
                Moving somewhere else?
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-purple-900/70">
                Before leaving, check your rental contract for the correct
                notice period. Arrange your final bills, return keys,
                document the condition of the property and keep records
                of important payments and communication.
              </p>

              <div className="mt-5 rounded-2xl bg-white p-5">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Check your notice period.</li>
                  <li>✓ Give notice in the correct way.</li>
                  <li>✓ Arrange final energy and other bills.</li>
                  <li>✓ Take photos when leaving.</li>
                  <li>✓ Return the keys.</li>
                  <li>✓ Check your deposit arrangements.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI */}
        <section className="mt-8 rounded-[1.5rem] border border-purple-100 bg-purple-50 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤖</div>

              <div>
                <h2 className="text-xl font-black text-purple-950">
                  Don't understand something?
                </h2>

                <p className="mt-1 text-sm leading-6 text-purple-900/70">
                  Ask the AI Guide to explain a housing term or help you
                  understand what to do next.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/chat?question=I need help with housing in the Netherlands. Ask me simple questions about my situation and explain what I should do next."
                )
              }
              className="shrink-0 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
            >
              🤖 Ask AI →
            </button>
          </div>
        </section>

        {/* HOME */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-semibold text-slate-500 transition hover:text-orange-500"
          >
            ← Back to Home
          </button>
        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Making life in the Netherlands easier
        </footer>
      </div>
    </main>
  );
}