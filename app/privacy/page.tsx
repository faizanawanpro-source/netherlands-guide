import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Netherway",
  description: "Learn how Netherway handles and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl">
        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-400">
            Netherway
          </p>
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: November 3, 2026</p>
        </header>

        <div className="space-y-10 leading-7 text-slate-300">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              1. Who we are
            </h2>
            <p>
              Netherway is an independent digital guide designed to help
              people understand and navigate everyday life in the Netherlands.
              It is operated by Faizan Mahmood.
            </p>
            <p className="mt-3">
              For privacy questions or requests, contact us at:
            </p>
            <a
              className="mt-2 inline-block text-teal-400 underline"
              href="mailto:malikgroup.global@gmail.com?subject=Netherway%20Privacy%20Request"
            >
              malikgroup.global@gmail.com
            </a>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              2. Information we process
            </h2>
            <p>Depending on the features you use, Netherway may process:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-white">Profile and preferences:</strong>{" "}
                information such as a name or language preference that you
                enter into the app.
              </li>
              <li>
                <strong className="text-white">Documents and scans:</strong>{" "}
                document images, text extracted from letters, and related
                summaries, actions or deadlines when you use the scanner.
              </li>
              <li>
                <strong className="text-white">Voice and AI requests:</strong>{" "}
                audio, transcriptions and text prompts that you submit when
                using voice or AI features.
              </li>
              <li>
                <strong className="text-white">Saved information:</strong>{" "}
                information you enter or save in features such as deadlines,
                payments, appointments and planning tools.
              </li>
              <li>
                <strong className="text-white">Technical information:</strong>{" "}
                technical information processed by the app's hosting and
                infrastructure providers to deliver and secure the service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              3. How we use information
            </h2>
            <p>Information is used as necessary to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide the app's guides, tools and features.</li>
              <li>Scan and explain documents submitted by users.</li>
              <li>Process voice requests and generate AI responses.</li>
              <li>Translate information requested by users.</li>
              <li>Save information needed for reminders and planning tools.</li>
              <li>Maintain security, troubleshoot problems and provide support.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              4. Service providers
            </h2>
            <p>
              Netherway uses external technology providers to operate
              particular features. Depending on how you use the app, these
              include:
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-white">Vercel:</strong> website hosting
                and application infrastructure.
                {" "}<a className="text-teal-400 underline" href="https://vercel.com/legal/privacy-policy">Privacy policy</a>.
              </li>
              <li>
                <strong className="text-white">Supabase:</strong> backend
                services and storage for information saved through the app.
                {" "}<a className="text-teal-400 underline" href="https://supabase.com/privacy">Privacy policy</a>.
              </li>
              <li>
                <strong className="text-white">Groq:</strong> AI processing
                for features such as document analysis and supported AI
                requests.
                {" "}<a className="text-teal-400 underline" href="https://groq.com/privacy-policy/">Privacy policy</a>.
              </li>
              <li>
                <strong className="text-white">Google Translate:</strong>{" "}
                translation services when you request a translation.
                {" "}<a className="text-teal-400 underline" href="https://policies.google.com/privacy">Privacy policy</a>.
              </li>
            </ul>
            <p className="mt-3">
              Information may be transmitted to the relevant provider when you
              use a feature that depends on that provider. These providers
              process information under their own terms and applicable
              privacy requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              5. Storage and retention
            </h2>
            <p>
              Some preferences may be stored locally on your device or in your
              browser. Information saved through online features may be stored
              using our backend provider.
            </p>
            <p className="mt-3">
              We retain information for as long as it is needed to provide the
              relevant feature, meet applicable legal obligations, maintain
              security or resolve a support request. You can contact us to
              request deletion of personal information. Some technical
              records or backup copies may remain for a limited period where
              necessary for security, recovery or legal reasons.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              6. Your privacy rights
            </h2>
            <p>
              Where applicable under data protection law, including the
              GDPR, you may have the right to request access to, correction
              or deletion of your personal information. You may also have
              rights to restrict or object to certain processing and to
              request data portability.
            </p>
            <p className="mt-3">
              To make a request, email{" "}
              <a
                className="text-teal-400 underline"
                href="mailto:malikgroup.global@gmail.com"
              >
                malikgroup.global@gmail.com
              </a>.
              We may need to verify your identity before responding.
            </p>
            <p className="mt-3">
              You can also lodge a complaint with the Dutch Data Protection
              Authority (Autoriteit Persoonsgegevens) at{" "}
              <a
                className="text-teal-400 underline"
                href="https://autoriteitpersoonsgegevens.nl/"
                target="_blank"
                rel="noreferrer"
              >
                autoriteitpersoonsgegevens.nl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              7. Security
            </h2>
            <p>
              We use the security measures made available by our technology
              providers and take reasonable steps to protect information.
              However, no internet transmission or electronic storage method
              can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              8. Documents and sensitive information
            </h2>
            <p>
              Official letters can contain sensitive personal information.
              Only upload documents that are necessary for the feature you
              are using and that you are comfortable processing through the
              relevant service providers. Avoid uploading passwords or
              documents that are not needed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              9. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy when the app, its providers
              or applicable requirements change. The latest version will
              be published on this page with an updated date.
            </p>
          </section>

          <footer className="border-t border-slate-800 pt-6 text-sm text-slate-400">
            © 2026 Netherway. All rights reserved.
          </footer>
        </div>
      </article>
    </main>
  );
}
