"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SectionProps = {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function StudySection({
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
  color?: "slate" | "blue" | "green" | "yellow" | "purple" | "orange";
}) {
  const colors = {
    slate: "border-slate-200 bg-slate-50",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    yellow: "border-yellow-200 bg-yellow-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <h3 className="font-black text-slate-900">{title}</h3>

      <div className="mt-2 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </div>
  );
}

function LinkButton({
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
      className={`inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white transition ${colors[color]}`}
    >
      {name} →
    </a>
  );
}

export default function StudyPage() {
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

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-7 text-white shadow-xl sm:p-10">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
            📚
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-purple-100">
            Study & Education
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Understand the Dutch education system.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-purple-50 sm:text-lg">
            From ISK and learning Dutch to VMBO, HAVO, VWO, MBO, HBO,
            university, DUO, student travel and everything in between.
          </p>

        </section>

        {/* QUICK MAP */}

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">

          <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">
            🗺️ The big picture
          </p>

          <h2 className="mt-2 text-2xl font-black">
            One simple map of Dutch education
          </h2>

          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-[760px] items-center gap-3">

              <div className="rounded-2xl bg-yellow-50 p-4 text-center">
                <div className="text-2xl">🗣️</div>
                <p className="mt-2 text-sm font-black">
                  ISK / language
                </p>
              </div>

              <div className="text-xl font-black text-slate-300">
                →
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <div className="text-2xl">🏫</div>
                <p className="mt-2 text-sm font-black">
                  VMBO
                </p>
              </div>

              <div className="text-xl font-black text-slate-300">
                →
              </div>

              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-2xl">🛠️</div>
                <p className="mt-2 text-sm font-black">
                  MBO
                </p>
              </div>

              <div className="text-xl font-black text-slate-300">
                →
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 text-center">
                <div className="text-2xl">🎓</div>
                <p className="mt-2 text-sm font-black">
                  HBO
                </p>
              </div>

              <div className="text-xl font-black text-slate-300">
                →
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                <div className="text-2xl">🏛️</div>
                <p className="mt-2 text-sm font-black">
                  University
                </p>
              </div>

            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            There is not just one route. Your previous education,
            age, Dutch level, diploma and goals all affect which route
            is suitable.
          </p>

        </section>

        {/* SECTIONS */}

        <section className="mt-8 space-y-4">

          {/* ISK */}

          <StudySection
            icon="🗣️"
            title="ISK — International School for newcomers"
            description="A common starting point for young newcomers who need Dutch before regular education."
          >
            <div className="space-y-5">

              <InfoBox
                title="🇳🇱 What is ISK?"
                color="yellow"
              >
                <p>
                  ISK stands for <strong>Internationale Schakelklas</strong>.
                  It is education for newcomers who are not yet ready
                  to follow regular Dutch secondary education because
                  their Dutch language skills are still developing.
                </p>

                <p className="mt-3">
                  The main focus is often Dutch, but students can also
                  work on subjects and skills needed for their next
                  education level.
                </p>
              </InfoBox>

              <InfoBox title="👦 Who is ISK usually for?">

                <p>
                  ISK is mainly associated with young newcomers in
                  secondary education. Many ISK programmes work with
                  students around ages 12–18, although arrangements can
                  differ by school and municipality.
                </p>

              </InfoBox>

              <InfoBox title="🎯 What happens after ISK?">

                <p>
                  The goal is normally to move into a suitable next
                  education route, such as VMBO, HAVO, VWO or MBO,
                  depending on the student's age, Dutch level and
                  educational level.
                </p>

              </InfoBox>

              <InfoBox title="📚 You may need more than Dutch">

                <p>
                  Learning Dutch is important, but schools may also look
                  at mathematics, previous education and your ability to
                  follow the next programme.
                </p>

              </InfoBox>

              <LinkButton
                name="LOWAN — newcomer education"
                url="https://www.lowan.nl/"
                color="green"
              />

            </div>
          </StudySection>

          {/* LANGUAGE */}

          <StudySection
            icon="🗨️"
            title="Learning Dutch outside ISK"
            description="Other ways newcomers can improve their Dutch."
          >
            <div className="space-y-5">

              <InfoBox title="📖 Language schools">

                <p>
                  Adults and older newcomers may learn Dutch through
                  language schools, municipal programmes, integration
                  routes or other recognised education providers.
                </p>

              </InfoBox>

              <InfoBox title="🏛️ Municipality">

                <p>
                  Your municipality can help explain which language or
                  integration route applies to your situation.
                </p>

              </InfoBox>

              <InfoBox title="📝 NT2">

                <p>
                  NT2 means Nederlands als tweede taal. It is used for
                  Dutch as a second language and can be important for
                  education, work and further study.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ Don't compare yourself with others">

                <p>
                  Two newcomers of the same age may enter completely
                  different programmes because their previous education,
                  Dutch level and residence situation are different.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* COMPULSORY */}

          <StudySection
            icon="⚠️"
            title="School is compulsory for young people"
            description="Understand leerplicht and the basic qualification."
          >
            <div className="space-y-5">

              <InfoBox
                title="🏫 Leerplicht"
                color="orange"
              >
                <p>
                  Young people in the Netherlands are generally required
                  to attend education until they are 18, or until they
                  obtain a <strong>basic qualification</strong>.
                </p>

                <p className="mt-3">
                  A basic qualification is at least:
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>MBO level 2</li>
                  <li>HAVO</li>
                  <li>VWO</li>
                </ul>
              </InfoBox>

              <InfoBox title="📌 Why this matters">

                <p>
                  If you are under the compulsory-education rules,
                  simply stopping school is not normally an option.
                  Speak with your school, municipality or the relevant
                  attendance officer if you are struggling.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* DUO */}

          <StudySection
            icon="💶"
            title="DUO & student finance"
            description="What DUO is, what student finance can contain and who may qualify."
          >
            <div className="space-y-5">

              <InfoBox
                title="🏛️ What is DUO?"
                color="blue"
              >
                <p>
                  DUO is the Dutch Education Executive Agency. It handles
                  things such as student finance, student travel products,
                  education administration and other education-related
                  services.
                </p>
              </InfoBox>

              <InfoBox
                title="⚠️ Important for refugees and newcomers"
                color="orange"
              >
                <p>
                  Being a refugee or being under 30 does
                  <strong> not automatically mean</strong> you receive
                  student finance.
                </p>

                <p className="mt-3">
                  DUO checks your <strong>age, programme and nationality
                  or residence status</strong>.
                </p>

                <p className="mt-3">
                  Some residence permit holders can qualify, while
                  others may need to meet additional conditions.
                </p>

                <p className="mt-3">
                  Always use the DUO eligibility checker for your exact
                  situation.
                </p>
              </InfoBox>

              <InfoBox title="🎂 Age">

                <p>
                  For MBO, you generally need to be at least 18 for the
                  basic grant or interest-bearing loan.
                </p>

                <p className="mt-3">
                  You can still receive a student travel product before
                  turning 18 if you meet the relevant conditions.
                </p>

                <p className="mt-3">
                  For HBO and university there is no minimum age for
                  student finance, but student finance generally must
                  start before your 30th birthday.
                </p>
              </InfoBox>

              <InfoBox title="💰 What can student finance contain?">

                <ul className="list-disc space-y-2 pl-5">
                  <li>Basic grant</li>
                  <li>Supplementary grant</li>
                  <li>Student travel product</li>
                  <li>Interest-bearing loan</li>
                  <li>Tuition-fee loan for eligible HBO/university students</li>
                </ul>

              </InfoBox>

              <InfoBox title="🎁 Grant vs loan">

                <p>
                  A grant and a loan are not the same thing.
                </p>

                <p className="mt-3">
                  A loan creates a debt that normally has to be repaid.
                  Some grants or travel benefits can become gifts if you
                  meet the required conditions, such as completing your
                  programme within the applicable period.
                </p>

              </InfoBox>

              <LinkButton
                name="Check DUO eligibility"
                url="https://www.duo.nl/particulier/student-finance/eligibility.jsp"
                color="blue"
              />

            </div>
          </StudySection>

          {/* STUDENT OV */}

          <StudySection
            icon="🚆"
            title="Student OV / student travel product"
            description="Free or discounted travel for eligible students."
          >
            <div className="space-y-5">

              <InfoBox
                title="🚆 What is it?"
                color="green"
              >
                <p>
                  The student travel product can allow eligible students
                  to travel free or at a reduced rate on train, tram, bus
                  and metro in the Netherlands.
                </p>
              </InfoBox>

              <InfoBox title="📅 Week or weekend">

                <p>
                  There are different travel subscriptions, including
                  weekday and weekend options.
                </p>

              </InfoBox>

              <InfoBox title="🪪 OV-chipkaart">

                <p>
                  You normally need a personal OV-chipkaart and must
                  arrange and collect the student travel product before
                  using it.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ BBL">

                <p>
                  An MBO BBL programme is a work-based learning route and
                  is not eligible for the student travel product.
                </p>

              </InfoBox>

              <LinkButton
                name="DUO student travel information"
                url="https://duo.nl/particulier/student-travel-product/"
                color="green"
              />

            </div>
          </StudySection>

          {/* MBO */}

          <StudySection
            icon="🛠️"
            title="MBO — vocational education"
            description="Practical education for a specific profession."
          >
            <div className="space-y-5">

              <InfoBox
                title="🛠️ What is MBO?"
                color="blue"
              >
                <p>
                  MBO stands for <strong>middelbaar beroepsonderwijs</strong>.
                  It prepares students for a profession and can also
                  provide a route towards HBO.
                </p>
              </InfoBox>

              <div className="grid gap-4 md:grid-cols-2">

                <InfoBox title="1️⃣ MBO level 1">
                  Assistant training. This is the entry level and can
                  prepare you for simple vocational work or progression
                  to a higher MBO level.
                </InfoBox>

                <InfoBox title="2️⃣ MBO level 2">
                  Basic vocational training. Completing level 2 gives a
                  basic qualification.
                </InfoBox>

                <InfoBox title="3️⃣ MBO level 3">
                  Professional training for more advanced vocational
                  occupations.
                </InfoBox>

                <InfoBox title="4️⃣ MBO level 4">
                  Middle-management or specialist training. Level 4 can
                  provide access to HBO.
                </InfoBox>

              </div>

              <InfoBox title="🎓 Level 4 → HBO">

                <p>
                  An MBO level 4 diploma can provide a route into higher
                  professional education (HBO), subject to the admission
                  requirements of the programme.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* BOL BBL */}

          <StudySection
            icon="🏢"
            title="BOL vs BBL"
            description="Two different ways of completing an MBO programme."
          >
            <div className="grid gap-4 md:grid-cols-2">

              <InfoBox
                title="🏫 BOL — school-based"
                color="blue"
              >
                <p>
                  BOL means the school-based learning route.
                </p>

                <p className="mt-3">
                  You spend most of your time learning at school and
                  complete practical training as part of the programme.
                </p>

                <p className="mt-3">
                  BOL students generally have a stage during their
                  programme.
                </p>
              </InfoBox>

              <InfoBox
                title="🛠️ BBL — work-based"
                color="orange"
              >
                <p>
                  BBL means the work-based learning route.
                </p>

                <p className="mt-3">
                  You spend most of your time working and combine this
                  with school or training.
                </p>

                <p className="mt-3">
                  BBL is therefore very different from a normal
                  school-based BOL route.
                </p>
              </InfoBox>

            </div>
          </StudySection>

          {/* STAGE */}

          <StudySection
            icon="👔"
            title="Stage / internship"
            description="Practical work experience is an important part of many MBO programmes."
          >
            <div className="space-y-5">

              <InfoBox title="🏢 What is a stage?">

                <p>
                  A stage is a period of practical learning in a
                  workplace as part of your education.
                </p>

              </InfoBox>

              <InfoBox title="🎯 Why do you need it?">

                <p>
                  It allows you to practise what you learn at school in a
                  real workplace and develop professional skills.
                </p>

              </InfoBox>

              <InfoBox title="📋 Stage agreements">

                <p>
                  Your school and workplace normally make arrangements
                  about learning outcomes, supervision, working hours and
                  other conditions.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* VMBO */}

          <StudySection
            icon="🏫"
            title="VMBO"
            description="Pre-vocational secondary education."
          >
            <div className="space-y-5">

              <InfoBox title="📚 What is VMBO?">

                <p>
                  VMBO is <strong>voorbereidend middelbaar
                  beroepsonderwijs</strong>.
                </p>

                <p className="mt-3">
                  It prepares students mainly for MBO and has different
                  learning pathways.
                </p>

              </InfoBox>

              <InfoBox title="➡️ VMBO → MBO">

                <p>
                  Depending on the VMBO pathway and diploma, students can
                  progress to different MBO levels.
                </p>

              </InfoBox>

              <InfoBox title="🔄 VMBO → HAVO">

                <p>
                  Certain VMBO diplomas can provide a route to HAVO,
                  subject to the applicable admission requirements.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* HAVO */}

          <StudySection
            icon="📘"
            title="HAVO"
            description="Five-year senior general secondary education, mainly preparing for HBO."
          >
            <div className="space-y-5">

              <InfoBox title="📘 What is HAVO?">

                <p>
                  HAVO stands for
                  <strong> hoger algemeen voortgezet onderwijs</strong>.
                </p>

                <p className="mt-3">
                  HAVO takes five years and mainly prepares students for
                  HBO.
                </p>

              </InfoBox>

              <InfoBox title="🎓 HAVO → HBO">

                <p>
                  A HAVO diploma can provide access to HBO programmes,
                  subject to programme-specific requirements.
                </p>

              </InfoBox>

              <InfoBox title="🔄 HAVO → VWO">

                <p>
                  In some situations students can progress from HAVO to
                  VWO, depending on school rules and the applicable
                  requirements.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* VWO */}

          <StudySection
            icon="🧠"
            title="VWO"
            description="Six-year pre-university education, mainly preparing for university."
          >
            <div className="space-y-5">

              <InfoBox title="🧠 What is VWO?">

                <p>
                  VWO stands for
                  <strong> voorbereidend wetenschappelijk onderwijs</strong>.
                </p>

                <p className="mt-3">
                  VWO takes six years and prepares students mainly for
                  university.
                </p>

              </InfoBox>

              <InfoBox title="🏛️ VWO → University">

                <p>
                  A VWO diploma can provide access to university
                  programmes, subject to programme-specific admission
                  requirements.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* GRADES */}

          <StudySection
            icon="📊"
            title="How cijfers and passing actually work"
            description="Why one good final exam does not automatically mean you pass the year."
          >
            <div className="space-y-5">

              <InfoBox
                title="📊 Your grades matter throughout the year"
                color="orange"
              >
                <p>
                  One of the biggest things newcomers need to understand
                  is that school is not simply:
                  <strong> "study badly all year and save everything for
                  one final exam."</strong>
                </p>

                <p className="mt-3">
                  Schools use different assessments during the year.
                  Your school determines how these results are used for
                  progression and examinations.
                </p>
              </InfoBox>

              <InfoBox title="📝 Tests">

                <p>
                  You may have tests, assignments, presentations,
                  practical work and other assessments during the school
                  year.
                </p>

              </InfoBox>

              <InfoBox title="📅 Periods / semesters">

                <p>
                  Many schools organise their school year into periods,
                  terms or semesters. Your results during these periods
                  can matter for whether you progress to the next year.
                </p>

              </InfoBox>

              <InfoBox title="🎓 School exams & final exams">

                <p>
                  In secondary education, students can have school-based
                  examination components as well as national written
                  examinations, depending on the programme.
                </p>

              </InfoBox>

              <InfoBox
                title="⚠️ Always check your school's rules"
                color="yellow"
              >
                <p>
                  The exact rules for passing a year are set within the
                  applicable education and school framework. Always read
                  your school's examination regulations, transition rules
                  and student guide.
                </p>
              </InfoBox>

            </div>
          </StudySection>

          {/* EDUCATION ROUTES */}

          <StudySection
            icon="🔄"
            title="How can I move from one level to another?"
            description="The Dutch system has routes between different education levels."
          >
            <div className="space-y-5">

              <InfoBox title="🛠️ MBO route">

                <p>
                  MBO level 1 → MBO level 2 → MBO level 3 → MBO level 4
                </p>

                <p className="mt-3">
                  Not everyone has to follow every level. Your previous
                  diploma and the admission rules determine where you can
                  enter.
                </p>

              </InfoBox>

              <InfoBox title="🏫 Secondary route">

                <p>
                  VMBO can lead to MBO and, depending on the pathway and
                  requirements, can also provide a route towards HAVO.
                </p>

              </InfoBox>

              <InfoBox title="📘 HAVO route">

                <p>
                  HAVO generally leads towards HBO and can in some
                  situations provide a route towards VWO.
                </p>

              </InfoBox>

              <InfoBox title="🧠 VWO route">

                <p>
                  VWO mainly prepares students for university.
                </p>

              </InfoBox>

              <InfoBox title="🎓 MBO 4 → HBO">

                <p>
                  A completed MBO level 4 qualification can provide
                  access to HBO, subject to the programme requirements.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* VAVO */}

          <StudySection
            icon="📖"
            title="VAVO"
            description="An alternative route for adults who want to obtain VMBO, HAVO or VWO qualifications."
          >
            <div className="space-y-5">

              <InfoBox title="📖 What is VAVO?">

                <p>
                  VAVO means
                  <strong> voortgezet algemeen volwassenenonderwijs</strong>.
                </p>

                <p className="mt-3">
                  It can provide an adult route to obtain or complete
                  VMBO, HAVO or VWO qualifications.
                </p>

              </InfoBox>

              <InfoBox title="📝 State examinations">

                <p>
                  State examinations are also available for VMBO, HAVO
                  and VWO in certain situations.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* HBO */}

          <StudySection
            icon="🎓"
            title="HBO — higher professional education"
            description="Higher education focused strongly on professional practice."
          >
            <div className="space-y-5">

              <InfoBox title="🎓 What is HBO?">

                <p>
                  HBO stands for
                  <strong> hoger beroepsonderwijs</strong>.
                </p>

                <p className="mt-3">
                  HBO is provided by universities of applied sciences
                  (hogescholen) and focuses strongly on professional
                  knowledge and practical application.
                </p>

              </InfoBox>

              <InfoBox title="➡️ Common routes into HBO">

                <ul className="list-disc space-y-2 pl-5">
                  <li>HAVO diploma</li>
                  <li>MBO level 4 diploma</li>
                  <li>VWO diploma, depending on the programme</li>
                  <li>Other recognised admission routes</li>
                </ul>

              </InfoBox>

              <InfoBox
                title="🔞 21+ admission route"
                color="purple"
              >
                <p>
                  If you do not have the normal required diploma, some
                  higher-education institutions may have a 21+ admission
                  examination or exemption route.
                </p>

                <p className="mt-3">
                  This does <strong>not</strong> mean that everyone over
                  21 is automatically accepted. The institution decides
                  whether you meet its requirements.
                </p>
              </InfoBox>

            </div>
          </StudySection>

          {/* UNIVERSITY */}

          <StudySection
            icon="🏛️"
            title="University — WO"
            description="Academic education and scientific study."
          >
            <div className="space-y-5">

              <InfoBox title="🏛️ What is WO?">

                <p>
                  WO means
                  <strong> wetenschappelijk onderwijs</strong>.
                  University education is academically and
                  scientifically oriented.
                </p>

              </InfoBox>

              <InfoBox title="🎓 Bachelor's and Master's">

                <p>
                  Dutch higher education follows the bachelor-master
                  structure.
                </p>

                <p className="mt-3">
                  HBO bachelor's programmes generally take four years,
                  while WO bachelor's programmes generally take three
                  years.
                </p>

              </InfoBox>

            </div>
          </StudySection>

          {/* FOREIGN DIPLOMA */}

          <StudySection
            icon="🌍"
            title="I studied in another country"
            description="Your foreign diploma does not automatically map to a Dutch level."
          >
            <div className="space-y-5">

              <InfoBox title="🌍 Foreign education">

                <p>
                  If you completed education outside the Netherlands,
                  your school or institution may need information about
                  your previous education before deciding which Dutch
                  route is suitable.
                </p>

              </InfoBox>

              <InfoBox title="📄 Bring your documents">

                <ul className="list-disc space-y-2 pl-5">
                  <li>Diplomas</li>
                  <li>Certificates</li>
                  <li>School reports</li>
                  <li>Transcripts / grade lists</li>
                  <li>Translations when required</li>
                </ul>

              </InfoBox>

            </div>
          </StudySection>

          {/* FIND STUDY */}

          <StudySection
            icon="🔎"
            title="How to find a school or study programme"
            description="Search for programmes and compare your options."
          >
            <div className="space-y-5">

              <InfoBox title="🏫 Ask the school">

                <p>
                  Contact the school directly and explain your age,
                  previous education, diploma and Dutch level.
                </p>

              </InfoBox>

              <InfoBox title="🌐 Search online">

                <p>
                  Look at official education websites and the websites of
                  individual schools.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <LinkButton
                    name="Government.nl Education"
                    url="https://www.government.nl/topics/education"
                  />

                  <LinkButton
                    name="DUO"
                    url="https://www.duo.nl/"
                    color="green"
                  />

                  <LinkButton
                    name="LOWAN"
                    url="https://www.lowan.nl/"
                    color="purple"
                  />

                </div>

              </InfoBox>

              <InfoBox title="📍 Check the location">

                <p>
                  Before choosing a programme, check the travel time,
                  timetable, costs and available public transport.
                </p>

              </InfoBox>

            </div>
          </StudySection>

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
                  Ask the AI Guide to explain your education options in
                  simple language.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/chat?question=I need help understanding education in the Netherlands. Ask me simple questions one at a time about my age, Dutch level, previous education, diploma and goals. Then explain which education routes may be suitable for me, such as ISK, VMBO, HAVO, VWO, MBO, HBO or university. Also explain DUO and student travel if relevant. Do not ask for passwords or private login information."
                )
              }
              className="shrink-0 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-700"
            >
              🤖 Ask AI →
            </button>

          </div>

        </section>

        {/* IMPORTANT */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-xs leading-5 text-slate-500">
            <strong>Important:</strong> Education admission, DUO
            eligibility, student finance and compulsory education rules
            depend on your age, programme, residence status, previous
            education and other circumstances. Use official DUO,
            government and school information for your personal
            situation.
          </p>

        </section>

        {/* BACK */}

        <div className="mt-10">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-bold text-slate-500 transition hover:text-purple-600"
          >
            ← Back to Home
          </button>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Making education easier to understand
        </footer>

      </div>
    </main>
  );
}