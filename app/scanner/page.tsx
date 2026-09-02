"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Deadline = {
  date: string;
  description: string;
  importance: "high" | "medium" | "low";
};

type Payment = {
  amount: string;
  currency: string;
  dueDate: string;
  recipient: string;
  paymentReference: string;
};

type ScanResult = {
  documentType: string;
  sender: string;
  subject: string;
  summary: string;
  whatYouNeedToDo: string[];
  deadlines: Deadline[];
  payments: Payment[];
  appointments: string[];
  requiredDocuments: string[];
  consequences: string;
  importance: "high" | "medium" | "low";
  replyNeeded: boolean;
  appointmentNeeded: boolean;
  officialUrl: string;
  explanation: string;
};

type DuplicateDocument = {
  id: string;
  documentType: string;
  sender: string;
  subject: string;
  createdAt: string | null;
};

export default function ScannerPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [duplicateDocument, setDuplicateDocument] =
    useState<DuplicateDocument | null>(null);

  const [pendingScanResult, setPendingScanResult] =
    useState<ScanResult | null>(null);

  const [duplicateReason, setDuplicateReason] =
    useState("");

  function selectFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview("");
    setResult(null);
    setSaved(false);
    setError("");
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    if (selectedFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    }
  }

  async function getUserSession() {
    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (sessionData.session?.user) {
      return sessionData.session;
    }

    const {
      data,
      error: authError,
    } = await supabase.auth.signInAnonymously();

    if (authError) {
      throw authError;
    }

    if (!data.session || !data.user) {
      throw new Error("Could not create a user session.");
    }

    return data.session;
  }

  async function saveScan(
    scanResult: ScanResult,
    forceSave = false
  ) {
    setSaving(true);
    setSaved(false);

    try {
      const session = await getUserSession();

      const response = await fetch("/api/save-scan", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          documentType: scanResult.documentType,
          sender: scanResult.sender,
          subject: scanResult.subject,
          summary: scanResult.summary,
          explanation: scanResult.explanation,
          consequences: scanResult.consequences,
          importance: scanResult.importance,
          replyNeeded: scanResult.replyNeeded,
          appointmentNeeded: scanResult.appointmentNeeded,
          officialUrl: scanResult.officialUrl,
          confidence: null,
          deadlines: scanResult.deadlines,
          payments: scanResult.payments,

          appointments: scanResult.appointments?.map(
            (appointment) => ({
              description: appointment,
            })
          ),

          forceSave,
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data?.duplicate) {
        setDuplicateDocument(
          data.existingDocument || null
        );

        setDuplicateReason(
          typeof data.message === "string"
            ? data.message
            : "You may have already scanned this letter."
        );

        setPendingScanResult(scanResult);

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            data.message ||
            "Could not save scan."
        );
      }

      setSaved(true);

      console.log(
        "Scan saved successfully:",
        data
      );
    } catch (err) {
      console.error(
        "Save scan error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not save scan."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveAnyway() {
    if (!pendingScanResult) {
      return;
    }

    setDuplicateDocument(null);
    setDuplicateReason("");

    await saveScan(
      pendingScanResult,
      true
    );

    setPendingScanResult(null);
  }

  function viewExistingLetter() {
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    window.location.href = "/administration";
  }

  function closeDuplicateWarning() {
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);
  }

  async function scanLetter() {
    if (!file) {
      setError("Please upload a letter first.");
      return;
    }

    setScanning(true);
    setError("");
    setResult(null);
    setSaved(false);

    try {
      let language = "English";

      try {
        const savedProfile =
          localStorage.getItem(
            "netherlandsGuideProfile"
          );

        if (savedProfile) {
          const profile =
            JSON.parse(savedProfile);

          if (profile?.language) {
            language = String(
              profile.language
            );
          }
        }
      } catch {
        language = "English";
      }

      console.log(
        "Starting AI scan..."
      );

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "language",
        language
      );

      const response = await fetch(
        "/api/scan-letter",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "AI response status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "AI response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Scanning is currently unavailable."
        );
      }

      if (
        !data ||
        typeof data !== "object"
      ) {
        throw new Error(
          "The AI returned an invalid response."
        );
      }

      const normalizedResult: ScanResult = {
        documentType:
          typeof data.documentType ===
          "string"
            ? data.documentType
            : "",

        sender:
          typeof data.sender ===
          "string"
            ? data.sender
            : "",

        subject:
          typeof data.subject ===
          "string"
            ? data.subject
            : "",

        summary:
          typeof data.summary ===
          "string"
            ? data.summary
            : "",

        whatYouNeedToDo:
          Array.isArray(
            data.whatYouNeedToDo
          )
            ? data.whatYouNeedToDo.filter(
                (
                  item: unknown
                ): item is string =>
                  typeof item ===
                  "string"
              )
            : [],

        deadlines:
          Array.isArray(
            data.deadlines
          )
            ? data.deadlines.map(
                (
                  deadline: any
                ) => ({
                  date:
                    typeof deadline?.date ===
                    "string"
                      ? deadline.date
                      : "",

                  description:
                    typeof deadline?.description ===
                    "string"
                      ? deadline.description
                      : "",

                  importance:
                    deadline?.importance ===
                      "high" ||
                    deadline?.importance ===
                      "medium" ||
                    deadline?.importance ===
                      "low"
                      ? deadline.importance
                      : "medium",
                })
              )
            : [],

        payments:
          Array.isArray(
            data.payments
          )
            ? data.payments.map(
                (
                  payment: any
                ) => ({
                  amount:
                    typeof payment?.amount ===
                    "string"
                      ? payment.amount
                      : String(
                          payment?.amount ??
                            ""
                        ),

                  currency:
                    typeof payment?.currency ===
                    "string"
                      ? payment.currency
                      : "",

                  dueDate:
                    typeof payment?.dueDate ===
                    "string"
                      ? payment.dueDate
                      : "",

                  recipient:
                    typeof payment?.recipient ===
                    "string"
                      ? payment.recipient
                      : "",

                  paymentReference:
                    typeof payment?.paymentReference ===
                    "string"
                      ? payment.paymentReference
                      : "",
                })
              )
            : [],

        appointments:
          Array.isArray(
            data.appointments
          )
            ? data.appointments.filter(
                (
                  item: unknown
                ): item is string =>
                  typeof item ===
                  "string"
              )
            : [],

        requiredDocuments:
          Array.isArray(
            data.requiredDocuments
          )
            ? data.requiredDocuments.filter(
                (
                  item: unknown
                ): item is string =>
                  typeof item ===
                  "string"
              )
            : [],

        consequences:
          typeof data.consequences ===
          "string"
            ? data.consequences
            : "",

        importance:
          data.importance ===
            "high" ||
          data.importance ===
            "medium" ||
          data.importance ===
            "low"
            ? data.importance
            : "medium",

        replyNeeded:
          Boolean(
            data.replyNeeded
          ),

        appointmentNeeded:
          Boolean(
            data.appointmentNeeded
          ),

        officialUrl:
          typeof data.officialUrl ===
          "string"
            ? data.officialUrl
            : "",

        explanation:
          typeof data.explanation ===
          "string"
            ? data.explanation
            : "",
      };

      /*
       * Show the AI result immediately.
       */
      setResult(normalizedResult);

      /*
       * Save in the background.
       *
       * If it is a duplicate, saveScan()
       * will open the duplicate warning.
       */
      void saveScan(
        normalizedResult
      );
    } catch (err) {
      console.error(
        "Scanner error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not analyse the letter."
      );
    } finally {
      setScanning(false);
    }
  }

  function removeFile() {
    setFile(null);
    setPreview("");
    setResult(null);
    setSaved(false);
    setError("");
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-4">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 font-bold transition hover:bg-slate-100"
          >
            <span className="text-xl">
              ←
            </span>

            <div>
              <p className="font-black">
                Home
              </p>

              <p className="hidden text-xs font-normal text-slate-500 sm:block">
                Netherlands Guide
              </p>
            </div>
          </Link>

        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-5 py-10">

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl sm:p-10">

          <div className="text-5xl">
            📄
          </div>

          <h1 className="mt-5 text-3xl font-black sm:text-5xl">
            Smart Letter Scanner
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Upload a Dutch letter and Netherlands Guide will explain what it means, what you need to do, deadlines, payments and important next steps.
          </p>

        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (

            <button
              type="button"
              onClick={selectFile}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50 px-6 py-16 text-center transition hover:border-purple-400 hover:bg-purple-100"
            >

              <div className="text-6xl">
                📷
              </div>

              <h2 className="mt-5 text-xl font-black text-purple-950">
                Scan your letter
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Take a photo or choose an image
              </p>

              <span className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-black text-white">
                Choose file
              </span>

            </button>

          ) : (

            <div>

              {preview ? (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                  <img
                    src={preview}
                    alt="Uploaded letter"
                    className="max-h-[550px] w-full object-contain"
                  />

                </div>

              ) : null}

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected file
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {file.name}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-4 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={selectFile}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-black transition hover:bg-slate-50"
                >
                  📷 Choose another
                </button>

                <button
                  type="button"
                  onClick={scanLetter}
                  disabled={scanning}
                  className="rounded-xl bg-purple-600 px-5 py-4 font-black text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {scanning
                    ? "🔄 Understanding letter..."
                    : "🤖 Understand with AI"}
                </button>

              </div>

            </div>

          )}

        </section>

        {error && (

          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
            ⚠️ {error}
          </section>

        )}

        {result && (

          <section className="mt-8 space-y-5">

            <div className="rounded-[2rem] border border-purple-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  🤖
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-wider text-purple-600">
                    Netherlands Guide AI
                  </p>

                  <h2 className="text-2xl font-black">
                    I understood your letter
                  </h2>

                </div>

              </div>

              {saved && (
                <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  ✅ This letter has been saved to your administration.
                </div>
              )}

              {saving && (
                <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                  💾 Saving this letter to your administration...
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Document
                </p>

                <p className="mt-2 text-lg font-black">
                  {result.documentType ||
                    "Official document"}
                </p>

                {result.sender && (
                  <p className="mt-2 text-sm text-slate-600">
                    From:{" "}
                    <span className="font-bold">
                      {result.sender}
                    </span>
                  </p>
                )}

                {result.subject && (
                  <p className="mt-1 text-sm text-slate-600">
                    Subject:{" "}
                    <span className="font-bold">
                      {result.subject}
                    </span>
                  </p>
                )}

              </div>

            </div>

            <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-7">

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                What it means
              </p>

              <p className="mt-3 leading-8 text-blue-950">
                {result.explanation}
              </p>

            </div>

            <div className="rounded-[2rem] border border-green-200 bg-white p-7 shadow-sm">

              <p className="text-xs font-black uppercase tracking-wider text-green-600">
                What you need to do
              </p>

              {result.whatYouNeedToDo?.length ? (

                <div className="mt-5 space-y-3">

                  {result.whatYouNeedToDo.map(
                    (
                      action,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-green-50 p-4"
                      >

                        <div className="font-black text-green-700">
                          {index + 1}.
                        </div>

                        <p className="leading-7 text-green-950">
                          {action}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="mt-4 text-slate-500">
                  No specific action was identified.
                </p>

              )}

            </div>

            {result.deadlines?.length > 0 && (

              <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-7">

                <p className="text-xs font-black uppercase tracking-wider text-orange-600">
                  📅 Important deadlines
                </p>

                <div className="mt-5 space-y-3">

                  {result.deadlines.map(
                    (
                      deadline,
                      index
                    ) => (

                      <div
                        key={index}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                      >

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <p className="text-xl font-black text-orange-950">
                            {deadline.date}
                          </p>

                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase text-orange-700">
                            {deadline.importance}
                          </span>

                        </div>

                        <p className="mt-3 leading-7 text-slate-700">
                          {deadline.description}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {result.payments?.length > 0 && (

              <div className="rounded-[2rem] border border-red-200 bg-red-50 p-7">

                <p className="text-xs font-black uppercase tracking-wider text-red-600">
                  💶 Payment detected
                </p>

                <div className="mt-5 space-y-4">

                  {result.payments.map(
                    (
                      payment,
                      index
                    ) => (

                      <div
                        key={index}
                        className="rounded-2xl bg-white p-5"
                      >

                        <p className="text-3xl font-black text-red-700">
                          {payment.currency}{" "}
                          {payment.amount}
                        </p>

                        {payment.dueDate && (
                          <p className="mt-3 text-sm text-slate-600">
                            Due:{" "}
                            <span className="font-bold">
                              {payment.dueDate}
                            </span>
                          </p>
                        )}

                        {payment.recipient && (
                          <p className="mt-1 text-sm text-slate-600">
                            To:{" "}
                            <span className="font-bold">
                              {payment.recipient}
                            </span>
                          </p>
                        )}

                        {payment.paymentReference && (
                          <p className="mt-1 text-sm text-slate-600">
                            Payment reference:{" "}
                            <span className="font-bold">
                              {payment.paymentReference}
                            </span>
                          </p>
                        )}

                      </div>
                    )
                  )}

                </div>

              </div>

            )}

            {result.appointments?.length > 0 && (

              <div className="rounded-[2rem] border border-indigo-200 bg-indigo-50 p-7">

                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  📅 Appointment
                </p>

                <div className="mt-4 space-y-3">

                  {result.appointments.map(
                    (
                      appointment,
                      index
                    ) => (

                      <p
                        key={index}
                        className="rounded-xl bg-white p-4 leading-7 text-indigo-950"
                      >
                        {appointment}
                      </p>

                    )
                  )}

                </div>

              </div>

            )}

            {result.requiredDocuments?.length > 0 && (

              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  📑 Documents you may need
                </p>

                <div className="mt-4 space-y-2">

                  {result.requiredDocuments.map(
                    (
                      document,
                      index
                    ) => (

                      <div
                        key={index}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        {document}
                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {result.consequences && (

              <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-7">

                <p className="text-xs font-black uppercase tracking-wider text-yellow-700">
                  ⚠️ If you do nothing
                </p>

                <p className="mt-3 leading-7 text-yellow-950">
                  {result.consequences}
                </p>

              </div>

            )}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                AI safety check
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                This explanation is based on the information visible in your document. For important legal, immigration, financial or healthcare matters, always verify the information with the official organization.
              </p>

            </div>

          </section>

        )}

      </div>

      {duplicateDocument && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
          onClick={closeDuplicateWarning}
        >

          <div
            className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                ⚠️
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Possible duplicate
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  You may have already scanned this letter.
                </h2>

              </div>

            </div>

            <p className="mt-5 leading-7 text-slate-600">
              Netherlands Guide found an existing letter in your administration that looks very similar to this one.
            </p>

            {duplicateReason && (

              <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold leading-6 text-orange-900">
                {duplicateReason}
              </div>

            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Existing letter
              </p>

              <p className="mt-2 font-black text-slate-900">
                {duplicateDocument.documentType ||
                  "Official document"}
              </p>

              {duplicateDocument.sender && (

                <p className="mt-2 text-sm text-slate-600">
                  From:{" "}
                  <span className="font-bold">
                    {duplicateDocument.sender}
                  </span>
                </p>

              )}

              {duplicateDocument.subject && (

                <p className="mt-1 text-sm text-slate-600">
                  Subject:{" "}
                  <span className="font-bold">
                    {duplicateDocument.subject}
                  </span>
                </p>

              )}

              {duplicateDocument.createdAt && (

                <p className="mt-1 text-sm text-slate-600">
                  Scanned:{" "}
                  <span className="font-bold">
                    {new Date(
                      duplicateDocument.createdAt
                    ).toLocaleDateString(
                      "en-NL"
                    )}
                  </span>
                </p>

              )}

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={viewExistingLetter}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-900 transition hover:bg-slate-50"
              >
                📂 View existing letter
              </button>

              <button
                type="button"
                onClick={saveAnyway}
                disabled={saving}
                className="rounded-xl bg-purple-600 px-5 py-4 font-black text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save anyway"}
              </button>

            </div>

            <button
              type="button"
              onClick={closeDuplicateWarning}
              className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </main>
  );
}