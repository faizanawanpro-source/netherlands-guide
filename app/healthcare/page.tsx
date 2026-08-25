"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SectionProps = {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
  emergency?: boolean;
};

function HealthSection({
  icon,
  title,
  description,
  children,
  emergency = false,
}: SectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-3xl border ${
        emergency
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
            emergency ? "bg-red-100" : "bg-slate-100"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className={`text-xl font-black ${
              emergency ? "text-red-950" : "text-slate-900"
            }`}
          >
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
          {open ? "−" : "+"}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200 px-5 pb-6 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoBox({
  title,
  children,
  color = "slate",
}: {
  title: string;
  children: React.ReactNode;
  color?: "slate" | "red" | "blue" | "green" | "yellow" | "purple";
}) {
  const styles = {
    slate: "bg-slate-50 border-slate-200",
    red: "bg-red-50 border-red-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[color]}`}>
      <h3 className="font-black text-slate-900">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </div>
  );
}

export default function HealthcarePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            ← Home
          </button>

          <div className="ml-auto flex items-center gap-3">
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

      {/* MAIN */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        {/* HERO */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 p-7 text-white shadow-xl sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
            🏥
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-100">
            Healthcare in the Netherlands
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Know where to go when you need medical help.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-red-50 sm:text-lg">
            Understand 112, the huisarts, huisartsenpost, hospital,
            health insurance, medicines and zorgtoeslag — all in one
            simple guide.
          </p>
        </section>

        {/* QUICK DIFFERENCE */}
        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-500">
            🚦 First thing to understand
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Which healthcare service do you need?
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-red-50 p-5">
              <div className="text-3xl">🚑</div>
              <h3 className="mt-3 font-black text-red-950">
                112
              </h3>
              <p className="mt-2 text-sm leading-6 text-red-900/70">
                Life-threatening emergency or immediate danger.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="text-3xl">👨‍⚕️</div>
              <h3 className="mt-3 font-black text-blue-950">
                Huisarts
              </h3>
              <p className="mt-2 text-sm leading-6 text-blue-900/70">
                Your first medical contact for most health problems.
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <div className="text-3xl">🌙</div>
              <h3 className="mt-3 font-black text-yellow-950">
                Huisartsenpost
              </h3>
              <p className="mt-2 text-sm leading-6 text-yellow-900/70">
                Urgent medical problems outside normal GP opening
                hours.
              </p>
            </div>
          </div>
        </section>

        {/* SECTIONS */}
        <section className="mt-8 space-y-4">
          {/* EMERGENCY */}
          <HealthSection
            icon="🚨"
            title="Emergency — what should I do?"
            description="Someone is seriously injured, bleeding or unconscious?"
            emergency
          >
            <div className="space-y-5">
              <InfoBox title="🚑 Call 112 when there is a life-threatening emergency." color="red">
                Examples can include someone who is unconscious, has
                severe breathing problems, has life-threatening bleeding,
                or is in immediate danger.
              </InfoBox>

              <InfoBox title="🧠 Serious head injury">
                If someone has suffered a serious blow to the head and
                you are concerned about their condition, seek urgent
                medical help. If they are unconscious, have severe
                symptoms or you believe the situation is life-threatening,
                call 112.
              </InfoBox>

              <InfoBox title="🩸 Heavy bleeding">
                Apply pressure to the wound with clean material if
                possible. For severe or life-threatening bleeding, call
                112 and follow the emergency operator's instructions.
              </InfoBox>

              <InfoBox title="🦴 Possible broken ankle or bone">
                If the injury is not life-threatening, contact your
                huisarts or the huisartsenpost for advice. Avoid putting
                unnecessary weight on the injured area and seek urgent
                help if there are serious symptoms.
              </InfoBox>

              <InfoBox title="👶 A child fell and is injured">
                The right action depends on the child's condition and
                symptoms. If there is a life-threatening emergency, call
                112. For other urgent concerns, contact the huisarts or
                huisartsenpost.
              </InfoBox>

              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="font-black">
                  ⚠️ Important
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Netherlands Guide should not replace emergency medical
                  advice. If you think someone's life is in danger, call
                  112.
                </p>
              </div>
            </div>
          </HealthSection>

          {/* HUISARTS */}
          <HealthSection
            icon="👨‍⚕️"
            title="Huisarts"
            description="Your normal first point of contact for healthcare."
          >
            <div className="space-y-5">
              <InfoBox title="What is a huisarts?">
                A huisarts is your general practitioner. They help with
                common illnesses, injuries, ongoing health problems and
                decide whether you need another healthcare professional.
              </InfoBox>

              <InfoBox title="When should I contact my huisarts?">
                Contact your huisarts when you have a health problem that
                needs medical advice but is not a life-threatening
                emergency.
              </InfoBox>

              <InfoBox title="How do I find one?">
                Search for a huisarts in your area and ask whether they
                are accepting new patients. You can also contact your
                municipality or health insurer for information about
                finding healthcare.
              </InfoBox>

              <InfoBox title="💡 Tip">
                Register with a huisarts before you urgently need one.
                This makes it easier to get help when something happens.
              </InfoBox>
            </div>
          </HealthSection>

          {/* HUISARTSENPOST */}
          <HealthSection
            icon="🌙"
            title="Huisartsenpost"
            description="Urgent GP care outside normal opening hours."
          >
            <div className="space-y-5">
              <InfoBox title="What is it?">
                The huisartsenpost provides urgent GP care when your
                regular huisarts is closed, such as evenings, nights,
                weekends and public holidays.
              </InfoBox>

              <InfoBox title="Do not automatically go there without contacting them.">
                Usually you should call the relevant huisartsenpost
                first. They can assess the situation and tell you what
                you should do.
              </InfoBox>

              <InfoBox title="🚨 Life-threatening?">
                Do not call the huisartsenpost instead of 112 when there
                is an immediate life-threatening emergency.
              </InfoBox>
            </div>
          </HealthSection>

          {/* HOSPITAL */}
          <HealthSection
            icon="🏥"
            title="Hospital & emergency department"
            description="Understand when and how hospital care works."
          >
            <div className="space-y-5">
              <InfoBox title="🏥 Emergency department">
                The emergency department is for serious medical problems
                that need hospital assessment. In many situations, your
                huisarts or another healthcare professional will advise
                you where to go.
              </InfoBox>

              <InfoBox title="📄 Referral">
                For many types of specialist hospital care, you normally
                need a referral from your huisarts or another appropriate
                healthcare provider.
              </InfoBox>

              <InfoBox title="🚑 Emergency">
                In a life-threatening emergency, call 112. Emergency
                services will determine what is needed.
              </InfoBox>

              <InfoBox title="What should I bring?">
                If possible, bring your identification, health-insurance
                information, medication information and relevant medical
                documents.
              </InfoBox>
            </div>
          </HealthSection>

          {/* INSURANCE */}
          <HealthSection
            icon="❤️"
            title="Health insurance"
            description="Understand basic insurance, premiums and eigen risico."
          >
            <div className="space-y-5">
              <InfoBox title="🇳🇱 Basic health insurance">
                People who are required to have Dutch health insurance
                generally need a basic health-insurance policy. The basic
                package is determined by the government.
              </InfoBox>

              <InfoBox title="💶 Monthly premium">
                You normally pay a monthly premium to your health
                insurer. The exact amount depends on the insurer and
                policy.
              </InfoBox>

              <InfoBox title="💳 Eigen risico">
                The eigen risico is the amount you may have to pay
                yourself for certain healthcare costs before the insurer
                covers costs under the applicable rules. Some healthcare,
                such as GP care, is treated differently.
              </InfoBox>

              <InfoBox title="🏥 What does insurance cover?">
                Coverage depends on the type of care and your insurance
                policy. Always check your insurer's information for your
                exact situation.
              </InfoBox>
            </div>
          </HealthSection>

          {/* ZORGTOESLAG */}
          <HealthSection
            icon="💰"
            title="Zorgtoeslag"
            description="Financial help with health-insurance costs for eligible people."
          >
            <div className="space-y-5">
              <InfoBox title="What is zorgtoeslag?">
                Zorgtoeslag is a contribution from the Dutch government
                towards health-insurance costs for people who meet the
                conditions.
              </InfoBox>

              <InfoBox title="Who can get it?">
                Eligibility depends on factors including your age,
                insurance situation, income, assets and whether you have
                a toeslagpartner.
              </InfoBox>

              <InfoBox title="📊 Income matters">
                Your income can affect whether you qualify and how much
                you receive. If your income or situation changes, check
                whether you need to update your information.
              </InfoBox>

              <InfoBox title="📝 How do I apply?">
                Zorgtoeslag is handled through Dienst Toeslagen. You
                normally use your DigiD to access the relevant government
                service.
              </InfoBox>

              <a
                href="https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/zorgtoeslag"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-black text-white hover:bg-green-700"
              >
                💰 Official zorgtoeslag information →
              </a>
            </div>
          </HealthSection>

          {/* MEDICINES */}
          <HealthSection
            icon="💊"
            title="Medicines & pharmacy"
            description="Understand the apotheek, prescriptions and medicines."
          >
            <div className="space-y-5">
              <InfoBox title="💊 Apotheek">
                An apotheek is a pharmacy. It provides prescribed
                medicines and certain other healthcare products.
              </InfoBox>

              <InfoBox title="📄 Prescription">
                Some medicines require a prescription from a healthcare
                professional.
              </InfoBox>

              <InfoBox title="🛒 Over-the-counter medicines">
                Some medicines can be purchased without a prescription.
                Ask the pharmacist if you are unsure which medicine is
                appropriate.
              </InfoBox>

              <InfoBox title="⚠️ Important">
                Do not take someone else's prescription medicine. If you
                are unsure about a medicine, ask a healthcare professional
                or pharmacist.
              </InfoBox>
            </div>
          </HealthSection>

          {/* INJURIES */}
          <HealthSection
            icon="🩹"
            title="Common injuries"
            description="A quick guide for situations such as cuts, burns and suspected fractures."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InfoBox title="🩸 Cuts & bleeding">
                Apply pressure to bleeding with clean material. Seek
                urgent help for severe or uncontrolled bleeding.
              </InfoBox>

              <InfoBox title="🦴 Possible fracture">
                Avoid unnecessary movement or weight on the injured area
                and contact a healthcare professional for advice.
              </InfoBox>

              <InfoBox title="🔥 Burns">
                Cool a burn with lukewarm/cool running water as
                appropriate and seek medical help for serious burns.
              </InfoBox>

              <InfoBox title="🤕 Head injury">
                Monitor symptoms and seek medical advice when concerned.
                For severe symptoms or a life-threatening situation, call
                112.
              </InfoBox>

              <InfoBox title="🌡️ Fever">
                Fever can have many causes. For serious symptoms,
                vulnerable people or concerns about a child, contact a
                healthcare professional.
              </InfoBox>

              <InfoBox title="😮‍💨 Breathing problems">
                Severe or sudden breathing difficulty can be an emergency.
                Call 112 when the situation is life-threatening.
              </InfoBox>
            </div>
          </HealthSection>

          {/* MENTAL HEALTH */}
          <HealthSection
            icon="🧠"
            title="Mental health"
            description="Know where to start if you are struggling emotionally."
          >
            <div className="space-y-5">
              <InfoBox title="👨‍⚕️ Start with your huisarts">
                Your huisarts can discuss your situation and help you
                find appropriate support.
              </InfoBox>

              <InfoBox title="💬 Psychological support">
                Depending on your situation, your healthcare professional
                may refer you to appropriate mental-health care.
              </InfoBox>

              <InfoBox title="🚨 Immediate danger">
                If someone is in immediate danger or there is a
                life-threatening emergency, call 112.
              </InfoBox>
            </div>
          </HealthSection>

          {/* DENTIST */}
          <HealthSection
            icon="🦷"
            title="Dentist"
            description="Understand where dental care fits into the Dutch healthcare system."
          >
            <div className="space-y-5">
              <InfoBox title="🦷 Finding a dentist">
                You can search for a dentist in your area and ask whether
                they are accepting new patients.
              </InfoBox>

              <InfoBox title="💶 Dental costs">
                Dental treatment can be covered differently from regular
                basic health insurance. Check your insurance policy and
                the current rules for your age and treatment.
              </InfoBox>

              <InfoBox title="🚨 Dental emergency">
                For severe dental problems, contact a dentist or the
                appropriate urgent healthcare service. For a
                life-threatening emergency, call 112.
              </InfoBox>
            </div>
          </HealthSection>
        </section>

        {/* SIMPLE DECISION GUIDE */}
        <section className="mt-10 rounded-[2rem] bg-slate-900 p-7 text-white sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            🧭 Quick decision guide
          </p>

          <h2 className="mt-2 text-3xl font-black">
            “Where should I go?”
          </h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-red-500 p-5">
              <p className="font-black">🚑 Life-threatening</p>
              <p className="mt-1 text-sm text-red-50">
                Call <strong>112</strong>.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-500 p-5">
              <p className="font-black">👨‍⚕️ Medical problem during GP hours</p>
              <p className="mt-1 text-sm text-blue-50">
                Contact your <strong>huisarts</strong>.
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-500 p-5 text-yellow-950">
              <p className="font-black">
                🌙 Urgent problem outside GP hours
              </p>
              <p className="mt-1 text-sm">
                Contact the <strong>huisartsenpost</strong>.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 text-slate-900">
              <p className="font-black">
                🏥 Need specialist or hospital care?
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your huisarts can usually help determine the next step.
              </p>
            </div>
          </div>
        </section>

        {/* AI */}
        <section className="mt-10 rounded-[1.5rem] border border-purple-100 bg-purple-50 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤖</div>

              <div>
                <h2 className="text-xl font-black text-purple-950">
                  Don't understand something?
                </h2>

                <p className="mt-1 text-sm leading-6 text-purple-900/70">
                  Ask the AI Guide to explain Dutch healthcare in simple
                  language.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/chat?question=I need help understanding healthcare in the Netherlands. Explain whether I should contact 112, my huisarts, the huisartsenpost or another healthcare service. Ask me simple questions one at a time. Do not diagnose me."
                )
              }
              className="shrink-0 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-700"
            >
              🤖 Ask AI →
            </button>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs leading-5 text-slate-500">
            <strong>Important:</strong> Netherlands Guide provides
            general educational information and does not diagnose,
            prescribe treatment or replace professional medical advice.
            In an emergency or life-threatening situation, call 112.
          </p>
        </section>

        {/* BACK HOME */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-bold text-slate-500 transition hover:text-red-500"
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