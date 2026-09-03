"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DocumentData = {
  id: string;
  document_type: string | null;
  sender: string | null;
  subject: string | null;
  summary: string | null;
  explanation: string | null;
  original_text: string | null;
  consequences: string | null;
  importance: string | null;
  reply_needed: boolean | null;
  appointment_needed: boolean | null;
  official_url: string | null;
  confidence: string | null;
  created_at: string;
};

export default function AdministrationDocumentPage() {
  const params = useParams();
  const documentId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [document, setDocument] =
    useState<DocumentData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [recording, setRecording] =
    useState(false);

  const [processingVoice, setProcessingVoice] =
    useState(false);

  const [voiceMessage, setVoiceMessage] =
    useState("");

  const [replyDraft, setReplyDraft] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    loadDocument();
  }, [documentId]);

  async function loadDocument() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your session could not be found. Please sign in again."
        );
        return;
      }

      const {
        data,
        error: documentError,
      } = await supabase
        .from("documents")
        .select(
          "id, document_type, sender, subject, summary, explanation, original_text, consequences, importance, reply_needed, appointment_needed, official_url, confidence, created_at"
        )
        .eq(
          "id",
          documentId
        )
        .eq(
          "user_id",
          session.user.id
        )
        .single();

      if (documentError) {
        console.error(
          "Document loading error:",
          documentError
        );

        setError(
          "We could not find this saved letter."
        );

        return;
      }

      setDocument(
        data as DocumentData
      );
    } catch (err) {
      console.error(
        "Document page error:",
        err
      );

      setError(
        "Something went wrong while loading this letter."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return "Date not specified";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  async function startVoiceReply() {
    if (!document) {
      return;
    }

    setVoiceMessage("");

    if (
      typeof window ===
        "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setVoiceMessage(
        "Your browser does not support microphone recording."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      audioChunksRef.current =
        [];

      const recorder =
        new MediaRecorder(
          stream
        );

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data.size >
          0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop =
        async () => {
          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            );

          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type:
                  recorder.mimeType ||
                  "audio/webm",
              }
            );

          await processVoiceReply(
            audioBlob
          );
        };

      recorder.start();

      setRecording(true);
      setVoiceMessage(
        "Listening... Speak naturally in your own language."
      );
    } catch (err) {
      console.error(
        "Microphone error:",
        err
      );

      setVoiceMessage(
        "We could not access your microphone. Please allow microphone access and try again."
      );
    }
  }

  function stopVoiceReply() {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state ===
        "inactive"
    ) {
      return;
    }

    setRecording(false);
    setVoiceMessage(
      "Understanding what you said..."
    );

    recorder.stop();
  }

  async function processVoiceReply(
    audioBlob: Blob
  ) {
    if (!document) {
      return;
    }

    try {
      setProcessingVoice(true);
      setRecording(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setVoiceMessage(
          "Your session could not be found. Please sign in again."
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioBlob,
        "voice-reply.webm"
      );

      formData.append(
        "documentId",
        document.id
      );

      const response =
        await fetch(
          "/api/reply-from-voice",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "We could not create your reply."
        );
      }

      setReplyDraft(
        data.reply ||
          ""
      );

      setVoiceMessage(
        "Your Dutch reply has been created. You can edit it before sending."
      );
    } catch (err) {
      console.error(
        "Voice reply error:",
        err
      );

      setVoiceMessage(
        err instanceof Error
          ? err.message
          : "We could not create your reply. Please try again."
      );
    } finally {
      setProcessingVoice(false);
    }
  }

  function speakReply() {
    if (
      !replyDraft.trim()
    ) {
      return;
    }

    if (
      typeof window ===
        "undefined" ||
      !window.speechSynthesis
    ) {
      setVoiceMessage(
        "Text-to-speech is not available in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        replyDraft
      );

    utterance.lang =
      "nl-NL";

    utterance.rate =
      0.95;

    window.speechSynthesis.speak(
      utterance
    );
  }

  function stopSpeaking() {
    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }
  }

  async function copyReply() {
    if (
      !replyDraft.trim()
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        replyDraft
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2000
      );
    } catch (err) {
      console.error(
        "Copy error:",
        err
      );

      setVoiceMessage(
        "We could not copy the reply."
      );
    }
  }

  async function deleteCurrentDocument() {
    if (!document) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete this saved letter?\n\n${
          document.subject ||
          document.document_type ||
          "Saved document"
        }`
      );

    if (!confirmed) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your session could not be found. Please sign in again."
        );
        return;
      }

      const {
        error: deleteError,
      } = await supabase
        .from("documents")
        .delete()
        .eq(
          "id",
          document.id
        )
        .eq(
          "user_id",
          session.user.id
        );

      if (deleteError) {
        console.error(
          "Delete error:",
          deleteError
        );

        setError(
          "We could not delete this letter."
        );

        return;
      }

      window.location.href =
        "/administration";
    } catch (err) {
      console.error(
        "Delete error:",
        err
      );

      setError(
        "Something went wrong while deleting this letter."
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-12 text-center shadow-sm">
          <div className="text-4xl">
            ⏳
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Loading your letter...
          </h1>

          <p className="mt-2 text-slate-500">
            Securely retrieving your saved document.
          </p>
        </div>
      </main>
    );
  }

  if (error || !document) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="text-4xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-2xl font-bold text-red-900">
            Letter unavailable
          </h1>

          <p className="mt-3 text-red-700">
            {error ||
              "This letter could not be found."}
          </p>

          <Link
            href="/administration"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            ← Back to administration
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/administration"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← My Administration
          </Link>

          <button
            type="button"
            onClick={
              deleteCurrentDocument
            }
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            🗑️ Delete
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Document heading */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-8 text-white shadow-lg">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            {document.document_type ||
              "Official document"}
          </span>

          <h1 className="mt-5 text-3xl font-bold md:text-4xl">
            {document.subject ||
              "Saved letter"}
          </h1>

          <p className="mt-3 text-purple-100">
            From:{" "}
            <strong className="text-white">
              {document.sender ||
                "Unknown sender"}
            </strong>
          </p>

          <p className="mt-2 text-sm text-purple-200">
            Scanned{" "}
            {formatDate(
              document.created_at
            )}
          </p>
        </section>

        {/* Important information */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              What is this about?
            </p>

            <p className="mt-3 leading-7 text-slate-700">
              {document.summary ||
                "No summary was saved for this document."}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              What do I need to do?
            </p>

            <p className="mt-3 leading-7 text-slate-700">
              {document.explanation ||
                "No additional instructions were saved for this document."}
            </p>
          </div>
        </section>

        {/* Saved original letter text */}
        {document.original_text && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  📄 Original letter
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Saved letter text
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This is the original text saved when this letter was scanned. You do not need to scan the letter again to read it.
                </p>
              </div>
            </div>

            <div className="mt-5 max-h-[600px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                {document.original_text}
              </p>
            </div>
          </section>
        )}

        {/* Consequences */}
        {document.consequences && (
          <section className="mt-5 rounded-3xl border border-orange-200 bg-orange-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-700">
              ⚠️ If you do nothing
            </p>

            <p className="mt-3 leading-7 text-orange-900">
              {
                document.consequences
              }
            </p>
          </section>
        )}

        {/* Document metadata */}
        <section className="mt-5 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            📋 Letter information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Sender
              </p>

              <p className="mt-1 font-semibold">
                {document.sender ||
                  "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Importance
              </p>

              <p className="mt-1 font-semibold">
                {document.importance ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Reply needed
              </p>

              <p className="mt-1 font-semibold">
                {document.reply_needed
                  ? "Yes"
                  : "Not identified"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Appointment
              </p>

              <p className="mt-1 font-semibold">
                {document.appointment_needed
                  ? "Mentioned"
                  : "Not identified"}
              </p>
            </div>
          </div>

          {document.official_url && (
            <a
              href={
                document.official_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
            >
              🌐 Open official website
            </a>
          )}
        </section>

        {/* Reply */}
        <section className="mt-8 rounded-3xl border bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                Netherlands Guide AI
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                💬 Reply to this letter
              </h2>

              <p className="mt-2 max-w-2xl leading-6 text-slate-600">
                Speak naturally in your own language. Gemini will understand what you want to say and turn it into a professional Dutch reply.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Replying to
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {document.sender ||
                  "Unknown sender"}
              </p>
            </div>
          </div>

          {/* Voice controls */}
          <div className="mt-7 rounded-3xl border border-purple-200 bg-purple-50 p-6">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl ${
                  recording
                    ? "animate-pulse bg-red-500 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                {recording
                  ? "🎙️"
                  : "🎤"}
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {recording
                  ? "I'm listening..."
                  : processingVoice
                  ? "Creating your reply..."
                  : "Speak your reply"}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                {recording
                  ? "Say what you want to tell the sender. You can speak naturally in your preferred language."
                  : processingVoice
                  ? "Gemini is understanding your message and preparing the Dutch version."
                  : "Press the microphone and say what you want to communicate."}
              </p>

              <button
                type="button"
                onClick={
                  recording
                    ? stopVoiceReply
                    : startVoiceReply
                }
                disabled={
                  processingVoice
                }
                className={`mt-6 rounded-2xl px-7 py-4 font-bold text-white shadow-sm transition ${
                  recording
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {recording
                  ? "⏹️ Stop recording"
                  : processingVoice
                  ? "🤖 Processing..."
                  : "🎤 Start voice reply"}
              </button>

              {voiceMessage && (
                <p className="mt-4 text-sm font-medium text-purple-800">
                  {voiceMessage}
                </p>
              )}
            </div>
          </div>

          {/* Reply draft */}
          {replyDraft && (
            <div className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    🇳🇱 Dutch reply
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Review and edit this before sending.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={
                      speakReply
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    🔊 Listen
                  </button>

                  <button
                    type="button"
                    onClick={
                      stopSpeaking
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ⏹ Stop
                  </button>

                  <button
                    type="button"
                    onClick={
                      copyReply
                    }
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    {copied
                      ? "✓ Copied"
                      : "📋 Copy"}
                  </button>
                </div>
              </div>

              <textarea
                value={
                  replyDraft
                }
                onChange={(event) =>
                  setReplyDraft(
                    event.target.value
                  )
                }
                rows={12}
                className="mt-5 w-full rounded-2xl border border-slate-300 bg-white p-5 leading-7 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />

              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  💡 Before sending
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Check the names, dates, references and other important details before sending your reply.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/administration"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Back to My Administration
          </Link>
        </div>
      </div>
    </main>
  );
}