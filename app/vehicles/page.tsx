"use client";

import Link from "next/link";
import { useState } from "react";

type Section = {
  title: string;
  icon: string;
  description: string;
  color: string;
  items: string[];
};

const sections: Section[] = [
  {
    title: "🚗 I want my first Dutch driving licence",
    icon: "🪪",
    description:
      "The complete route from having no licence to driving your own car.",
    color: "blue",
    items: [
      "For a normal passenger car you normally need category B.",
      "You can start studying for the car theory exam from age 16.",
      "Find a good driving school and instructor.",
      "Study Dutch traffic rules and road signs.",
      "Take the CBR theory exam.",
      "Complete the required health and administrative steps.",
      "Take driving lessons with an instructor.",
      "Your driving school normally arranges your practical exam.",
      "Pass the CBR practical driving test.",
      "After passing, apply for your Dutch driving licence through your municipality.",
    ],
  },

  {
    title: "🌍 I already have a foreign driving licence",
    icon: "🌍",
    description:
      "Your country matters. A foreign licence does not automatically become a Dutch licence.",
    color: "green",
    items: [
      "EU/EFTA licences have different rules from non-EU/EFTA licences.",
      "A valid non-EU/EFTA licence can generally be used for up to 185 days after becoming resident in the Netherlands.",
      "After that period, you normally need a Dutch driving licence unless an exchange route applies.",
      "Some foreign licences can be exchanged directly.",
      "If your licence cannot be exchanged, you normally need to take the Dutch theory and practical exams.",
      "An international driving permit does not automatically make a foreign licence exchangeable.",
      "Always check the current RDW rules for the country that issued your licence.",
    ],
  },

  {
    title: "🔄 Exchanging a foreign licence",
    icon: "🔄",
    description:
      "If your foreign licence qualifies, you can apply for an exchange.",
    color: "purple",
    items: [
      "Check RDW's current rules for your country.",
      "Make sure you meet the exchange conditions.",
      "You normally need to be registered in the Netherlands.",
      "Apply through your municipality.",
      "Bring your foreign driving licence.",
      "Bring the required identity documents.",
      "You may need a passport photo that meets Dutch requirements.",
      "A Health Declaration may be required depending on your situation.",
      "The municipality sends the application to RDW.",
      "RDW assesses the application.",
      "Your foreign licence is normally retained during the exchange.",
    ],
  },

  {
    title: "📅 The 185-day rule",
    icon: "📅",
    description:
      "Very important for newcomers with a non-EU/EFTA driving licence.",
    color: "orange",
    items: [
      "A non-EU/EFTA resident can generally drive with a valid foreign licence for up to 185 days after becoming resident.",
      "The rule is connected to becoming resident in the Netherlands.",
      "Do not wait until the last week if you are eligible for exchange.",
      "If your licence cannot be exchanged, you normally need to follow the Dutch CBR route.",
      "An international driving permit does not simply restart the 185-day period.",
      "Check your personal situation with RDW if you are unsure.",
    ],
  },

  {
    title: "🌐 International Driving Permit / IDP",
    icon: "🌐",
    description:
      "An international driving permit is different from a Dutch driving licence.",
    color: "indigo",
    items: [
      "An IDP is generally a translation or supporting document for a national driving licence.",
      "You normally use it together with the underlying national licence.",
      "An IDP does not automatically give you a Dutch driving licence.",
      "An IDP does not automatically make a foreign licence exchangeable.",
      "An IDP does not automatically extend the Dutch resident driving period.",
      "Always check the rules for the country that issued your licence.",
    ],
  },

  {
    title: "📚 Car theory exam",
    icon: "📚",
    description:
      "Learn the rules before you start your practical driving exam.",
    color: "blue",
    items: [
      "The car theory exam is taken through the CBR.",
      "You can take the car theory exam from age 16.",
      "The current car theory exam has 50 scored questions plus 2 test questions.",
      "You need at least 44 of the 50 scored questions correct.",
      "The standard exam takes 30 minutes.",
      "The questions test traffic knowledge, traffic insight and hazard recognition.",
      "The exam is completed on a computer.",
      "Take a valid identity document with you.",
      "Bring your reservation number.",
      "Arrive around 15 minutes before the exam.",
    ],
  },

  {
    title: "🇬🇧 Car theory in English",
    icon: "🇬🇧",
    description:
      "You do not have to speak Dutch fluently to take the car theory exam.",
    color: "green",
    items: [
      "The CBR car theory exam is available in English.",
      "You can select the English car theory exam when booking through Mijn CBR.",
      "You can also choose an extra-time option if you qualify.",
      "You do not need an interpreter for the standard English car theory exam.",
      "Some Dutch traffic words can still be useful to learn.",
      "Learn important Dutch traffic words even if you take the exam in English.",
    ],
  },

  {
    title: "🗣️ Theory exam with an interpreter",
    icon: "🗣️",
    description:
      "If English is not enough, an official interpreter can help.",
    color: "purple",
    items: [
      "You can take the car theory exam with an official interpreter.",
      "An interpreter can help if you need another language.",
      "For motor or bromfiets theory, an interpreter can also be arranged when needed.",
      "You cannot simply bring your own family member as the interpreter.",
      "The interpreter must be arranged through an approved interpreting service.",
      "Arrange the interpreter well in advance.",
      "Check the current CBR rules before booking.",
      "The interpreter translates the questions and answer options.",
      "You still choose the answers yourself.",
      "The interpreter costs extra.",
    ],
  },

  {
    title: "🛵 Scooter / bromfiets theory",
    icon: "🛵",
    description:
      "Scooter theory has different language options from car theory.",
    color: "orange",
    items: [
      "A scooter/bromfiets falls under category AM.",
      "The theory exam is administered by CBR.",
      "The standard theory exam is not offered in English in the same way as the car theory exam.",
      "If you need another language, you can arrange an official interpreter.",
      "The interpreter must be booked through an approved interpreting service.",
      "Do not assume that the English car theory option also applies to scooter theory.",
      "Check the CBR language options before booking.",
    ],
  },

  {
    title: "🧠 How to prepare for theory",
    icon: "🧠",
    description:
      "Do not just memorize answers. Learn why the answer is correct.",
    color: "yellow",
    items: [
      "First learn traffic signs.",
      "Learn priority and right-of-way rules.",
      "Learn speed limits.",
      "Learn motorway and highway rules.",
      "Study parking rules.",
      "Study stopping and parking distances.",
      "Learn bicycle and pedestrian rules.",
      "Study alcohol and drug rules.",
      "Learn traffic lights and road markings.",
      "Practise hazard recognition.",
      "Practise traffic-insight questions.",
      "Take many practice exams.",
      "Write down every mistake you make.",
      "Repeat the topics where you make the most mistakes.",
      "Aim to consistently pass practice exams before booking.",
    ],
  },

  {
    title: "💻 Where can I study online?",
    icon: "💻",
    description:
      "Use official information first, then practice with reputable theory websites.",
    color: "cyan",
    items: [
      "Start with the official CBR theory information.",
      "Use Mijn CBR to arrange your official exam.",
      "Use reputable online theory practice platforms.",
      "Theorie.nl can be used for additional practice.",
      "Practise full mock exams under time pressure.",
      "Use videos to understand difficult traffic situations.",
      "Study traffic signs separately until you recognise them immediately.",
      "Do not rely on leaked or unofficial 'real CBR questions'.",
      "Always check CBR for the latest exam rules.",
    ],
  },

  {
    title: "🗓️ How to book the theory exam",
    icon: "🗓️",
    description:
      "Book directly through CBR whenever possible.",
    color: "blue",
    items: [
      "Go to Mijn CBR.",
      "Log in using your DigiD.",
      "Choose the theory exam for your vehicle category.",
      "Select the exam location.",
      "Choose a date and time.",
      "Select English if you are taking the car theory exam in English.",
      "Choose extra time if you qualify and need it.",
      "If you need an interpreter, arrange the interpreter separately.",
      "Pay the CBR exam fee.",
      "Save the confirmation and reservation number.",
      "Check the exam location and time before leaving home.",
    ],
  },

  {
    title: "👨‍🏫 Find a driving instructor",
    icon: "👨‍🏫",
    description:
      "Your instructor is one of the most important choices you make.",
    color: "green",
    items: [
      "Look for driving schools in your area.",
      "Compare lesson prices.",
      "Check reviews.",
      "Ask how long lessons last.",
      "Ask whether the instructor speaks English if needed.",
      "Ask whether the instructor has experience with beginners.",
      "Ask about the waiting time for practical exams.",
      "Ask whether you can have a trial lesson.",
      "Do not choose a school only because it is the cheapest.",
      "A good instructor should explain what you did wrong.",
      "Ask whether the school helps arrange the practical exam.",
    ],
  },

  {
    title: "🚘 Practical driving lessons",
    icon: "🚘",
    description:
      "After theory, you need to become safe and confident on the road.",
    color: "green",
    items: [
      "Learn vehicle controls.",
      "Learn observation and mirror use.",
      "Learn steering and positioning.",
      "Learn changing lanes.",
      "Learn intersections.",
      "Learn priority rules in real traffic.",
      "Practise roundabouts.",
      "Practise cycling paths and bicycle-heavy areas.",
      "Practise parking.",
      "Practise reversing.",
      "Practise motorway driving.",
      "Practise independent navigation.",
      "Practise anticipating other road users.",
      "Practise the manoeuvres required for the practical exam.",
    ],
  },

  {
    title: "📝 Practical exam",
    icon: "📝",
    description:
      "The practical driving test is arranged through your driving school.",
    color: "purple",
    items: [
      "Your driving school normally reserves the practical exam.",
      "The exam is taken with a CBR examiner.",
      "You demonstrate safe vehicle control.",
      "You demonstrate observation and anticipation.",
      "You demonstrate independent driving.",
      "You need to respond safely to traffic situations.",
      "You may have to perform special manoeuvres.",
      "Your instructor can explain what you need to practise.",
      "The CBR decides whether you pass or fail.",
    ],
  },

  {
    title: "🏁 Tussentijdse toets",
    icon: "🏁",
    description:
      "An optional practice assessment before the real practical exam.",
    color: "orange",
    items: [
      "A tussentijdse toets is a practice assessment at CBR.",
      "It helps you see what still needs improvement.",
      "It is not the same as the final practical exam.",
      "You receive feedback on your driving.",
      "Certain manoeuvre exemptions may be possible if you perform them successfully.",
      "Ask your instructor whether a tussentijdse toets is useful for you.",
    ],
  },

  {
    title: "🛡️ Car insurance",
    icon: "🛡️",
    description:
      "A car must have the required motor vehicle insurance.",
    color: "red",
    items: [
      "WA insurance is legally required for a car.",
      "WA means Wettelijke Aansprakelijkheidsverzekering.",
      "WA covers damage you cause to other people or their property.",
      "WA does not normally cover damage to your own car.",
      "WA + limited casco provides additional cover for certain events.",
      "All-risk/casco can provide broader cover.",
      "More extensive insurance can cost more.",
      "Compare insurers and coverage carefully.",
      "Insurance must be arranged when the vehicle is registered in your name.",
      "Do not drive an uninsured car on public roads.",
    ],
  },

  {
    title: "💶 Car tax — MRB",
    icon: "💶",
    description:
      "Motorrijtuigenbelasting is the Dutch motor vehicle tax.",
    color: "yellow",
    items: [
      "MRB is commonly called road tax or wegenbelasting.",
      "If a car is registered in your name, you normally have to pay MRB.",
      "RDW provides vehicle registration information to the Belastingdienst.",
      "You normally do not file a separate MRB declaration.",
      "The amount depends on factors including vehicle type, weight, fuel and province.",
      "Use the Belastingdienst MRB calculator to estimate the amount.",
      "You can pay by automatic debit each month.",
      "You can also pay for a three-month period.",
      "You are responsible for paying on time.",
    ],
  },

  {
    title: "🔧 APK — vehicle inspection",
    icon: "🔧",
    description:
      "Most passenger cars need a valid APK.",
    color: "orange",
    items: [
      "APK means Algemene Periodieke Keuring.",
      "Most passenger cars are subject to APK requirements.",
      "Driving without a required valid APK is not allowed.",
      "The APK checks important safety and environmental aspects.",
      "Examples include brakes, suspension and lighting.",
      "The kilometre reading is also registered during APK.",
      "Book the inspection at an RDW-recognised APK company.",
      "Check the APK expiry date using RDW.",
      "Do not wait until after the expiry date.",
      "If your car fails APK, the problems need to be fixed.",
    ],
  },

  {
    title: "🪪 Kentekenbewijs",
    icon: "🪪",
    description:
      "The kentekenbewijs contains important vehicle registration information.",
    color: "blue",
    items: [
      "Modern Dutch vehicles normally use a kentekencard.",
      "The kentekenbewijs contains important vehicle information.",
      "The tenaamstellingscode is used for certain ownership transactions.",
      "Keep your registration documents safe.",
      "RDW provides digital vehicle information through its services.",
      "The digital information does not replace every physical document requirement.",
      "Know where your kentekenbewijs is before driving or selling your car.",
    ],
  },

  {
    title: "🪪 Always carry your driving licence",
    icon: "🪪",
    description:
      "Your driving licence and vehicle documents are different things.",
    color: "purple",
    items: [
      "Your driving licence proves that you are authorised to drive.",
      "Your kentekenbewijs relates to the vehicle.",
      "Do not confuse your driving licence with your kentekencard.",
      "Carry your valid driving licence when driving.",
      "Make sure your licence covers the vehicle category you are driving.",
      "Do not drive if your licence is expired or invalid.",
    ],
  },

  {
    title: "⛽ Other costs of owning a car",
    icon: "⛽",
    description:
      "The purchase price is only one part of the cost.",
    color: "yellow",
    items: [
      "Fuel or electricity.",
      "Car insurance.",
      "MRB road tax.",
      "APK when required.",
      "Maintenance.",
      "Tyres.",
      "Oil and fluids where applicable.",
      "Repairs.",
      "Parking.",
      "Car wash and cleaning.",
      "Possible tolls or road charges.",
      "Possible parking fines or traffic fines.",
      "Depreciation of the vehicle.",
    ],
  },

  {
    title: "🚨 What if I have a car accident?",
    icon: "🚨",
    description:
      "Know what to do immediately after a collision.",
    color: "red",
    items: [
      "Stop safely.",
      "Check whether anyone is injured.",
      "If there is immediate danger or serious injury, call 112.",
      "Do not leave the scene when you are required to remain there.",
      "Exchange relevant information with the other driver.",
      "Take photographs of the vehicles and damage when safe.",
      "Record the location and circumstances.",
      "Contact your insurer according to your policy.",
      "If the other driver leaves, note the registration number if possible.",
      "For non-emergency police assistance, use 0900-8844.",
      "Never put yourself in danger to collect information.",
    ],
  },

  {
    title: "🔍 Check a used car before buying",
    icon: "🔍",
    description:
      "Do not buy a used car without checking its history and condition.",
    color: "cyan",
    items: [
      "Check the registration number.",
      "Use RDW vehicle information services.",
      "Check APK history.",
      "Check mileage information.",
      "Ask for maintenance records.",
      "Take the car for a test drive.",
      "Consider an independent inspection.",
      "Compare the asking price with similar vehicles.",
      "Check insurance and tax costs before buying.",
      "Make sure the seller is authorised to sell the vehicle.",
    ],
  },

  {
    title: "📱 Useful official websites",
    icon: "🌐",
    description:
      "Use official websites for important vehicle and licence information.",
    color: "indigo",
    items: [
      "RDW — driving licences and vehicle registration.",
      "CBR — theory and practical driving exams.",
      "Belastingdienst — motor vehicle tax.",
      "Mijn CBR — book and manage your CBR exams.",
      "RDW Kentekencheck — check vehicle information and APK dates.",
      "DigiD — login for many government services.",
    ],
  },
];

