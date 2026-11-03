import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Netherway",
  description:
    "Get help with Netherway, your guide to everyday life in the Netherlands.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Netherway Support
          </h1>

          <p className="text-lg text-slate-300">
            We're here to help make your experience with Netherway easier.
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            How can we help?
          </h2>

          <p className="mb-6 leading-7 text-slate-300">
            Having trouble using Netherway, scanning a document,
            accessing information or using one of our features?
            Contact our support team and describe the problem.
          </p>

          <a
            href="mailto:malikgroup.global@gmail.com?subject=Netherway%20Support"
            className="inline-block rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            Contact Support
          </a>

          <p className="mt-4 text-sm text-slate-400">
            Email: malikgroup.global@gmail.com
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            About Netherway
          </h2>

          <p className="leading-7 text-slate-300">
            Netherway is an independent guide designed to help
            people understand and navigate everyday life in
            the Netherlands. It brings useful information and
            practical digital tools together in one application.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Before contacting us
          </h2>

          <p className="leading-7 text-slate-300">
            Please include a description of the issue, your
            device model and app version where possible.
            Please do not email passwords, identity documents
            or other sensitive personal information.
          </p>
        </section>

        <footer className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          © 2026 Netherway. All rights reserved.
          <p className="mt-2">
            Independent information and guidance for life
            in the Netherlands.
          </p>
        </footer>
      </div>
    </main>
  );
}
