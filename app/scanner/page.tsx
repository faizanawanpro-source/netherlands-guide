"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
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

const MAX_SAVED_LETTERS = 15;

const languageMap: Record<string, string> = {
  English: "en-US",
  Dutch: "nl-NL",
  Nederlands: "nl-NL",
  Urdu: "ur-PK",
  Hindi: "hi-IN",
  Punjabi: "pa-IN",
  Arabic: "ar-SA",
  Turkish: "tr-TR",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Polish: "pl-PL",
  Portuguese: "pt-PT",
  Romanian: "ro-RO",
  Bengali: "bn-BD",
  "Bengali (Bangla)": "bn-BD",
};

export default function ScannerPage() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const audioUrlRef =
    useRef<string | null>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [scanning, setScanning] =
    useState(false);

  const [result, setResult] =
    useState<ScanResult | null>(null);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [ttsLoading, setTtsLoading] =
    useState(false);

  const [language, setLanguage] =
    useState("English");

  const [savedLetterCount, setSavedLetterCount] =
    useState<number | null>(null);

  const [duplicateDocument, setDuplicateDocument] =
    useState<DuplicateDocument | null>(null);

  const [pendingScanResult, setPendingScanResult] =
    useState<ScanResult | null>(null);

  const [duplicateReason, setDuplicateReason] =
    useState("");

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current
        );
      }

      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function selectFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    stopSpeaking();

    setFile(selectedFile);
    setResult(null);
    setSaved(false);
    setError("");
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");

    if (
      selectedFile.type.startsWith(
        "image/"
      )
    ) {
      const imageUrl =
        URL.createObjectURL(
          selectedFile
        );

      setPreview(imageUrl);
    }
  }

  async function getUserSession() {
    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (sessionData.session?.user) {
      return sessionData.session;
    }

    const {
      data,
      error: authError,
    } =
      await supabase.auth.signInAnonymously();

    if (authError) {
      throw authError;
    }

    if (
      !data.session ||
      !data.user
    ) {
      throw new Error(
        "Could not create a user session."
      );
    }

    return data.session;
  }

  async function getSavedLetterCount(
    userId: string
  ) {
    const {
      count,
      error: countError,
    } = await supabase
      .from("documents")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId);

    if (countError) {
      throw countError;
    }

    return count ?? 0;
  }

  function getSpeechLanguage() {
    return (
      languageMap[language] ||
      "en-US"
    );
  }

  /*
   * This is deliberately NOT the complete letter.
   *
   * It only uses the information already displayed
   * in the result:
   *
   * - what the letter means
   * - what the person needs to do
   * - deadlines
   * - payments
   * - appointments
   * - required documents
   * - consequences
   */
  function buildSpeechText() {
    if (!result) {
      return "";
    }

    const parts: string[] = [];

    if (result.explanation) {
      parts.push(
        result.explanation
      );
    }

    if (
      result.whatYouNeedToDo?.length
    ) {
      parts.push(
        ...result.whatYouNeedToDo
      );
    }

    if (
      result.deadlines?.length
    ) {
      result.deadlines.forEach(
        (deadline) => {
          if (deadline.date) {
            parts.push(
              `${deadline.date}. ${deadline.description}`
            );
          } else if (
            deadline.description
          ) {
            parts.push(
              deadline.description
            );
          }
        }
      );
    }

    if (
      result.payments?.length
    ) {
      result.payments.forEach(
        (payment) => {
          const paymentParts =
            [
              payment.amount,
              payment.currency,
              payment.recipient,
              payment.dueDate,
              payment.paymentReference,
            ].filter(Boolean);

          if (
            paymentParts.length
          ) {
            parts.push(
              paymentParts.join(". ")
            );
          }
        }
      );
    }

    if (
      result.appointments?.length
    ) {
      parts.push(
        ...result.appointments
      );
    }

    if (
      result.requiredDocuments
        ?.length
    ) {
      parts.push(
        ...result.requiredDocuments
      );
    }

    if (result.consequences) {
      parts.push(
        result.consequences
      );
    }

    return parts
      .filter(Boolean)
      .join(". ");
  }

  function pcmToWavBlob(
    base64: string,
    sampleRate = 24000,
    channels = 1,
    bitsPerSample = 16
  ) {
    const binary =
      window.atob(base64);

    const pcm =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      pcm[i] =
        binary.charCodeAt(i);
    }

    const blockAlign =
      (channels *
        bitsPerSample) /
      8;

    const byteRate =
      sampleRate *
      blockAlign;

    const buffer =
      new ArrayBuffer(44);

    const view =
      new DataView(buffer);

    const writeString = (
      offset: number,
      value: string
    ) => {
      for (
        let i = 0;
        i < value.length;
        i++
      ) {
        view.setUint8(
          offset + i,
          value.charCodeAt(i)
        );
      }
    };

    writeString(0, "RIFF");

    view.setUint32(
      4,
      36 + pcm.length,
      true
    );

    writeString(8, "WAVE");

    writeString(
      12,
      "fmt "
    );

    view.setUint32(
      16,
      16,
      true
    );

    view.setUint16(
      20,
      1,
      true
    );

    view.setUint16(
      22,
      channels,
      true
    );

    view.setUint32(
      24,
      sampleRate,
      true
    );

    view.setUint32(
      28,
      byteRate,
      true
    );

    view.setUint16(
      32,
      blockAlign,
      true
    );

    view.setUint16(
      34,
      bitsPerSample,
      true
    );

    writeString(
      36,
      "data"
    );

    view.setUint32(
      40,
      pcm.length,
      true
    );

    return new Blob(
      [buffer, pcm],
      {
        type: "audio/wav",
      }
    );
  }

  function stopSpeaking() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(
        audioUrlRef.current
      );

      audioUrlRef.current = null;
    }

    setSpeaking(false);
    setTtsLoading(false);
  }

  async function speakResult() {
    if (!result) {
      return;
    }

    if (speaking || ttsLoading) {
      stopSpeaking();
      return;
    }

    const text =
      buildSpeechText();

    if (!text) {
      setError(
        "There is no information available to read aloud."
      );
      return;
    }

    setError("");
    setTtsLoading(true);

    try {
      const response =
        await fetch(
          "/api/tts",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              text,
              language,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not generate the voice."
        );
      }

      if (
        !data?.audioBase64
      ) {
        throw new Error(
          "The voice service returned no audio."
        );
      }

      const wavBlob =
        pcmToWavBlob(
          data.audioBase64,
          data.sampleRate ||
            24000,
          data.channels || 1,
          data.bitsPerSample ||
            16
        );

      const audioUrl =
        URL.createObjectURL(
          wavBlob
        );

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current
        );
      }

      audioUrlRef.current =
        audioUrl;

      const audio =
        new Audio(audioUrl);

      audioRef.current =
        audio;

      audio.onplay = () => {
        setTtsLoading(false);
        setSpeaking(true);
      };

      audio.onended = () => {
        setSpeaking(false);

        if (
          audioUrlRef.current
        ) {
          URL.revokeObjectURL(
            audioUrlRef.current
          );

          audioUrlRef.current =
            null;
        }

        audioRef.current =
          null;
      };

      audio.onerror = () => {
        setSpeaking(false);
        setTtsLoading(false);

        if (
          audioUrlRef.current
        ) {
          URL.revokeObjectURL(
            audioUrlRef.current
          );

          audioUrlRef.current =
            null;
        }

        audioRef.current =
          null;

        setError(
          "The voice could not be played. Please try again."
        );
      };

      await audio.play();
    } catch (err) {
      console.error(
        "TTS error:",
        err
      );

      setTtsLoading(false);
      setSpeaking(false);

      setError(
        err instanceof Error
          ? err.message
          : "Could not read the result aloud."
      );
    }
  }

  async function saveScan(
    scanResult: ScanResult
  ) {
    setSaving(true);
    setSaved(false);

    try {
      const session =
        await getUserSession();

      const currentCount =
        await getSavedLetterCount(
          session.user.id
        );

      setSavedLetterCount(
        currentCount
      );

      if (
        currentCount >=
        MAX_SAVED_LETTERS
      ) {
        setError(
          "You have reached the maximum of 15 saved letters. Delete an old letter from My Administration before saving a new one."
        );

        return;
      }

      const response =
        await fetch(
          "/api/save-scan",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              documentType:
                scanResult.documentType,

              sender:
                scanResult.sender,

              subject:
                scanResult.subject,

              summary:
                scanResult.summary,

              explanation:
                scanResult.explanation,

              consequences:
                scanResult.consequences,

              importance:
                scanResult.importance,

              replyNeeded:
                scanResult.replyNeeded,

              appointmentNeeded:
                scanResult.appointmentNeeded,

              officialUrl:
                scanResult.officialUrl,

              confidence: null,

              deadlines:
                scanResult.deadlines,

              payments:
                scanResult.payments,

              appointments:
                scanResult.appointments?.map(
                  (appointment) => ({
                    description:
                      appointment,
                  })
                ),
            }),
          }
        );

      const data =
        await response.json();

      if (
        response.status ===
          409 &&
        data?.duplicate
      ) {
        setDuplicateDocument(
          data.existingDocument ||
            null
        );

        setDuplicateReason(
          typeof data.message ===
            "string"
            ? data.message
            : "You may have already scanned this letter."
        );

        setPendingScanResult(
          scanResult
        );

        return;
      }

      if (!response.ok) {
        const message =
          data?.details ||
          data?.error ||
          data?.message ||
          "";

        if (
          message
            .toLowerCase()
            .includes(
              "15 saved letters"
            )
        ) {
          setError(
            "You have reached the maximum of 15 saved letters. Delete an old letter from My Administration before saving a new one."
          );
        } else {
          throw new Error(
            message ||
              "Could not save scan."
          );
        }

        return;
      }

      setSaved(true);

      const newCount =
        await getSavedLetterCount(
          session.user.id
        );

      setSavedLetterCount(
        newCount
      );

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

  function viewExistingLetter() {
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    window.location.href =
      "/administration";
  }

  function closeDuplicateWarning() {
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);
  }

  async function scanLetter() {
    if (!file) {
      setError(
        "Please upload a letter first."
      );

      return;
    }

    stopSpeaking();

    setScanning(true);
    setError("");
    setResult(null);
    setSaved(false);

    try {
      let selectedLanguage =
        "English";

      try {
        const savedProfile =
          localStorage.getItem(
            "netherlandsGuideProfile"
          );

        if (savedProfile) {
          const profile =
            JSON.parse(
              savedProfile
            );

          if (
            profile?.language
          ) {
            selectedLanguage =
              String(
                profile.language
              );
          }
        }
      } catch {
        selectedLanguage =
          "English";
      }

      setLanguage(
        selectedLanguage
      );

      try {
        const session =
          await getUserSession();

        const count =
          await getSavedLetterCount(
            session.user.id
          );

        setSavedLetterCount(
          count
        );
      } catch {
        setSavedLetterCount(
          null
        );
      }

      console.log(
        "Starting AI scan in profile language:",
        selectedLanguage
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "language",
        selectedLanguage
      );

      const response =
        await fetch(
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

      const data =
        await response.json();

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
        typeof data !==
          "object"
      ) {
        throw new Error(
          "The AI returned an invalid response."
        );
      }

      const normalizedResult:
        ScanResult = {
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

      setResult(
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
    stopSpeaking();

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setFile(null);
    setPreview("");
    setResult(null);
    setSaved(false);
    setError("");
    setDuplicateDocument(null);
    setDuplicateReason("");
    setPendingScanResult(null);

    if (inputRef.current) {
      inputRef.current.value =
        "";
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
              <div className="flex items-start justify-between gap-4">
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

                <button
                  type="button"
                  onClick={speakResult}
                  disabled={ttsLoading}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-2xl transition hover:bg-purple-100 disabled:cursor-wait disabled:opacity-70"
                  aria-label={
                    speaking
                      ? "Stop speaking"
                      : "Read result aloud"
                  }
                  title={
                    speaking
                      ? "Stop"
                      : `Read the result aloud in ${language}`
                  }
                >
                  {ttsLoading
                    ? "⏳"
                    : speaking
                    ? "⏹️"
                    : "🔊"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  🔊 {language}
                </span>

                {savedLetterCount !==
                  null && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    💾{" "}
                    {
                      savedLetterCount
                    }
                    /
                    {
                      MAX_SAVED_LETTERS
                    }{" "}
                    saved
                  </span>
                )}
              </div>

              {ttsLoading && (
                <div className="mt-5 rounded-xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700">
                  🗣️ Preparing a clear voice explanation...
                </div>
              )}

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

              {!saving &&
                !saved &&
                savedLetterCount !==
                  null &&
                savedLetterCount <
                  MAX_SAVED_LETTERS && (
                  <button
                    type="button"
                    onClick={() =>
                      saveScan(result)
                    }
                    className="mt-5 w-full rounded-xl bg-purple-600 px-5 py-4 font-black text-white transition hover:bg-purple-700"
                  >
                    💾 Save this letter
                  </button>
                )}

              {!saving &&
                !saved &&
                savedLetterCount !==
                  null &&
                savedLetterCount >=
                  MAX_SAVED_LETTERS && (
                  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                    <p className="font-black text-orange-900">
                      🔒 Your 15-letter limit has been reached
                    </p>

                    <p className="mt-1 text-sm leading-6 text-orange-800">
                      Delete an old letter from My Administration before saving this one.
                    </p>

                    <Link
                      href="/administration"
                      className="mt-4 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700"
                    >
                      📋 Manage saved letters
                    </Link>
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

            {result.deadlines?.length >
              0 && (
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
                            {deadline.date ||
                              "Date depends on receipt"}
                          </p>

                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase text-orange-700">
                            {
                              deadline.importance
                            }
                          </span>
                        </div>

                        <p className="mt-3 leading-7 text-slate-700">
                          {
                            deadline.description
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {result.payments?.length >
              0 && (
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
                          {
                            payment.currency
                          }{" "}
                          {
                            payment.amount
                          }
                        </p>

                        {payment.dueDate && (
                          <p className="mt-3 text-sm text-slate-600">
                            Due:{" "}
                            <span className="font-bold">
                              {
                                payment.dueDate
                              }
                            </span>
                          </p>
                        )}

                        {payment.recipient && (
                          <p className="mt-1 text-sm text-slate-600">
                            To:{" "}
                            <span className="font-bold">
                              {
                                payment.recipient
                              }
                            </span>
                          </p>
                        )}

                        {payment.paymentReference && (
                          <p className="mt-1 text-sm text-slate-600">
                            Payment reference:{" "}
                            <span className="font-bold">
                              {
                                payment.paymentReference
                              }
                            </span>
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {result.appointments?.length >
              0 && (
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

            {result.requiredDocuments?.length >
              0 && (
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
                  {
                    result.consequences
                  }
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
          onClick={
            closeDuplicateWarning
          }
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
                {
                  duplicateReason
                }
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Existing letter
              </p>

              <p className="mt-2 font-black text-slate-900">
                {
                  duplicateDocument.documentType ||
                  "Official document"
                }
              </p>

              {duplicateDocument.sender && (
                <p className="mt-2 text-sm text-slate-600">
                  From:{" "}
                  <span className="font-bold">
                    {
                      duplicateDocument.sender
                    }
                  </span>
                </p>
              )}

              {duplicateDocument.subject && (
                <p className="mt-1 text-sm text-slate-600">
                  Subject:{" "}
                  <span className="font-bold">
                    {
                      duplicateDocument.subject
                    }
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
                onClick={
                  viewExistingLetter
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-900 transition hover:bg-slate-50"
              >
                📂 View existing letter
              </button>

              <button
                type="button"
                onClick={
                  closeDuplicateWarning
                }
                className="rounded-xl bg-slate-900 px-5 py-4 font-black text-white transition hover:bg-slate-800"
              >
                Don't save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}