const colorStyles: Record<
  string,
  {
    border: string;
    bg: string;
    iconBg: string;
    title: string;
  }
> = {
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    title: "text-blue-900",
  },
  green: {
    border: "border-green-200",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    title: "text-green-900",
  },
  purple: {
    border: "border-purple-200",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    title: "text-purple-900",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    title: "text-orange-900",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    title: "text-indigo-900",
  },
  yellow: {
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    title: "text-yellow-900",
  },
  red: {
    border: "border-red-200",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    title: "text-red-900",
  },
  cyan: {
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    title: "text-cyan-900",
  },
};

export default function VehiclesPage() {
  const [open, setOpen] = useState<string | null>(null);

  const openSection = (title: string) => {
    setOpen((current) =>
      current === title ? null : title
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:px-6">

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div>
              <p className="font-bold">
                Netherlands Guide
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                Your guide to life in NL
              </p>
            </div>
          </Link>

        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* HERO */}

        <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-7 text-white shadow-xl sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
            🚗 Cars · Driving · Vehicles
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            Driving & Vehicle Guide
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
            Everything you need to know about getting a
            driving licence, foreign licences, theory exams,
            driving lessons, cars, insurance, APK, tax,
            kenteken and owning a vehicle in the Netherlands.
          </p>

        </section>

        {/* QUICK CHOICES */}

        <section className="mt-6 rounded-[2rem] border border-blue-200 bg-blue-50 p-6">

          <h2 className="text-xl font-black text-blue-900">
            What are you looking for?
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <button
              onClick={() =>
                openSection(
                  "🚗 I want my first Dutch driving licence"
                )
              }
              className="rounded-2xl bg-white p-5 text-left font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              🪪
              <span className="mt-2 block">
                Get my first licence
              </span>
            </button>

            <button
              onClick={() =>
                openSection(
                  "🌍 I already have a foreign driving licence"
                )
              }
              className="rounded-2xl bg-white p-5 text-left font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              🌍
              <span className="mt-2 block">
                Foreign licence
              </span>
            </button>

            <button
              onClick={() =>
                openSection("📚 Car theory exam")
              }
              className="rounded-2xl bg-white p-5 text-left font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              📚
              <span className="mt-2 block">
                Theory exam
              </span>
            </button>

            <button
              onClick={() =>
                openSection("🛡️ Car insurance")
              }
              className="rounded-2xl bg-white p-5 text-left font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              🛡️
              <span className="mt-2 block">
                Own a car
              </span>
            </button>

          </div>

        </section>

        {/* GUIDE */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Complete guide
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Everything about driving
            </h2>

            <p className="mt-2 text-slate-500">
              Tap any section to open the full explanation.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {sections.map((section) => {

              const style =
                colorStyles[section.color];

              const isOpen =
                open === section.title;

              return (
                <div
                  key={section.title}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${style.border}`}
                >

                  <button
                    type="button"
                    onClick={() =>
                      openSection(section.title)
                    }
                    className="w-full p-5 text-left"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${style.iconBg}`}
                      >
                        {section.icon}
                      </div>

                      <span className="text-2xl text-slate-300">
                        {isOpen ? "−" : "+"}
                      </span>

                    </div>

                    <h3
                      className={`mt-4 text-lg font-black ${style.title}`}
                    >
                      {section.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {section.description}
                    </p>

                  </button>

                  {isOpen && (
                    <div
                      className={`border-t p-5 ${style.bg}`}
                    >

                      <div className="space-y-2">

                        {section.items.map(
                          (item, index) => (
                            <div
                              key={`${section.title}-${index}`}
                              className="flex gap-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm"
                            >

                              <span className="font-black text-orange-500">
                                {index + 1}.
                              </span>

                              <span>
                                {item}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </section>

        {/* IMPORTANT COST SUMMARY */}

        <section className="mt-10 rounded-[2rem] bg-slate-900 p-7 text-white sm:p-9">

          <h2 className="text-2xl font-black">
            💰 Remember: owning a car costs more than buying it
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl">🛡️</p>
              <p className="mt-2 font-bold">
                Insurance
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Mandatory WA cover.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl">💶</p>
              <p className="mt-2 font-bold">
                MRB
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Motor vehicle tax.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl">🔧</p>
              <p className="mt-2 font-bold">
                APK
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Required for most cars.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl">⛽</p>
              <p className="mt-2 font-bold">
                Fuel / charging
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Your everyday driving cost.
              </p>
            </div>

          </div>

        </section>

        {/* OFFICIAL LINKS */}

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7">

          <h2 className="text-xl font-black">
            🔗 Official websites
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use official websites when checking current rules,
            prices, exams and vehicle information.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <a
              href="https://www.cbr.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              CBR
            </a>

            <a
              href="https://www.rdw.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              RDW
            </a>

            <a
              href="https://www.belastingdienst.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Belastingdienst
            </a>

            <a
              href="https://www.theorie.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              Theorie.nl
            </a>

          </div>

        </section>

        {/* AI */}

        <section className="mt-6">

          <Link
            href="/chat"
            className="group block rounded-[2rem] border border-indigo-200 bg-indigo-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex items-center justify-between gap-5">

              <div>

                <div className="text-3xl">
                  🤖
                </div>

                <h2 className="mt-3 text-xl font-black text-indigo-900">
                  Don't know which rule applies?
                </h2>

                <p className="mt-2 text-sm leading-6 text-indigo-800">
                  Tell the Netherlands Guide AI your country,
                  licence type, vehicle or situation and get a
                  simple explanation.
                </p>

              </div>

              <span className="text-2xl text-indigo-300 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </Link>

        </section>

        {/* HOME */}

        <div className="mt-8 text-center">

          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
          </Link>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Making driving in the Netherlands easier
        </footer>

      </div>
    </main>
  );
}