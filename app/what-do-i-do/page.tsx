"use client";

import Link from "next/link";
import { useState } from "react";

type Section = {
  title: string;
  icon: string;
  description: string;
  color: string;
  situations: string[];
  steps: string[];
};

const sections: Section[] = [
  {
    title: "Emergency — Call 112",
    icon: "🚨",
    description:
      "Use 112 when someone is in immediate danger or urgent help from police, ambulance or fire services is needed.",
    color: "red",
    situations: [
      "Someone is seriously injured",
      "Someone is unconscious",
      "Someone has severe bleeding",
      "Someone has serious breathing problems",
      "A serious road accident",
      "A fire",
      "Someone is threatening people with a weapon",
      "You see someone with a firearm or dangerous weapon",
      "Someone is being seriously attacked",
      "You are in immediate danger",
      "A serious crime is happening right now",
      "Someone is trapped",
      "A dangerous situation requires immediate help",
    ],
    steps: [
      "Move yourself to a safe place if possible.",
      "Call 112.",
      "Clearly explain what happened.",
      "Tell the operator where you are.",
      "Explain whether anyone is injured.",
      "Follow the operator's instructions.",
      "Do not hang up until the operator tells you to.",
    ],
  },

  {
    title: "Police — Non-emergency",
    icon: "👮",
    description:
      "For police matters that are important but do not require immediate emergency assistance.",
    color: "blue",
    situations: [
      "A theft that already happened",
      "A stolen bicycle",
      "A stolen phone",
      "Property damage",
      "Someone damaged your car",
      "You have information about a crime",
      "You want to make a police report",
      "You need police advice",
      "You want to report a non-urgent crime",
      "You want to speak with the police about a non-emergency matter",
    ],
    steps: [
      "If nobody is in immediate danger, do not call 112.",
      "Call the Dutch police non-emergency number: 0900-8844.",
      "Explain what happened.",
      "Give the location and relevant details.",
      "Keep photographs, documents or other evidence if available.",
      "Do not confront or threaten the person involved.",
      "If the situation becomes dangerous, call 112 instead.",
    ],
  },

  {
    title: "Medical Help",
    icon: "🏥",
    description:
      "Choose the appropriate healthcare service based on how serious the problem is.",
    color: "pink",
    situations: [
      "I am feeling sick",
      "I think I broke my ankle",
      "I fell from my bicycle",
      "I have a painful injury",
      "My child is injured",
      "I have a high fever",
      "I need medical advice",
      "I need help outside my huisarts opening hours",
      "I have a wound",
      "I have severe pain",
    ],
    steps: [
      "For a normal medical problem, contact your huisarts.",
      "Explain your symptoms and how serious they are.",
      "If your huisarts is closed and you need urgent medical help, contact the huisartsenpost.",
      "For life-threatening emergencies, call 112.",
      "Do not drive yourself if you are seriously injured or unsafe to drive.",
      "Follow the healthcare professional's instructions.",
    ],
  },

  {
    title: "Fire & Dangerous Situation",
    icon: "🔥",
    description:
      "Fire, smoke, gas smells and dangerous situations can become emergencies quickly.",
    color: "orange",
    situations: [
      "There is a fire",
      "I see smoke coming from a building",
      "I smell gas",
      "There is a serious chemical leak",
      "A dangerous object has been found",
      "There is serious electrical danger",
      "A building appears unsafe",
      "Someone is trapped",
    ],
    steps: [
      "Get yourself and others away from the danger.",
      "Do not enter a burning or unsafe building.",
      "Do not investigate dangerous substances yourself.",
      "Call 112 if there is immediate danger.",
      "Tell the operator exactly where you are.",
      "Warn others nearby only if it is safe to do so.",
      "Follow instructions from emergency services.",
    ],
  },

  {
    title: "🚗 Car Accident",
    icon: "🚗",
    description:
      "What to do if you hit another car, someone hits you, or you damage a parked vehicle.",
    color: "yellow",
    situations: [
      "I had a car accident",
      "Someone hit my car",
      "I hit another car",
      "I damaged a parked car",
      "Someone hit my car and drove away",
      "I fell from my bicycle",
      "Someone hit me while cycling",
      "Someone is injured after an accident",
      "I damaged someone's property",
      "I accidentally scratched another vehicle",
    ],
    steps: [
      "STOP. Do not simply drive away.",
      "Check whether anyone is injured.",
      "If there is serious injury or immediate danger, call 112.",
      "If it is safe, move the vehicles away from danger.",
      "Stay calm and do not argue with the other person.",
      "Exchange names and contact/insurance information.",
      "Take good photographs of both vehicles.",
      "Photograph the damage from several angles.",
      "Photograph the licence plates.",
      "Photograph the road, signs, traffic situation and surrounding area.",
      "Write down what happened while you still remember it.",
      "Look for witnesses and record their contact details if they agree.",
      "Complete the accident/damage information with the other driver when appropriate.",
      "Contact your insurance company.",
      "Do not admit legal responsibility or start an argument about who is guilty.",
      "If the other driver becomes aggressive, move to a safe location.",
      "If the other driver drives away, note the licence plate, vehicle, direction and time.",
    ],
  },

  {
    title: "🅿️ I Hit a Parked Car",
    icon: "🅿️",
    description:
      "Never leave without making a reasonable attempt to deal with the damage.",
    color: "orange",
    situations: [
      "I scratched a parked car",
      "I hit a parked car",
      "I damaged someone's mirror",
      "I damaged a bumper",
      "I caused another vehicle damage while parking",
    ],
    steps: [
      "Stop and check the damage.",
      "Do not simply drive away.",
      "Look for the owner of the vehicle.",
      "If you cannot find the owner, leave your contact information safely and follow the appropriate Dutch procedure.",
      "Take photographs of the damage and both vehicles.",
      "Record the registration number.",
      "Contact your insurance company.",
      "Do not argue about the amount of damage at the scene.",
      "Keep all photographs and information.",
    ],
  },

  {
    title: "🚙 Someone Hit My Car",
    icon: "🚙",
    description:
      "Stay calm, document everything and contact your insurer.",
    color: "blue",
    situations: [
      "Someone hit my car",
      "Someone damaged my parked car",
      "Someone reversed into me",
      "Someone scratched my car",
      "Someone hit my car in a car park",
    ],
    steps: [
      "Check whether anyone is injured.",
      "If there is immediate danger, call 112.",
      "Take photographs before anything is moved when safe.",
      "Photograph the other vehicle and registration plate.",
      "Exchange information.",
      "Do not argue.",
      "Do not threaten the other driver.",
      "Record witnesses if possible.",
      "Contact your insurance company.",
      "Keep all evidence.",
    ],
  },

  {
    title: "🚨 Someone Hit My Car and Drove Away",
    icon: "🚨",
    description:
      "A hit-and-run should be documented carefully.",
    color: "rose",
    situations: [
      "Someone hit my parked car and left",
      "Someone hit me and drove away",
      "Someone damaged my car and disappeared",
    ],
    steps: [
      "Stay safe.",
      "Do not chase the vehicle.",
      "Write down the registration number if you saw it.",
      "Record the make, model and colour of the vehicle.",
      "Write down the direction it travelled.",
      "Take photographs of your damage.",
      "Look for witnesses or nearby cameras.",
      "Contact the police if appropriate.",
      "Contact your insurance company.",
      "Keep all evidence and information.",
    ],
  },

  {
    title: "🔐 Theft & Crime",
    icon: "🔐",
    description:
      "What to do when something is stolen or you witness a crime.",
    color: "purple",
    situations: [
      "My phone was stolen",
      "My wallet was stolen",
      "My bicycle was stolen",
      "My car was broken into",
      "Someone stole something from my house",
      "I saw someone stealing",
      "I saw suspicious activity",
      "I found something that may be stolen",
      "Someone is threatening me",
      "Someone is following me",
    ],
    steps: [
      "If the crime is happening right now and there is immediate danger, call 112.",
      "Otherwise contact the police through the non-emergency route.",
      "Do not confront the suspected person.",
      "Write down what happened.",
      "Take photographs if it is safe.",
      "Keep receipts, serial numbers and other proof.",
      "For a stolen phone, consider blocking the SIM and device.",
      "For stolen bank cards, contact your bank immediately.",
      "Report important stolen documents to the relevant organisation.",
      "Keep the police report/reference information.",
    ],
  },

  {
    title: "🥊 Bullying & Violence",
    icon: "🛑",
    description:
      "Get help when you experience or witness bullying, harassment or violence.",
    color: "rose",
    situations: [
      "Someone is bullying me",
      "I see someone being bullied",
      "Someone hit me",
      "I see someone being attacked",
      "Someone is threatening me",
      "There is a fight",
      "Someone is harassing me",
      "Someone is following me",
      "I feel unsafe",
      "Someone is being intimidated",
    ],
    steps: [
      "Move somewhere safe.",
      "If there is immediate danger, call 112.",
      "Do not start a physical fight yourself.",
      "If safe, get help from a teacher, colleague, security officer or trusted person.",
      "Save messages or other evidence of harassment.",
      "Write down dates and what happened.",
      "For non-emergency police help, contact 0900-8844.",
      "If the danger becomes immediate, call 112.",
    ],
  },

  {
    title: "⚠️ Weapons",
    icon: "⚠️",
    description:
      "Never approach or try to take a weapon from someone.",
    color: "red",
    situations: [
      "I see someone with a weapon",
      "I see someone with a knife",
      "I see someone with a firearm",
      "Someone is threatening people with a weapon",
      "Someone is behaving dangerously",
      "I found a weapon",
    ],
    steps: [
      "Do not approach the person.",
      "Do not touch or take the weapon.",
      "Move away if possible.",
      "Find a safe place.",
      "If there is immediate danger, call 112.",
      "Tell police what you saw and where.",
      "Describe the person's location and direction if you can do so safely.",
      "Do not follow the person.",
    ],
  },

  {
    title: "💊 Drugs / Drug Dealing",
    icon: "💊",
    description:
      "Do not confront people involved in suspected drug activity.",
    color: "purple",
    situations: [
      "I think I saw someone dealing drugs",
      "I saw suspicious drug activity",
      "Someone offered me drugs",
      "I found suspicious substances",
      "There is violence around suspected drug dealing",
    ],
    steps: [
      "Do not confront the people involved.",
      "Do not touch suspicious substances.",
      "Move away if you feel unsafe.",
      "If there is immediate danger or violence, call 112.",
      "For non-emergency information, contact the police through 0900-8844 or the appropriate reporting channel.",
      "Give police the location and information you know.",
      "Do not put yourself at risk to collect evidence.",
    ],
  },

  {
    title: "🐾 Animals",
    icon: "🐾",
    description:
      "What to do when you find an injured, lost or dangerous animal.",
    color: "green",
    situations: [
      "I found an injured animal",
      "I found an injured bird",
      "I found an injured wild animal",
      "I found a lost dog",
      "I found a lost cat",
      "A dog attacked me",
      "A dog attacked someone",
      "I hit an animal with my car",
      "There is an animal on a dangerous road",
      "I found a dead animal",
    ],
    steps: [
      "Keep yourself safe first.",
      "Do not approach an aggressive or frightened animal.",
      "Do not unnecessarily touch an injured wild animal.",
      "If an animal is creating immediate danger on a road, contact the appropriate emergency service.",
      "Contact an appropriate animal rescue or animal ambulance service for an injured animal.",
      "For a lost pet, check whether it has identification.",
      "Do not simply keep someone else's animal as your own.",
      "If you hit an animal with your vehicle, stop safely and follow the appropriate procedure.",
    ],
  },

  {
    title: "🔎 Lost & Found",
    icon: "🔎",
    description:
      "Learn what to do when you lose something or find someone else's property.",
    color: "indigo",
    situations: [
      "I found money",
      "I found a wallet",
      "I found a phone",
      "I found someone's ID",
      "I lost my wallet",
      "I lost my phone",
      "I lost my keys",
      "I lost an important document",
      "I received someone else's mail",
    ],
    steps: [
      "Do not keep someone else's property for yourself.",
      "If you found something in a supermarket or shop, give it to customer service.",
      "If you found something on public transport, follow the transport company's lost-property procedure.",
      "For important documents, follow the relevant government/organisation procedure.",
      "If you lost a bank card, contact your bank immediately.",
      "If you lost your phone, block the SIM if necessary.",
      "Use the Dutch lost-and-found procedure for items found in public places.",
      "Keep proof if you hand something in.",
    ],
  },

  {
    title: "🏪 Shop Problems",
    icon: "🏪",
    description:
      "Problems that happen in supermarkets, shops or other businesses.",
    color: "cyan",
    situations: [
      "I accidentally broke something in a shop",
      "I saw someone stealing in a shop",
      "I found a wallet in a shop",
      "I found a phone in a shop",
      "I lost something in a shop",
      "I have a problem with a shop",
      "Security is stopping me",
      "I do not understand what the shop is asking me to do",
    ],
    steps: [
      "Stay calm and speak respectfully.",
      "If you accidentally damage something, tell the staff rather than simply leaving.",
      "If you see theft, do not physically confront the person.",
      "Tell staff or security if appropriate.",
      "If there is immediate danger, call 112.",
      "If you find a wallet or phone, give it to customer service.",
      "Keep receipts for purchases.",
      "For a complaint, first ask the shop to explain the problem.",
      "If you cannot resolve a consumer problem, look for appropriate consumer assistance.",
    ],
  },

  {
    title: "🏛️ Municipality & Local Problems",
    icon: "🏛️",
    description:
      "For problems involving your gemeente or public spaces.",
    color: "slate",
    situations: [
      "Street light is broken",
      "Road is damaged",
      "There is illegal dumping",
      "There is a problem with waste collection",
      "There is a dangerous public-space problem",
      "I need to report something in my neighbourhood",
      "There is a broken traffic sign",
      "There is a problem with public infrastructure",
    ],
    steps: [
      "Check your municipality's website.",
      "Look for the municipality's 'melding openbare ruimte' service.",
      "Take a photograph if useful.",
      "Give the exact location.",
      "Explain what is wrong.",
      "Keep the report/reference number if provided.",
      "For immediate danger, do not wait for a normal municipality report — use the appropriate emergency service.",
    ],
  },

  {
    title: "💳 Bank / Money Problem",
    icon: "💳",
    description:
      "What to do when something goes wrong with your bank account or payment.",
    color: "green",
    situations: [
      "My bank card was stolen",
      "I lost my bank card",
      "Someone took money from my account",
      "I think someone has my banking details",
      "I made a payment to the wrong person",
      "I think I am being scammed",
      "Someone asks for my PIN",
    ],
    steps: [
      "Contact your bank immediately if your card is lost or stolen.",
      "Block the card if necessary.",
      "Never give your PIN, password or security codes to someone else.",
      "If you suspect fraud, tell your bank immediately.",
      "Keep screenshots, transaction information and messages.",
      "If you are being scammed, report it through the appropriate channels.",
      "If there is immediate physical danger, call 112.",
    ],
  },

  {
    title: "📱 Online Scam / Fraud",
    icon: "📱",
    description:
      "Be careful with fake messages, fake websites and people asking for money.",
    color: "indigo",
    situations: [
      "I received a suspicious SMS",
      "Someone sent me a fake payment link",
      "Someone pretended to be my bank",
      "Someone pretended to be the government",
      "Someone hacked my account",
      "I paid a scammer",
      "Someone is asking for my DigiD",
      "Someone wants my bank PIN",
    ],
    steps: [
      "Do not click suspicious links.",
      "Do not give your DigiD, PIN or security codes to anyone.",
      "Contact your bank immediately if money or banking information is involved.",
      "Change passwords if an account may be compromised.",
      "Keep screenshots and messages.",
      "Report the fraud through the appropriate Dutch reporting channel.",
      "If you lost money, contact your bank as quickly as possible.",
    ],
  },

  {
    title: "📬 Government Letter I Don't Understand",
    icon: "📬",
    description:
      "Don't ignore an official letter just because it is difficult to understand.",
    color: "orange",
    situations: [
      "I received a letter from the gemeente",
      "I received a Belastingdienst letter",
      "I received a DUO letter",
      "I received a UWV letter",
      "I received a letter I cannot understand",
      "I received a payment request",
      "I received a decision letter",
      "I see a deadline but don't understand it",
    ],
    steps: [
      "Check who sent the letter.",
      "Look for the date and deadline.",
      "Do not throw the letter away.",
      "Keep the original letter.",
      "If you do not understand it, ask someone trustworthy for help.",
      "Contact the organisation using the official contact details.",
      "Do not use a phone number from a suspicious message.",
      "If you disagree with a decision, check whether you have a right to object or appeal.",
      "Do not miss the deadline while trying to understand it.",
    ],
  },
];

