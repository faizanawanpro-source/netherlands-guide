"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SectionProps = {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function MoneySection({
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
  color?: "slate" | "blue" | "green" | "yellow" | "purple" | "orange" | "red";
}) {
  const colors = {
    slate: "border-slate-200 bg-slate-50",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    yellow: "border-yellow-200 bg-yellow-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
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

function OfficialLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
    >
      {label} →
    </a>
  );
}

export default function MoneyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6">

          {/* HOME ON LEFT */}

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
                Your guide to money in the Netherlands
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">

        {/* HERO */}

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-7 text-white shadow-xl sm:p-10">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
            💰
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-green-100">
            Money & Finance
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Understand money in the Netherlands.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-green-50 sm:text-lg">
            Bank accounts, salary, taxes, benefits, rent, bills,
            student finance and the everyday money questions newcomers
            often have.
          </p>

        </section>

        {/* QUICK MAP */}

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">

          <p className="text-sm font-black uppercase tracking-[0.18em] text-green-600">
            💶 Start here
          </p>

          <h2 className="mt-2 text-2xl font-black">
            The money system at a glance
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-blue-50 p-4">
              <div className="text-3xl">🏦</div>
              <p className="mt-2 font-black">
                Bank
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Receive and manage your money.
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <div className="text-3xl">💼</div>
              <p className="mt-2 font-black">
                Income
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Salary, payslips and work.
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-4">
              <div className="text-3xl">🏛️</div>
              <p className="mt-2 font-black">
                Government
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Taxes, benefits and allowances.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <div className="text-3xl">🎓</div>
              <p className="mt-2 font-black">
                Study
              </p>
              <p className="mt-1 text-sm text-slate-500">
                DUO and student finance.
              </p>
            </div>

          </div>

        </section>

        {/* SECTIONS */}

        <section className="mt-8 space-y-4">

          {/* BANK ACCOUNT */}

          <MoneySection
            icon="🏦"
            title="Dutch bank account"
            description="How banking works and why you need an account."
          >
            <div className="space-y-5">

              <InfoBox
                title="🏦 Why do I need a bank account?"
                color="blue"
              >
                <p>
                  A Dutch bank account makes everyday life much easier.
                  You can receive your salary, pay bills, receive
                  refunds and make payments.
                </p>
              </InfoBox>

              <InfoBox title="💳 Debit card">

                <p>
                  Dutch bank accounts normally come with a debit card.
                  You can use it in shops, restaurants, supermarkets and
                  online.
                </p>

              </InfoBox>

              <InfoBox title="📱 Banking app">

                <p>
                  Your bank's mobile app normally lets you check your
                  balance, transfer money, pay bills and manage your
                  card.
                </p>

              </InfoBox>

              <InfoBox title="🔐 Keep your banking information private">

                <p>
                  Never give another person your PIN, banking password,
                  verification codes or security codes.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* DEBIT CARD */}

          <MoneySection
            icon="💳"
            title="Paying with your card"
            description="PIN, contactless payments and online payments."
          >
            <div className="space-y-5">

              <InfoBox title="📲 Contactless">

                <p>
                  For smaller purchases you can often pay by holding
                  your debit card or phone near the payment terminal.
                </p>

              </InfoBox>

              <InfoBox title="🔢 PIN">

                <p>
                  For some transactions you will need to enter your
                  personal PIN.
                </p>

              </InfoBox>

              <InfoBox title="🛒 Supermarkets">

                <p>
                  Dutch supermarkets commonly accept debit-card
                  payments. Some payment methods or cards may not be
                  accepted everywhere, so check the payment terminal if
                  your card does not work.
                </p>

              </InfoBox>

              <InfoBox
                title="🚨 Someone asks for your PIN?"
                color="red"
              >
                <p>
                  Do not give it to them. Your PIN is private.
                </p>
              </InfoBox>

            </div>
          </MoneySection>

          {/* SALARY */}

          <MoneySection
            icon="💼"
            title="Salary & getting paid"
            description="Understand gross salary, net salary and your payslip."
          >
            <div className="space-y-5">

              <InfoBox
                title="💰 Gross vs net salary"
                color="green"
              >
                <p>
                  <strong>Gross salary</strong> is the amount before
                  deductions.
                </p>

                <p className="mt-3">
                  <strong>Net salary</strong> is the amount you actually
                  receive after deductions such as taxes and social
                  contributions.
                </p>
              </InfoBox>

              <InfoBox title="🧾 Payslip">

                <p>
                  Your employer should provide information showing how
                  your salary was calculated.
                </p>

                <p className="mt-3">
                  A payslip can show your gross pay, deductions, taxes,
                  hours and net amount.
                </p>

              </InfoBox>

              <InfoBox title="📅 When do I get paid?">

                <p>
                  Your employment contract or employer normally tells
                  you when salary is paid.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ Salary doesn't match your contract?">

                <p>
                  First compare your contract, hours and payslip. If
                  something still looks wrong, ask your employer for an
                  explanation and seek help from an appropriate advice
                  organisation if necessary.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* TAX */}

          <MoneySection
            icon="🧾"
            title="Taxes"
            description="Understand why tax is deducted and what you may need to do."
          >
            <div className="space-y-5">

              <InfoBox
                title="🏛️ Belastingdienst"
                color="blue"
              >
                <p>
                  The Belastingdienst is the Dutch Tax and Customs
                  Administration.
                </p>
              </InfoBox>

              <InfoBox title="💼 Income tax">

                <p>
                  If you earn income, tax may be deducted from your
                  salary during the year.
                </p>

              </InfoBox>

              <InfoBox title="📅 Annual tax return">

                <p>
                  Some people need to file an annual income tax return.
                  Others may receive an invitation from the
                  Belastingdienst or may choose to file because they
                  could be entitled to a refund.
                </p>

              </InfoBox>

              <InfoBox title="💸 Possible tax refund">

                <p>
                  If too much tax was withheld, you may sometimes be
                  entitled to money back after the tax calculation.
                </p>

              </InfoBox>

              <OfficialLink
                label="Visit Belastingdienst"
                href="https://www.belastingdienst.nl/"
              />

            </div>
          </MoneySection>

          {/* ZORGTOESLAG */}

          <MoneySection
            icon="❤️"
            title="Zorgtoeslag"
            description="Financial help with health-insurance costs for people who meet the conditions."
          >
            <div className="space-y-5">

              <InfoBox
                title="❤️ What is zorgtoeslag?"
                color="green"
              >
                <p>
                  Zorgtoeslag is a healthcare benefit that can help
                  eligible people with the cost of Dutch health
                  insurance.
                </p>
              </InfoBox>

              <InfoBox title="⚠️ It is not automatic">

                <p>
                  Having Dutch health insurance does not mean everyone
                  automatically receives zorgtoeslag.
                </p>

                <p className="mt-3">
                  Eligibility depends on conditions such as income,
                  household situation and other requirements.
                </p>

              </InfoBox>

              <InfoBox title="📅 Your income changes">

                <p>
                  If your income or personal situation changes, check
                  whether this affects your benefit.
                </p>

              </InfoBox>

              <InfoBox
                title="💸 Be careful with estimates"
                color="yellow"
              >
                <p>
                  Do not assume that a benefit amount will stay the same
                  forever. Benefits can be recalculated when your
                  circumstances change.
                </p>
              </InfoBox>

              <OfficialLink
                label="Check benefits"
                href="https://www.belastingdienst.nl/"
              />

            </div>
          </MoneySection>

          {/* HUURTOESLAG */}

          <MoneySection
            icon="🏠"
            title="Huurtoeslag"
            description="Housing benefit for eligible renters."
          >
            <div className="space-y-5">

              <InfoBox
                title="🏠 What is huurtoeslag?"
                color="blue"
              >
                <p>
                  Huurtoeslag is financial support for eligible people
                  who rent a home.
                </p>
              </InfoBox>

              <InfoBox title="🔎 Is everyone eligible?">

                <p>
                  No. Eligibility depends on the applicable rules,
                  including your income, household and housing
                  circumstances.
                </p>

              </InfoBox>

              <InfoBox title="📄 Keep your housing information">

                <p>
                  Keep your rental agreement and important information
                  about your rent. You may need these details when
                  dealing with the government.
                </p>

              </InfoBox>

              <OfficialLink
                label="Check Dutch benefits"
                href="https://www.belastingdienst.nl/"
              />

            </div>
          </MoneySection>

          {/* CHILD BENEFITS */}

          <MoneySection
            icon="👨‍👩‍👧"
            title="Child-related benefits"
            description="Kinderbijslag and kindgebonden budget."
          >
            <div className="space-y-5">

              <InfoBox title="👶 Kinderbijslag">

                <p>
                  Kinderbijslag is a child benefit for parents or carers
                  who meet the relevant conditions.
                </p>

              </InfoBox>

              <InfoBox title="👨‍👩‍👧 Kindgebonden budget">

                <p>
                  Kindgebonden budget is an income-related contribution
                  for eligible parents or carers.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ They are different">

                <p>
                  Kinderbijslag and kindgebonden budget are not the same
                  benefit and can have different eligibility rules.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* DUO */}

          <MoneySection
            icon="🎓"
            title="DUO & student finance"
            description="Money and support for eligible MBO, HBO and university students."
          >
            <div className="space-y-5">

              <InfoBox
                title="🎓 What is student finance?"
                color="purple"
              >
                <p>
                  Student finance can contain different components,
                  including a basic grant, supplementary grant, student
                  travel product, interest-bearing loan and, for HBO and
                  university, a tuition-fee loan.
                </p>
              </InfoBox>

              <InfoBox
                title="⚠️ You don't automatically qualify"
                color="orange"
              >
                <p>
                  Student finance depends on your education, age and
                  nationality or residence rights, among other
                  conditions.
                </p>

                <p className="mt-3">
                  Being a newcomer or refugee does not automatically
                  guarantee every component.
                </p>
              </InfoBox>

              <InfoBox title="💰 Grant vs loan">

                <p>
                  A grant is different from a loan. A loan normally has
                  to be repaid with interest according to the applicable
                  rules.
                </p>

              </InfoBox>

              <InfoBox title="🚆 Student travel">

                <p>
                  Eligible students can receive a student travel product
                  for free or discounted travel by train, tram, bus and
                  metro.
                </p>

                <p className="mt-3">
                  Students choose a weekday or weekend subscription.
                </p>

              </InfoBox>

              <InfoBox title="🛠️ MBO">

                <p>
                  MBO student-finance rules are different from HBO and
                  university. For MBO, regular student finance starts
                  from the applicable quarter after turning 18, while
                  eligible MBO students can receive the student travel
                  product before 18.
                </p>
              </InfoBox>

              <OfficialLink
                label="Visit DUO"
                href="https://www.duo.nl/"
              />

            </div>
          </MoneySection>

          {/* STUDENT OV */}

          <MoneySection
            icon="🚆"
            title="Student OV"
            description="How the student travel product works."
          >
            <div className="space-y-5">

              <InfoBox
                title="🚆 Free or discounted travel"
                color="green"
              >
                <p>
                  Depending on your subscription, you can travel free or
                  at a reduced rate throughout the Netherlands by train,
                  tram, bus and metro.
                </p>
              </InfoBox>

              <InfoBox title="📅 Week or weekend">

                <p>
                  You choose either a weekday or weekend subscription.
                </p>

              </InfoBox>

              <InfoBox title="💳 Personal OV-chipkaart">

                <p>
                  You need a personal OV-chipkaart to use the student
                  travel product.
                </p>

              </InfoBox>

              <InfoBox title="⚠️ BBL">

                <p>
                  Students doing an MBO BBL programme are not eligible
                  for the student travel product.
                </p>
              </InfoBox>

              <InfoBox title="🎓 Performance grant">

                <p>
                  For MBO level 3 and 4, HBO and university, the student
                  travel product is a performance-related grant and can
                  become a gift if you meet the applicable diploma
                  conditions.
                </p>
              </InfoBox>

              <OfficialLink
                label="Student travel information"
                href="https://duo.nl/particulier/student-travel-product/"
              />

            </div>
          </MoneySection>

          {/* BILLS */}

          <MoneySection
            icon="🧾"
            title="Bills you may have to pay"
            description="Understand recurring household costs."
          >
            <div className="space-y-5">

              <InfoBox title="🏠 Rent">

                <p>
                  If you rent a home, your rental agreement normally
                  explains when and how you pay your rent.
                </p>

              </InfoBox>

              <InfoBox title="⚡ Electricity">

                <p>
                  Electricity may be included in your housing costs or
                  you may have a separate energy contract.
                </p>

              </InfoBox>

              <InfoBox title="🔥 Gas">

                <p>
                  If your home uses gas, this can form part of your
                  energy bill or energy contract.
                </p>

              </InfoBox>

              <InfoBox title="💧 Water">

                <p>
                  Water charges can be separate from electricity and
                  gas. Keep your water-company information and bills.
                </p>

              </InfoBox>

              <InfoBox title="📱 Phone & internet">

                <p>
                  Mobile phone and internet contracts are also common
                  recurring expenses.
                </p>

              </InfoBox>

              <InfoBox title="🛡️ Insurance">

                <p>
                  Depending on your situation, you may have different
                  insurance costs, such as health insurance or other
                  personal insurance.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* BUDGET */}

          <MoneySection
            icon="📊"
            title="How to make a monthly budget"
            description="A simple way to understand where your money goes."
          >
            <div className="space-y-5">

              <InfoBox title="💰 Step 1 — Money coming in">

                <ul className="list-disc space-y-2 pl-5">
                  <li>Salary</li>
                  <li>Student finance</li>
                  <li>Benefits</li>
                  <li>Other regular income</li>
                </ul>

              </InfoBox>

              <InfoBox title="🏠 Step 2 — Fixed costs">

                <ul className="list-disc space-y-2 pl-5">
                  <li>Rent</li>
                  <li>Energy</li>
                  <li>Water</li>
                  <li>Health insurance</li>
                  <li>Phone</li>
                  <li>Internet</li>
                  <li>Insurance</li>
                </ul>

              </InfoBox>

              <InfoBox title="🛒 Step 3 — Variable spending">

                <ul className="list-disc space-y-2 pl-5">
                  <li>Food</li>
                  <li>Clothing</li>
                  <li>Transport</li>
                  <li>Entertainment</li>
                  <li>Shopping</li>
                </ul>

              </InfoBox>

              <InfoBox
                title="💡 Simple rule"
                color="green"
              >
                <p>
                  First understand your income and essential expenses.
                  Then decide how much you can safely spend, save or use
                  for non-essential purchases.
                </p>
              </InfoBox>

            </div>
          </MoneySection>

          {/* DEBT */}

          <MoneySection
            icon="💸"
            title="Loans, debt & missed payments"
            description="What to do when you cannot pay."
          >
            <div className="space-y-5">

              <InfoBox
                title="⚠️ Don't ignore bills"
                color="red"
              >
                <p>
                  If you cannot pay a bill, ignoring it can make the
                  situation worse.
                </p>

                <p className="mt-3">
                  Contact the organisation as soon as possible and ask
                  what payment arrangements or assistance may be
                  available.
                </p>
              </InfoBox>

              <InfoBox title="📬 Keep letters">

                <p>
                  Keep important letters, invoices and payment
                  confirmations so you can understand what you owe and
                  when it is due.
                </p>

              </InfoBox>

              <InfoBox title="🤝 Debt assistance">

                <p>
                  Dutch municipalities can provide or arrange forms of
                  debt assistance. If your debts are becoming difficult
                  to manage, seek help early.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* MONEY RECEIVED BY MISTAKE */}

          <MoneySection
            icon="💶"
            title="I received money by mistake"
            description="What to do if someone transfers money to you accidentally."
          >
            <div className="space-y-5">

              <InfoBox
                title="⚠️ Don't immediately spend it"
                color="yellow"
              >
                <p>
                  If money appears in your account unexpectedly, do not
                  assume it is yours.
                </p>
              </InfoBox>

              <InfoBox title="🏦 Contact your bank">

                <p>
                  Contact your bank and explain the situation. Keep
                  records of the transaction.
                </p>

              </InfoBox>

              <InfoBox title="🚨 Be careful with scams">

                <p>
                  Someone may contact you claiming you received money
                  accidentally and ask you to transfer money elsewhere.
                  Don't follow unusual payment instructions without
                  checking with your bank.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* INCOME CHANGE */}

          <MoneySection
            icon="🔄"
            title="My income changed"
            description="Why you should update relevant organisations."
          >
            <div className="space-y-5">

              <InfoBox
                title="🔄 Benefits can depend on income"
                color="orange"
              >
                <p>
                  Some benefits are based partly on income. If your
                  income changes significantly, check whether you need
                  to update your information.
                </p>
              </InfoBox>

              <InfoBox title="💼 Starting a new job">

                <p>
                  When you start working, make sure your administration
                  is correct and check whether the change affects your
                  benefits.
                </p>

              </InfoBox>

              <InfoBox title="🏠 Moving">

                <p>
                  A move can change your household and housing
                  situation. This can affect certain benefits.
                </p>

              </InfoBox>

            </div>
          </MoneySection>

          {/* ONLINE GOVERNMENT */}

          <MoneySection
            icon="💻"
            title="Where do I manage my money online?"
            description="Use official websites rather than random websites."
          >
            <div className="space-y-5">

              <InfoBox title="🏛️ Belastingdienst">

                <p>
                  Taxes and many benefits are handled through the Dutch
                  Tax and Customs Administration and its benefits
                  services.
                </p>

                <div className="mt-4">
                  <OfficialLink
                    label="Belastingdienst"
                    href="https://www.belastingdienst.nl/"
                  />
                </div>

              </InfoBox>

              <InfoBox title="🎓 DUO">

                <p>
                  Student finance and student travel are managed through
                  DUO.
                </p>

                <div className="mt-4">
                  <OfficialLink
                    label="DUO"
                    href="https://www.duo.nl/"
                  />
                </div>

              </InfoBox>

              <InfoBox title="🪪 DigiD">

                <p>
                  Many Dutch government services require you to log in
                  using DigiD.
                </p>

                <div className="mt-4">
                  <OfficialLink
                    label="DigiD"
                    href="https://www.digid.nl/"
                  />
                </div>

              </InfoBox>

            </div>
          </MoneySection>

        </section>

        {/* QUICK CHECKLIST */}

        <section className="mt-10 rounded-[2rem] border border-green-100 bg-green-50 p-6">

          <div className="flex items-start gap-4">

            <div className="text-4xl">
              ✅
            </div>

            <div>

              <h2 className="text-xl font-black text-green-950">
                Money checklist for newcomers
              </h2>

              <div className="mt-4 space-y-3 text-sm text-green-950/80">

                <p>☐ Open a suitable bank account</p>
                <p>☐ Understand your salary/payslip</p>
                <p>☐ Arrange health insurance if required</p>
                <p>☐ Check whether you qualify for zorgtoeslag</p>
                <p>☐ Check whether you qualify for huurtoeslag</p>
                <p>☐ Understand your rent and household bills</p>
                <p>☐ Understand your taxes</p>
                <p>☐ Check DUO if you are studying</p>
                <p>☐ Keep important financial letters</p>
                <p>☐ Report relevant changes when necessary</p>

              </div>

            </div>

          </div>

        </section>

        {/* AI */}

        <section className="mt-8 rounded-[1.5rem] border border-green-100 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="text-3xl">
                🤖
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Don't understand something about money?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ask the AI Guide to explain your situation in simple
                  language and help you find the correct next step.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/chat?question=I need help understanding money in the Netherlands. Ask me simple questions one at a time about my situation and explain what I should do. This could involve salary, taxes, benefits, rent, bills, DUO, student finance or banking. Give simple step-by-step explanations and direct me toward official Dutch organisations. Never ask me for passwords, PINs, banking login details or security codes."
                )
              }
              className="shrink-0 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
            >
              🤖 Ask AI →
            </button>

          </div>

        </section>

        {/* DISCLAIMER */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-xs leading-5 text-slate-500">
            <strong>Important:</strong> benefit amounts, tax rules,
            student-finance rules and eligibility can change. Your
            personal situation also matters. Always check the official
            organisation before making an important financial decision.
          </p>

        </section>

        {/* BACK HOME */}

        <div className="mt-10">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-bold text-slate-500 transition hover:text-green-600"
          >
            ← Back to Home
          </button>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide 🇳🇱 · Making money and benefits easier to understand
        </footer>

      </div>
    </main>
  );
}