"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SectionProps = {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function WorkSection({
  icon,
  title,
  description,
  children,
}: SectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black text-slate-900">
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
  color?: "slate" | "blue" | "green" | "yellow" | "purple" | "red";
}) {
  const styles = {
    slate: "bg-slate-50 border-slate-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
    red: "bg-red-50 border-red-200",
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

function WebsiteButton({
  name,
  url,
  color = "blue",
}: {
  name: string;
  url: string;
  color?: "blue" | "purple" | "green";
}) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition ${colors[color]}`}
    >
      {name} →
    </a>
  );
}

export default function WorkPage() {
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
              <p className="font-bold">
                Netherlands Guide
              </p>

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

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-7 text-white shadow-xl sm:p-10">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
            💼
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-blue-100">
            Work & Jobs
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Find work and understand your rights.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
            Learn how to find a job, search online, use employment
            agencies, understand your contract, receive your salary,
            pay taxes and know your rights at work.
          </p>

        </section>

        {/* QUICK START */}

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">

          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
            🚀 Quick start
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Looking for a job?
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">

            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="text-3xl">🔎</div>

              <h3 className="mt-3 font-black text-blue-950">
                Search
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-900/70">
                Search online, through an uitzendbureau or directly
                with companies.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-3xl">📄</div>

              <h3 className="mt-3 font-black text-purple-950">
                Check your contract
              </h3>

              <p className="mt-2 text-sm leading-6 text-purple-900/70">
                Understand your salary, hours, holidays and notice period.
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <div className="text-3xl">💶</div>

              <h3 className="mt-3 font-black text-green-950">
                Get paid
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-900/70">
                Learn about payslips, taxes and salary payments.
              </p>
            </div>

          </div>
        </section>

        {/* SECTIONS */}

        <section className="mt-8 space-y-4">

          {/* FIND A JOB */}

          <WorkSection
            icon="🔎"
            title="How to find a job"
            description="Start here if you are looking for work in the Netherlands."
          >
            <div className="space-y-5">

              <InfoBox title="🌐 Search online">

                <p>
                  You can search for vacancies yourself using Dutch and
                  international job websites.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <WebsiteButton
                    name="Indeed"
                    url="https://nl.indeed.com/"
                  />

                  <WebsiteButton
                    name="LinkedIn Jobs"
                    url="https://www.linkedin.com/jobs/"
                  />

                  <WebsiteButton
                    name="Werk.nl"
                    url="https://www.werk.nl/"
                  />

                  <WebsiteButton
                    name="Nationale Vacaturebank"
                    url="https://www.nationalevacaturebank.nl/"
                  />

                  <WebsiteButton
                    name="Glassdoor"
                    url="https://www.glassdoor.nl/"
                  />

                </div>

              </InfoBox>

              <InfoBox title="🤝 Uitzendbureau — employment agency">

                <p>
                  An <strong>uitzendbureau</strong> is an employment
                  agency. You register with the agency and they can help
                  you find work at companies that are looking for
                  employees.
                </p>

                <p className="mt-3">
                  This can be useful if you are looking for temporary,
                  part-time, full-time or flexible work.
                </p>

                <p className="mt-3">
                  Examples include:
                  <strong> Randstad, Tempo-Team, Adecco, YoungCapital,
                  Olympia and Manpower.</strong>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <WebsiteButton
                    name="Randstad"
                    url="https://www.randstad.nl/"
                    color="purple"
                  />

                  <WebsiteButton
                    name="Tempo-Team"
                    url="https://www.tempo-team.nl/"
                    color="purple"
                  />

                  <WebsiteButton
                    name="YoungCapital"
                    url="https://www.youngcapital.nl/"
                    color="purple"
                  />

                  <WebsiteButton
                    name="Adecco"
                    url="https://www.adecco.nl/"
                    color="purple"
                  />

                  <WebsiteButton
                    name="Olympia"
                    url="https://www.olympia.nl/"
                    color="purple"
                  />

                  <WebsiteButton
                    name="Manpower"
                    url="https://www.manpower.nl/"
                    color="purple"
                  />

                </div>

              </InfoBox>

              <InfoBox title="🏢 Apply directly to companies">

                <p>
                  If you already know which company you want to work
                  for, check its own career page.
                </p>

                <p className="mt-3">
                  Many companies publish vacancies on their own websites
                  before or instead of using job boards.
                </p>

              </InfoBox>

              <InfoBox title="📍 Search around your area">

                <p>
                  You can search for jobs using your city, postcode or
                  nearby cities. Always check the travel time before
                  applying.
                </p>

                <p className="mt-3">
                  Example: search for
                  <strong> "part-time jobs Hilversum"</strong>,
                  <strong> "warehouse jobs Hilversum"</strong> or
                  <strong> "hotel jobs Hilversum"</strong>.
                </p>

              </InfoBox>

              <InfoBox title="🎓 Student jobs">

                <p>
                  Students can look for part-time jobs, weekend work,
                  holiday work and jobs that fit around their studies.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* JOB TYPES */}

          <WorkSection
            icon="🧰"
            title="What kind of jobs can I find?"
            description="Explore common types of work."
          >
            <div className="grid gap-4 md:grid-cols-2">

              <InfoBox title="🏨 Hospitality">
                Hotels, restaurants, cafés and catering.
              </InfoBox>

              <InfoBox title="📦 Warehouse & logistics">
                Order picking, packing, distribution and logistics.
              </InfoBox>

              <InfoBox title="🚴 Delivery">
                Food delivery, parcel delivery and courier work.
              </InfoBox>

              <InfoBox title="🏪 Retail">
                Shops, supermarkets, sales and customer service.
              </InfoBox>

              <InfoBox title="💻 Office work">
                Administration, sales, customer service and account
                management.
              </InfoBox>

              <InfoBox title="🛠️ Technical work">
                Construction, maintenance, installation and technical
                positions.
              </InfoBox>

            </div>
          </WorkSection>

          {/* CV */}

          <WorkSection
            icon="📄"
            title="CV & applying"
            description="Prepare yourself before sending applications."
          >
            <div className="space-y-5">

              <InfoBox title="📄 Your CV">

                <p>
                  Include your contact information, education, work
                  experience, skills and relevant achievements.
                </p>

              </InfoBox>

              <InfoBox title="✉️ Motivation letter">

                <p>
                  Explain why you want the job and why your experience
                  and skills fit the vacancy.
                </p>

              </InfoBox>

              <InfoBox title="🎤 Interview">

                <p>
                  Employers may ask about your experience, motivation,
                  availability and skills.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* CONTRACT */}

          <WorkSection
            icon="📑"
            title="Employment contract"
            description="Understand what you agree to before starting work."
          >
            <div className="space-y-5">

              <InfoBox title="📋 What is a contract?">

                <p>
                  An employment contract sets out important agreements
                  between you and your employer.
                </p>

              </InfoBox>

              <InfoBox title="💶 Salary">

                <p>
                  Check your salary and whether the amount shown is gross
                  or net.
                </p>

              </InfoBox>

              <InfoBox title="🕐 Working hours">

                <p>
                  Check your agreed hours, schedule and applicable
                  working-time rules.
                </p>

              </InfoBox>

              <InfoBox title="📅 Contract duration">

                <p>
                  Your employment can be for a fixed period or an
                  indefinite period depending on the agreement.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ Read before signing">

                <p>
                  Do not sign a contract you do not understand. Ask the
                  employer to explain unclear terms.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* SALARY */}

          <WorkSection
            icon="💶"
            title="Salary & minimum wage"
            description="Understand gross salary, net salary and minimum wage."
          >
            <div className="space-y-5">

              <InfoBox title="💰 Gross salary">
                Gross salary is the amount before applicable taxes and
                deductions.
              </InfoBox>

              <InfoBox title="🏦 Net salary">
                Net salary is the amount you receive after applicable
                deductions.
              </InfoBox>

              <InfoBox title="⚖️ Minimum wage">
                Dutch employees are protected by minimum-wage rules.
                The exact amount depends on the applicable rules,
                including age and working situation.
              </InfoBox>

            </div>
          </WorkSection>

          {/* PAYSLIP */}

          <WorkSection
            icon="🧾"
            title="Payslip"
            description="Understand how your salary is calculated."
          >
            <div className="space-y-5">

              <InfoBox title="🧾 Check your payslip">

                <p>
                  Check your hours, gross salary, deductions and net
                  amount.
                </p>

              </InfoBox>

              <InfoBox title="📂 Keep your payslips">

                <p>
                  Keep payslips and important employment documents in a
                  safe place.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* TAX */}

          <WorkSection
            icon="🧮"
            title="Taxes on your salary"
            description="Understand why tax is deducted from your pay."
          >
            <div className="space-y-5">

              <InfoBox title="🇳🇱 Wage tax">

                <p>
                  Employers normally withhold applicable wage tax and
                  social-security contributions.
                </p>

              </InfoBox>

              <InfoBox title="📄 Tax return">

                <p>
                  Depending on your situation, you may need to file an
                  income-tax return or may be able to receive a refund.
                </p>

              </InfoBox>

              <a
                href="https://www.belastingdienst.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700"
              >
                🇳🇱 Official Tax Administration →
              </a>

            </div>
          </WorkSection>

          {/* HOLIDAY */}

          <WorkSection
            icon="🏖️"
            title="Holiday & holiday allowance"
            description="Understand holiday days and vakantiegeld."
          >
            <div className="space-y-5">

              <InfoBox title="🏖️ Holiday days">

                <p>
                  Employees generally build up holiday entitlement based
                  on how much they work. Your contract or collective
                  labour agreement may provide additional rights.
                </p>

              </InfoBox>

              <InfoBox title="💰 Vakantiegeld">

                <p>
                  Holiday allowance is normally paid in addition to your
                  regular salary, subject to the applicable employment
                  rules.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* SICK */}

          <WorkSection
            icon="🤒"
            title="If you become sick"
            description="What to do when you cannot work because you are ill."
          >
            <div className="space-y-5">

              <InfoBox title="📞 Tell your employer">

                <p>
                  Follow your employer's sickness-reporting procedure as
                  soon as possible.
                </p>

              </InfoBox>

              <InfoBox title="🔒 Medical privacy">

                <p>
                  Employers have rules about what they can ask about your
                  health. You generally do not need to give detailed
                  medical information to your employer.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* STUDENT */}

          <WorkSection
            icon="🎓"
            title="Working while studying"
            description="Important information for students with a job."
          >
            <div className="space-y-5">

              <InfoBox title="🎓 Student job">

                <p>
                  Students can work while studying, but your income and
                  work situation can affect taxes, benefits or other
                  arrangements.
                </p>

              </InfoBox>

              <InfoBox title="📚 Balance work and study">

                <p>
                  Make sure your working hours do not interfere with your
                  education.
                </p>

              </InfoBox>

            </div>
          </WorkSection>

          {/* RIGHTS */}

          <WorkSection
            icon="⚖️"
            title="Your rights at work"
            description="Basic protections every worker should know."
          >
            <div className="grid gap-4 md:grid-cols-2">

              <InfoBox title="💶 Fair pay">
                Employers must follow applicable employment and
                minimum-wage rules.
              </InfoBox>

              <InfoBox title="🕐 Working time">
                Rules can apply to working hours, breaks and rest periods.
              </InfoBox>

              <InfoBox title="🦺 Safe workplace">
                Employers have responsibilities concerning workplace
                health and safety.
              </InfoBox>

              <InfoBox title="🚫 Discrimination">
                Dutch law provides protection against unlawful
                discrimination.
              </InfoBox>

              <InfoBox title="🤝 Respect">
                You should be treated professionally and respectfully at
                work.
              </InfoBox>

              <InfoBox title="📢 Problems at work">
                Keep records and seek appropriate advice if you have a
                serious employment problem.
              </InfoBox>

            </div>
          </WorkSection>

          {/* EMPLOYER NOT PAYING */}

          <WorkSection
            icon="🚨"
            title="My employer is not paying me"
            description="What to do if your salary or hours appear to be wrong."
          >
            <div className="space-y-5">

              <InfoBox title="1️⃣ Check your payslip">
                Compare your payslip with your contract and the hours you
                worked.
              </InfoBox>

              <InfoBox title="2️⃣ Contact your employer">
                Explain what appears to be incorrect and ask them to
                check it.
              </InfoBox>

              <InfoBox title="3️⃣ Keep evidence">
                Keep contracts, payslips, schedules, timesheets and
                relevant messages.
              </InfoBox>

              <InfoBox title="4️⃣ Get help">
                If the problem continues, seek appropriate employment or
                legal advice.
              </InfoBox>

            </div>
          </WorkSection>

          {/* LEAVING */}

          <WorkSection
            icon="📤"
            title="Leaving your job"
            description="Understand resignation and notice periods."
          >
            <div className="space-y-5">

              <InfoBox title="📄 Check your contract">
                Look at the notice-period rules in your contract and
                applicable law.
              </InfoBox>

              <InfoBox title="✉️ Resigning">
                Follow the correct resignation procedure and provide your
                resignation in writing when appropriate.
              </InfoBox>

            </div>
          </WorkSection>

          {/* UNEMPLOYMENT */}

          <WorkSection
            icon="🛟"
            title="If you lose your job"
            description="Understand what to do when employment ends."
          >
            <div className="space-y-5">

              <InfoBox title="📄 Keep your documents">
                Keep your contract, payslips and documents related to the
                end of your employment.
              </InfoBox>

              <InfoBox title="💶 Unemployment benefits">
                Depending on your employment history and circumstances,
                you may qualify for unemployment benefits.
              </InfoBox>

              <InfoBox title="🏢 UWV">
                UWV provides various employee-insurance benefits and
                employment services.
              </InfoBox>

              <a
                href="https://www.uwv.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700"
              >
                🏢 Official UWV →
              </a>

            </div>
          </WorkSection>

        </section>

        {/* AI */}

        <section className="mt-10 rounded-[1.5rem] border border-purple-100 bg-purple-50 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="text-3xl">
                🤖
              </div>

              <div>

                <h2 className="text-xl font-black text-purple-950">
                  Don't understand something?
                </h2>

                <p className="mt-1 text-sm leading-6 text-purple-900/70">
                  Ask the AI Guide about jobs, contracts, salary or
                  your rights.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/chat?question=I need help understanding work and employment in the Netherlands. Ask me simple questions one at a time and explain my job, contract, salary or employment rights in simple language. Do not ask me for passwords or private login information."
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
            general educational information. Employment rights can depend
            on your contract, collective labour agreement, personal
            situation and current Dutch law. Check official sources for
            your specific situation.
          </p>

        </section>

        {/* BACK HOME */}

        <div className="mt-10">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-bold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Home
          </button>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Making work in the Netherlands easier
        </footer>

      </div>
    </main>
  );
}