const colorClasses: Record<
  string,
  {
    border: string;
    bg: string;
    iconBg: string;
    title: string;
  }
> = {
  red: {
    border: "border-red-200",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    title: "text-red-900",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    title: "text-blue-900",
  },
  pink: {
    border: "border-pink-200",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    title: "text-pink-900",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    title: "text-orange-900",
  },
  yellow: {
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    title: "text-yellow-900",
  },
  purple: {
    border: "border-purple-200",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    title: "text-purple-900",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    title: "text-rose-900",
  },
  green: {
    border: "border-green-200",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    title: "text-green-900",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    title: "text-indigo-900",
  },
  cyan: {
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    title: "text-cyan-900",
  },
  slate: {
    border: "border-slate-200",
    bg: "bg-slate-50",
    iconBg: "bg-slate-100",
    title: "text-slate-900",
  },
};

export default function WhatDoIDoPage() {
  const [openSection, setOpenSection] =
    useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVIGATION */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">

          {/* LEFT SIDE — LOGO + BACK TO HOME */}

          <div className="flex items-center gap-3">

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

            <span className="hidden h-6 w-px bg-slate-200 sm:block" />

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              ← Back to Home
            </Link>

          </div>

        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* HERO */}

        <section className="rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-500 p-7 text-white shadow-xl sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-100">
            🚨 Unexpected situation?
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            What Do I Do?
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-red-50 sm:text-lg">
            Something happened and you don't know what to do?
            Choose your situation below and get simple,
            practical steps for the Netherlands.
          </p>

        </section>

        {/* 112 */}

        <section className="mt-6">

          <div className="rounded-[2rem] border-2 border-red-300 bg-red-50 p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <span className="text-4xl">
                    🚨
                  </span>

                  <div>
                    <h2 className="text-xl font-black text-red-900">
                      Immediate danger?
                    </h2>

                    <p className="text-sm font-semibold text-red-700">
                      Call 112
                    </p>
                  </div>

                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-red-800">
                  Serious injury, fire, immediate danger,
                  serious violence or a crime happening now.
                </p>

              </div>

              <a
                href="tel:112"
                className="rounded-xl bg-red-600 px-7 py-4 text-center font-black text-white shadow-md transition hover:bg-red-700"
              >
                📞 Call 112
              </a>

            </div>

          </div>

        </section>

        {/* NON-EMERGENCY POLICE */}

        <section className="mt-4">

          <div className="rounded-[2rem] border-2 border-blue-200 bg-blue-50 p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <span className="text-4xl">
                    👮
                  </span>

                  <div>
                    <h2 className="text-xl font-black text-blue-900">
                      Police — not an emergency?
                    </h2>

                    <p className="text-sm font-semibold text-blue-700">
                      0900-8844
                    </p>
                  </div>

                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-800">
                  For police matters that are important but
                  do not require immediate emergency assistance.
                </p>

              </div>

              <a
                href="tel:09008844"
                className="rounded-xl bg-blue-600 px-7 py-4 text-center font-black text-white shadow-md transition hover:bg-blue-700"
              >
                📞 0900-8844
              </a>

            </div>

          </div>

        </section>

        {/* GUIDE */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Step-by-step guide
            </p>

            <h2 className="mt-2 text-3xl font-black">
              What happened?
            </h2>

            <p className="mt-2 text-slate-500">
              Tap a situation to see examples and what you
              should do next.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {sections.map((section) => {

              const colors =
                colorClasses[section.color];

              const isOpen =
                openSection === section.title;

              return (
                <div
                  key={section.title}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${colors.border}`}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenSection(
                        isOpen
                          ? null
                          : section.title
                      )
                    }
                    className="w-full p-5 text-left"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${colors.iconBg}`}
                      >
                        {section.icon}
                      </div>

                      <span className="text-xl text-slate-300">
                        {isOpen ? "−" : "+"}
                      </span>

                    </div>

                    <h3
                      className={`mt-4 text-lg font-black ${colors.title}`}
                    >
                      {section.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {section.description}
                    </p>

                  </button>

                  {isOpen && (
                    <div
                      className={`border-t p-5 ${colors.bg}`}
                    >

                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                        You might be here because...
                      </p>

                      <div className="mt-3 space-y-2">

                        {section.situations.map(
                          (situation) => (
                            <div
                              key={situation}
                              className="rounded-xl bg-white px-3 py-3 text-sm font-medium text-slate-700 shadow-sm"
                            >
                              {situation}
                            </div>
                          )
                        )}

                      </div>

                      <div className="mt-6">

                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                          What should I do?
                        </p>

                        <div className="mt-3 space-y-2">

                          {section.steps.map(
                            (step, index) => (
                              <div
                                key={`${section.title}-${index}`}
                                className="flex gap-3 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm"
                              >

                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700">
                                  {index + 1}
                                </span>

                                <span>
                                  {step}
                                </span>

                              </div>
                            )
                          )}

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </section>

        {/* CAR ACCIDENT QUICK GUIDE */}

        <section className="mt-10 rounded-[2rem] border-2 border-yellow-200 bg-yellow-50 p-7 sm:p-9">

          <div className="flex items-start gap-4">

            <div className="text-4xl">
              🚗
            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-black text-yellow-900">
                Minor car accident? Remember this.
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xl">🛑</p>
                  <p className="mt-2 font-bold">
                    Don't drive away
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Stop and deal with the damage.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xl">📸</p>
                  <p className="mt-2 font-bold">
                    Take good photos
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Cars, damage, plates and surroundings.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xl">🤝</p>
                  <p className="mt-2 font-bold">
                    Don't argue
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Stay calm and exchange information.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xl">🛡️</p>
                  <p className="mt-2 font-bold">
                    Contact insurance
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Let your insurer handle the claim.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* SAFETY RULE */}

        <section className="mt-6 rounded-[2rem] bg-slate-900 p-7 text-white sm:p-9">

          <div className="flex items-start gap-4">

            <div className="text-3xl">
              💡
            </div>

            <div>

              <h2 className="text-xl font-black">
                Your safety comes first
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Do not put yourself in danger to investigate
                a crime, approach someone with a weapon,
                chase a suspected thief or confront an
                aggressive person. Move to safety and contact
                the appropriate service.
              </p>

            </div>

          </div>

        </section>

        {/* AI */}

        <section className="mt-6">

          <Link
            href="/chat"
            className="group block rounded-[2rem] border border-indigo-200 bg-indigo-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="text-3xl">
                  🤖
                </div>

                <h2 className="mt-3 text-xl font-black text-indigo-900">
                  Still not sure what to do?
                </h2>

                <p className="mt-2 text-sm leading-6 text-indigo-800">
                  Explain your situation to the Netherlands
                  Guide AI and get a simple explanation of
                  what to do next.
                </p>

              </div>

              <span className="text-2xl text-indigo-300 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </Link>

        </section>

        <div className="mt-8 text-center">

          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
          </Link>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Helping you know what to do
        </footer>

      </div>
    </main>
  );
}