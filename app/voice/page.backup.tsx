"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name?: string;
  age?: string;
  profile?: string;
  city?: string;
  language?: string;
};

type AIResponse = {
  reply?: string;
  destination?: string | null;
  error?: string;
};

export default function VoicePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({});
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem(
          "netherlandsGuideProfile"
        );

      if (savedProfile) {
        setProfile(
          JSON.parse(savedProfile)
        );
      }
    } catch (error) {
      console.error(
        "Could not load profile:",
        error
      );
    }
  }, []);

  // ============================================================
  // CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}

      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        try {
          recorder.stop();
        } catch {}
      }
    };
  }, []);

  // ============================================================
  // LANGUAGE
  // ============================================================

  function getSpeechLanguage(
    language?: string
  ) {
    switch (language) {
      case "Nederlands":
        return "nl-NL";

      case "اردو":
        return "ur-PK";

      case "हिन्दी":
        return "hi-IN";

      case "ਪੰਜਾਬੀ":
        return "pa-IN";

      case "العربية":
        return "ar-SA";

      case "Türkçe":
        return "tr-TR";

      case "Deutsch":
        return "de-DE";

      case "Français":
        return "fr-FR";

      case "Українська":
        return "uk-UA";

      case "English":
      default:
        return "en-US";
    }
  }

  // ============================================================
  // FIND BEST VOICE
  // ============================================================

  function findVoice(
    language?: string
  ): SpeechSynthesisVoice | null {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return null;
    }

    const voices =
      window.speechSynthesis.getVoices();

    if (!voices.length) {
      return null;
    }

    const speechLanguage =
      getSpeechLanguage(language);

    const exact =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() ===
          speechLanguage.toLowerCase()
      );

    if (exact) {
      return exact;
    }

    const languagePrefix =
      speechLanguage
        .split("-")[0]
        .toLowerCase();

    const matching =
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(languagePrefix)
      );

    return matching || null;
  }

  // ============================================================
  // SPEAK REPLY
  // ============================================================

  function speakReply(text: string) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    if (!text.trim()) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      const language =
        getSpeechLanguage(
          profile.language
        );

      utterance.lang = language;

      const voice = findVoice(
        profile.language
      );

      if (voice) {
        utterance.voice = voice;
      }

      /*
       * Keep the old natural voice behaviour.
       *
       * These values are intentionally conservative
       * so the voice does not sound rushed or distorted.
       */
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setSpeaking(true);

        console.log(
          "AI started speaking."
        );
      };

      utterance.onend = () => {
        setSpeaking(false);

        console.log(
          "AI finished speaking."
        );
      };

      utterance.onerror = (
        event
      ) => {
        setSpeaking(false);

        console.error(
          "Speech synthesis error:",
          event
        );
      };

      window.speechSynthesis.speak(
        utterance
      );
    } catch (error) {
      setSpeaking(false);

      console.error(
        "Could not speak response:",
        error
      );
    }
  }

  // ============================================================
  // START RECORDING
  // ============================================================

  async function startRecording() {
    setError("");
    setReply("");
    setTranscript("");
    setSpeaking(false);

    try {
      if (
        typeof navigator ===
          "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available on this device."
        );
      }

      if (
        typeof MediaRecorder ===
        "undefined"
      ) {
        throw new Error(
          "Voice recording is not supported on this device."
        );
      }

      console.log(
        "Requesting microphone permission..."
      );

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          }
        );

      console.log(
        "Microphone permission granted."
      );

      let mimeType = "";

      const supportedTypes = [
        "audio/mp4",
        "audio/webm;codecs=opus",
        "audio/webm",
      ];

      for (
        const type of supportedTypes
      ) {
        if (
          MediaRecorder.isTypeSupported(
            type
          )
        ) {
          mimeType = type;
          break;
        }
      }

      const recorder = mimeType
        ? new MediaRecorder(
            stream,
            {
              mimeType,
            }
          )
        : new MediaRecorder(
            stream
          );

      mediaRecorderRef.current =
        recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onerror = (
        event
      ) => {
        console.error(
          "MediaRecorder error:",
          event
        );

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        setRecording(false);

        setError(
          "There was a problem recording your voice."
        );
      };

      recorder.onstop = async () => {
        console.log(
          "Recording stopped."
        );

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        const actualType =
          recorder.mimeType ||
          mimeType ||
          "audio/mp4";

        const audioBlob =
          new Blob(
            audioChunksRef.current,
            {
              type: actualType,
            }
          );

        console.log(
          "Audio type:",
          actualType
        );

        console.log(
          "Audio size:",
          audioBlob.size
        );

        mediaRecorderRef.current =
          null;

        if (audioBlob.size === 0) {
          setError(
            "No audio was recorded. Please try again."
          );

          setProcessing(false);
          return;
        }

        await transcribeAudio(
          audioBlob
        );
      };

      recorder.start();

      setRecording(true);

      console.log(
        "Recording started:",
        recorder.mimeType
      );
    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );

      setRecording(false);

      setError(
        error instanceof Error
          ? error.message
          : "Could not access the microphone."
      );
    }
  }

  // ============================================================
  // STOP RECORDING
  // ============================================================

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state ===
      "recording"
    ) {
      console.log(
        "Stopping recording..."
      );

      setRecording(false);
      setProcessing(true);

      recorder.stop();
    }
  }

  // ============================================================
  // TRANSCRIBE AUDIO
  // ============================================================

  async function transcribeAudio(
    audioBlob: Blob
  ) {
    try {
      setProcessing(true);
      setError("");

      const extension =
        audioBlob.type.includes(
          "webm"
        )
          ? "webm"
          : "mp4";

      const audioFile =
        new File(
          [audioBlob],
          `voice.${extension}`,
          {
            type:
              audioBlob.type ||
              "audio/mp4",
          }
        );

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioFile
      );

      console.log(
        "Sending audio to transcription..."
      );

      const response =
        await fetch(
          "/api/transcribe",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "Transcription response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not transcribe your voice."
        );
      }

      const text =
        data?.text?.trim();

      if (!text) {
        throw new Error(
          "I couldn't understand what you said. Please try again."
        );
      }

      setTranscript(text);

      console.log(
        "Transcript:",
        text
      );

      await askAI(text);
    } catch (error) {
      console.error(
        "Transcription error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not understand your voice."
      );

      setProcessing(false);
    }
  }

  // ============================================================
  // ASK AI
  // ============================================================

  async function askAI(
    text: string
  ) {
    try {
      setProcessing(true);
      setError("");

      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: text,
              profile,
              conversation: [],
            }),
          }
        );

      const data: AIResponse =
        await response.json();

      console.log(
        "AI response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "The AI could not respond."
        );
      }

      const aiReply =
        data.reply?.trim();

      if (!aiReply) {
        throw new Error(
          "The AI returned an empty response."
        );
      }

      setReply(aiReply);

      setProcessing(false);

      /*
       * Speak first.
       *
       * Navigation happens afterwards so
       * the user can actually hear the answer.
       */
      speakReply(aiReply);

      if (
        data.destination &&
        data.destination.startsWith("/")
      ) {
        setTimeout(() => {
          router.push(
            data.destination as string
          );
        }, 3500);
      }
    } catch (error) {
      console.error(
        "AI error:",
        error
      );

      setProcessing(false);

      setError(
        error instanceof Error
          ? error.message
          : "The AI could not respond."
      );
    }
  }

  // ============================================================
  // VOICE BUTTON
  // ============================================================

  function handleVoiceButton() {
    if (processing) {
      return;
    }

    if (recording) {
      stopRecording();
      return;
    }

    if (speaking) {
      try {
        window.speechSynthesis.cancel();
      } catch {}

      setSpeaking(false);
      return;
    }

    startRecording();
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="font-bold text-slate-300 transition hover:text-white"
          >
            ← Dashboard
          </button>

          <div className="font-black">
            🇳🇱 Netherlands Guide
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center px-6 py-12">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-400">
          AI Voice Assistant
        </p>

        <h1 className="mt-4 text-center text-4xl font-black sm:text-6xl">
          Just talk to me.
        </h1>

        <p className="mt-5 max-w-xl text-center text-lg leading-8 text-slate-400">
          Speak naturally. I'll listen,
          understand you, and help you
          with everyday life in the
          Netherlands.
        </p>

        {/* VOICE BUTTON */}

        <button
          type="button"
          onClick={
            handleVoiceButton
          }
          disabled={processing}
          aria-label={
            recording
              ? "Stop recording"
              : speaking
              ? "Stop speaking"
              : "Start voice assistant"
          }
          className={`
            mt-12 flex h-40 w-40
            items-center justify-center
            rounded-full
            text-6xl
            shadow-2xl
            transition

            ${
              recording
                ? "animate-pulse bg-red-500"
                : speaking
                ? "bg-green-500"
                : processing
                ? "cursor-wait bg-indigo-600"
                : "bg-orange-500 hover:scale-105 hover:bg-orange-600"
            }
          `}
        >
          {recording
            ? "🔴"
            : speaking
            ? "🔊"
            : processing
            ? "🤖"
            : "🎤"}
        </button>

        {/* STATUS */}

        <div className="mt-8 text-center">
          {recording && (
            <div>
              <p className="font-bold text-red-400">
                🔴 I'm listening
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Tap the button when
                you're finished.
              </p>
            </div>
          )}

          {processing && (
            <div>
              <p className="font-bold text-indigo-400">
                🤖 Thinking...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Give me a moment.
              </p>
            </div>
          )}

          {speaking &&
            !processing && (
              <div>
                <p className="font-bold text-green-400">
                  🟢 I'm speaking
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Tap the button to stop.
                </p>
              </div>
            )}

          {!recording &&
            !processing &&
            !speaking && (
              <p className="text-slate-500">
                Tap 🎤 to start talking
              </p>
            )}
        </div>

        {/* TRANSCRIPT */}

        {transcript && (
          <div className="mt-10 w-full rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              You said
            </p>

            <p className="mt-2 leading-7 text-slate-200">
              {transcript}
            </p>
          </div>
        )}

        {/* AI RESPONSE */}

        {reply && (
          <div className="mt-4 w-full rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-orange-400">
              Netherlands Guide
            </p>

            <p className="mt-2 leading-7 text-slate-200">
              {reply}
            </p>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-8 w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center">
            <p className="text-sm font-bold text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* LANGUAGE */}

        <div className="mt-10 text-center text-xs text-slate-600">
          AI voice language:
          <span className="ml-1 font-bold text-slate-500">
            {profile.language ||
              "English"}
          </span>
        </div>

        {/* STOP SPEAKING */}

        {speaking && (
          <button
            type="button"
            onClick={() => {
              try {
                window.speechSynthesis.cancel();
              } catch {}

              setSpeaking(false);
            }}
            className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/20"
          >
            Stop speaking
          </button>
        )}
      </section>
    </main>
  );
}