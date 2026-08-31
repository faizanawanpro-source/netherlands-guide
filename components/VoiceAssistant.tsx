"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name?: string;
  age?: string;
  city?: string;
  language?: string;
  profile?: string;
  hasFamily?: "yes" | "no";
  familyMembers?: string[];
  documents?: string[];
};

type GeminiMessage = {
  setupComplete?: unknown;

  error?: {
    message?: string;
  };

  serverContent?: {
    modelTurn?: {
      parts?: Array<{
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
      }>;
    };

    inputTranscription?: {
      text?: string;
    };

    outputTranscription?: {
      text?: string;
    };

    interrupted?: boolean;
    turnComplete?: boolean;
  };

  toolCall?: {
    functionCalls?: Array<{
      id?: string;
      name?: string;
      args?: {
        path?: string;
      };
    }>;
  };
};

const ALLOWED_PATHS = new Set([
  "/dashboard",
  "/dutch-phone-number",
  "/housing",
  "/documents",
  "/healthcare",
  "/money",
  "/work",
  "/study",
  "/transport",
  "/municipality",
  "/vehicles",
  "/waste",
  "/explore",
  "/plan-day",
  "/trip-planner",
  "/scanner",
  "/what-do-i-do",
]);

export default function VoiceAssistant() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({});
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  const websocketRef =
    useRef<WebSocket | null>(null);

  const microphoneStreamRef =
    useRef<MediaStream | null>(null);

  const microphoneContextRef =
    useRef<AudioContext | null>(null);

  const microphoneSourceRef =
    useRef<MediaStreamAudioSourceNode | null>(null);

  const processorRef =
    useRef<ScriptProcessorNode | null>(null);

  const outputContextRef =
    useRef<AudioContext | null>(null);

  const nextAudioTimeRef =
    useRef(0);

  const audioSourcesRef =
    useRef<AudioBufferSourceNode[]>([]);

  const isNavigatingRef =
    useRef(false);

  const microphoneStartedRef =
    useRef(false);

  const greetingSentRef =
    useRef(false);

  /*
   * Prevent the same user sentence from
   * triggering navigation multiple times.
   */
  const lastNavigationTextRef =
    useRef("");

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "netherlandsGuideProfile"
        );

      if (saved) {
        setProfile(
          JSON.parse(saved)
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
  // CLEANUP ON UNMOUNT
  // ============================================================

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // ============================================================
  // LANGUAGE
  // ============================================================

  function getProfileLanguage() {
    const language =
      String(
        profile?.language ||
          "English"
      )
        .trim()
        .toLowerCase();

    if (
      language.includes("urdu") ||
      language.includes("اردو")
    ) {
      return "Urdu";
    }

    if (
      language.includes("dutch") ||
      language.includes("nederlands") ||
      language === "nl"
    ) {
      return "Dutch";
    }

    if (
      language.includes("german") ||
      language.includes("deutsch") ||
      language === "de"
    ) {
      return "German";
    }

    if (
      language.includes("french") ||
      language.includes("français") ||
      language === "fr"
    ) {
      return "French";
    }

    if (
      language.includes("spanish") ||
      language.includes("español") ||
      language === "es"
    ) {
      return "Spanish";
    }

    if (
      language.includes("arabic") ||
      language.includes("العربية") ||
      language === "ar"
    ) {
      return "Arabic";
    }

    if (
      language.includes("punjabi") ||
      language.includes("ਪੰਜਾਬੀ") ||
      language === "pa"
    ) {
      return "Punjabi";
    }

    if (
      language.includes("hindi") ||
      language.includes("हिन्दी") ||
      language.includes("हिंदी") ||
      language === "hi"
    ) {
      return "Hindi";
    }

    if (
      language.includes("turkish") ||
      language.includes("türkçe") ||
      language === "tr"
    ) {
      return "Turkish";
    }

    if (
      language.includes("ukrainian") ||
      language.includes("українська") ||
      language.includes("украинский") ||
      language === "uk"
    ) {
      return "Ukrainian";
    }

    if (
      language.includes("russian") ||
      language.includes("русский") ||
      language === "ru"
    ) {
      return "Russian";
    }

    if (
      language.includes("chinese") ||
      language.includes("中文") ||
      language.includes("普通话") ||
      language.includes("mandarin") ||
      language === "zh"
    ) {
      return "Chinese";
    }

    if (
      language.includes("pashto") ||
      language.includes("پښتو") ||
      language === "ps"
    ) {
      return "Pashto";
    }

    if (
      language.includes("farsi") ||
      language.includes("persian") ||
      language.includes("فارسی") ||
      language === "fa"
    ) {
      return "Farsi";
    }

    return "English";
  }

  // ============================================================
  // BASE64
  // ============================================================

  function arrayBufferToBase64(
    buffer: ArrayBuffer
  ) {
    const bytes =
      new Uint8Array(buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      const chunk =
        bytes.subarray(
          i,
          Math.min(
            i + chunkSize,
            bytes.length
          )
        );

      binary += String.fromCharCode(
        ...chunk
      );
    }

    return btoa(binary);
  }

  // ============================================================
  // FLOAT → PCM16
  // ============================================================

  function floatTo16BitPCM(
    input: Float32Array
  ) {
    const output =
      new Int16Array(
        input.length
      );

    for (
      let i = 0;
      i < input.length;
      i++
    ) {
      const sample =
        Math.max(
          -1,
          Math.min(
            1,
            input[i]
          )
        );

      output[i] =
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff;
    }

    return output.buffer;
  }

  // ============================================================
  // DOWNSAMPLE → 16 KHZ
  // ============================================================

  function downsampleTo16k(
    input: Float32Array,
    inputSampleRate: number
  ) {
    if (
      inputSampleRate === 16000
    ) {
      return input;
    }

    const ratio =
      inputSampleRate / 16000;

    const newLength =
      Math.round(
        input.length / ratio
      );

    const result =
      new Float32Array(
        newLength
      );

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (
      offsetResult <
      result.length
    ) {
      const nextOffsetBuffer =
        Math.round(
          (offsetResult + 1) *
            ratio
        );

      let accum = 0;
      let count = 0;

      for (
        let i = offsetBuffer;
        i <
          nextOffsetBuffer &&
        i < input.length;
        i++
      ) {
        accum += input[i];
        count++;
      }

      result[offsetResult] =
        count > 0
          ? accum / count
          : 0;

      offsetResult++;

      offsetBuffer =
        nextOffsetBuffer;
    }

    return result;
  }

  // ============================================================
  // SEND AUDIO
  // ============================================================

  function sendAudioChunk(
    pcmBuffer: ArrayBuffer
  ) {
    const socket =
      websocketRef.current;

    if (
      !socket ||
      socket.readyState !==
        WebSocket.OPEN
    ) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          realtimeInput: {
            audio: {
              data:
                arrayBufferToBase64(
                  pcmBuffer
                ),
              mimeType:
                "audio/pcm;rate=16000",
            },
          },
        })
      );
    } catch (error) {
      console.error(
        "Could not send audio:",
        error
      );
    }
  }

  // ============================================================
  // STOP ALL AUDIO
  // ============================================================

  function stopAllAudio() {
    audioSourcesRef.current.forEach(
      (source) => {
        try {
          source.stop();
        } catch {}
      }
    );

    audioSourcesRef.current = [];

    nextAudioTimeRef.current = 0;

    setSpeaking(false);
  }

  // ============================================================
  // PLAY GEMINI AUDIO
  // ============================================================

  async function playAudio(
    base64Audio: string
  ) {
    try {
      let context =
        outputContextRef.current;

      if (!context) {
        context =
          new AudioContext({
            sampleRate: 24000,
          });

        outputContextRef.current =
          context;
      }

      if (
        context.state ===
        "suspended"
      ) {
        await context.resume();
      }

      const binary =
        atob(base64Audio);

      const bytes =
        new Uint8Array(
          binary.length
        );

      for (
        let i = 0;
        i < binary.length;
        i++
      ) {
        bytes[i] =
          binary.charCodeAt(i);
      }

      const pcm =
        new Int16Array(
          bytes.buffer
        );

      const audioBuffer =
        context.createBuffer(
          1,
          pcm.length,
          24000
        );

      const channel =
        audioBuffer.getChannelData(
          0
        );

      for (
        let i = 0;
        i < pcm.length;
        i++
      ) {
        channel[i] =
          pcm[i] / 32768;
      }

      const source =
        context.createBufferSource();

      source.buffer =
        audioBuffer;

      source.connect(
        context.destination
      );

      const now =
        context.currentTime;

      if (
        nextAudioTimeRef.current <
        now
      ) {
        nextAudioTimeRef.current =
          now;
      }

      source.start(
        nextAudioTimeRef.current
      );

      audioSourcesRef.current.push(
        source
      );

      nextAudioTimeRef.current +=
        audioBuffer.duration;

      setSpeaking(true);

      source.onended = () => {
        audioSourcesRef.current =
          audioSourcesRef.current.filter(
            (item) =>
              item !== source
          );

        if (
          audioSourcesRef.current
            .length === 0
        ) {
          setSpeaking(false);
        }
      };
    } catch (error) {
      console.error(
        "Audio playback error:",
        error
      );
    }
  }

  // ============================================================
  // SMART LOCAL NAVIGATION
  // ============================================================
  //
  // This is the important part.
  //
  // We do NOT depend only on Gemini's function call.
  // If the user's transcription clearly matches a section,
  // we navigate directly from the browser.
  //
  // This means:
  //
  // "I don't know anything about housing"
  // → /housing
  //
  // "What should I do about transport?"
  // → /transport
  //
  // "I don't understand documents"
  // → /documents
  //
  // ============================================================

  function detectNavigationPath(
    text: string
  ): string | null {
    if (!text) {
      return null;
    }

    const normalized =
      text
        .toLowerCase()
        .trim();

    if (!normalized) {
      return null;
    }

    // ----------------------------------------------------------
    // HOUSING
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "housing"
      ) ||
      normalized.includes(
        "house"
      ) ||
      normalized.includes(
        "apartment"
      ) ||
      normalized.includes(
        "room"
      ) ||
      normalized.includes(
        "rent"
      ) ||
      normalized.includes(
        "rental"
      ) ||
      normalized.includes(
        "woning"
      ) ||
      normalized.includes(
        "huis"
      ) ||
      normalized.includes(
        "huur"
      ) ||
      normalized.includes(
        "kamer"
      )
    ) {
      return "/housing";
    }

    // ----------------------------------------------------------
    // TRANSPORT
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "transport"
      ) ||
      normalized.includes(
        "public transport"
      ) ||
      normalized.includes(
        "bus"
      ) ||
      normalized.includes(
        "train"
      ) ||
      normalized.includes(
        "tram"
      ) ||
      normalized.includes(
        "metro"
      ) ||
      normalized.includes(
        "ovpay"
      ) ||
      normalized.includes(
        "ov-chipkaart"
      ) ||
      normalized.includes(
        "ov chipkaart"
      ) ||
      normalized.includes(
        "ns"
      ) ||
      normalized.includes(
        "openbaar vervoer"
      ) ||
      normalized.includes(
        "trein"
      )
    ) {
      return "/transport";
    }

    // ----------------------------------------------------------
    // PHONE / SIM
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "phone number"
      ) ||
      normalized.includes(
        "dutch number"
      ) ||
      normalized.includes(
        "sim card"
      ) ||
      normalized.includes(
        "sim"
      ) ||
      normalized.includes(
        "mobile number"
      ) ||
      normalized.includes(
        "telefoonnummer"
      ) ||
      normalized.includes(
        "simkaart"
      )
    ) {
      return "/dutch-phone-number";
    }

    // ----------------------------------------------------------
    // DOCUMENTS / BSN / DIGID
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "document"
      ) ||
      normalized.includes(
        "documents"
      ) ||
      normalized.includes(
        "bsn"
      ) ||
      normalized.includes(
        "digid"
      ) ||
      normalized.includes(
        "digi d"
      ) ||
      normalized.includes(
        "residence permit"
      ) ||
      normalized.includes(
        "residence card"
      ) ||
      normalized.includes(
        "passport"
      ) ||
      normalized.includes(
        "letter"
      ) ||
      normalized.includes(
        "documenten"
      ) ||
      normalized.includes(
        "brief"
      )
    ) {
      return "/documents";
    }

    // ----------------------------------------------------------
    // HEALTHCARE
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "healthcare"
      ) ||
      normalized.includes(
        "health care"
      ) ||
      normalized.includes(
        "doctor"
      ) ||
      normalized.includes(
        "hospital"
      ) ||
      normalized.includes(
        "huisarts"
      ) ||
      normalized.includes(
        "dokter"
      ) ||
      normalized.includes(
        "zorgverzekering"
      ) ||
      normalized.includes(
        "health insurance"
      ) ||
      normalized.includes(
        "medicine"
      ) ||
      normalized.includes(
        "medication"
      ) ||
      normalized.includes(
        "apotheek"
      ) ||
      normalized.includes(
        "pharmacy"
      )
    ) {
      return "/healthcare";
    }

    // ----------------------------------------------------------
    // MONEY
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "money"
      ) ||
      normalized.includes(
        "bank"
      ) ||
      normalized.includes(
        "banking"
      ) ||
      normalized.includes(
        "tax"
      ) ||
      normalized.includes(
        "taxes"
      ) ||
      normalized.includes(
        "benefit"
      ) ||
      normalized.includes(
        "benefits"
      ) ||
      normalized.includes(
        "allowance"
      ) ||
      normalized.includes(
        "toeslag"
      ) ||
      normalized.includes(
        "belasting"
      ) ||
      normalized.includes(
        "geld"
      ) ||
      normalized.includes(
        "bankrekening"
      )
    ) {
      return "/money";
    }

    // ----------------------------------------------------------
    // WORK
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "work"
      ) ||
      normalized.includes(
        "job"
      ) ||
      normalized.includes(
        "employment"
      ) ||
      normalized.includes(
        "salary"
      ) ||
      normalized.includes(
        "salaris"
      ) ||
      normalized.includes(
        "baan"
      ) ||
      normalized.includes(
        "werken"
      ) ||
      normalized.includes(
        "werk"
      )
    ) {
      return "/work";
    }

    // ----------------------------------------------------------
    // STUDY
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "study"
      ) ||
      normalized.includes(
        "studying"
      ) ||
      normalized.includes(
        "school"
      ) ||
      normalized.includes(
        "university"
      ) ||
      normalized.includes(
        "college"
      ) ||
      normalized.includes(
        "education"
      ) ||
      normalized.includes(
        "student"
      ) ||
      normalized.includes(
        "studie"
      ) ||
      normalized.includes(
        "opleiding"
      ) ||
      normalized.includes(
        "universiteit"
      )
    ) {
      return "/study";
    }

    // ----------------------------------------------------------
    // MUNICIPALITY
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "municipality"
      ) ||
      normalized.includes(
        "gemeente"
      ) ||
      normalized.includes(
        "registration"
      ) ||
      normalized.includes(
        "register"
      ) ||
      normalized.includes(
        "registering"
      ) ||
      normalized.includes(
        "gemeentehuis"
      )
    ) {
      return "/municipality";
    }

    // ----------------------------------------------------------
    // VEHICLES / DRIVING / PARKING
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "car"
      ) ||
      normalized.includes(
        "driving"
      ) ||
      normalized.includes(
        "driving licence"
      ) ||
      normalized.includes(
        "driving license"
      ) ||
      normalized.includes(
        "parking"
      ) ||
      normalized.includes(
        "vehicle"
      ) ||
      normalized.includes(
        "auto"
      ) ||
      normalized.includes(
        "rijbewijs"
      ) ||
      normalized.includes(
        "parkeren"
      )
    ) {
      return "/vehicles";
    }

    // ----------------------------------------------------------
    // WASTE
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "waste"
      ) ||
      normalized.includes(
        "trash"
      ) ||
      normalized.includes(
        "garbage"
      ) ||
      normalized.includes(
        "recycling"
      ) ||
      normalized.includes(
        "afval"
      ) ||
      normalized.includes(
        "vuilnis"
      ) ||
      normalized.includes(
        "recycle"
      )
    ) {
      return "/waste";
    }

    // ----------------------------------------------------------
    // EXPLORE
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "things to do"
      ) ||
      normalized.includes(
        "activities"
      ) ||
      normalized.includes(
        "places to visit"
      ) ||
      normalized.includes(
        "what can I do"
      ) ||
      normalized.includes(
        "explore"
      ) ||
      normalized.includes(
        "activiteiten"
      ) ||
      normalized.includes(
        "uitjes"
      )
    ) {
      return "/explore";
    }

    // ----------------------------------------------------------
    // PLAN DAY
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "plan my day"
      ) ||
      normalized.includes(
        "plan today"
      ) ||
      normalized.includes(
        "what should I do today"
      ) ||
      normalized.includes(
        "today"
      ) ||
      normalized.includes(
        "vandaag"
      ) ||
      normalized.includes(
        "dag plannen"
      )
    ) {
      return "/plan-day";
    }

    // ----------------------------------------------------------
    // TRIP PLANNER
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "trip"
      ) ||
      normalized.includes(
        "travel"
      ) ||
      normalized.includes(
        "trip planner"
      ) ||
      normalized.includes(
        "holiday"
      ) ||
      normalized.includes(
        "vacation"
      ) ||
      normalized.includes(
        "reis"
      ) ||
      normalized.includes(
        "vakantie"
      )
    ) {
      return "/trip-planner";
    }

    // ----------------------------------------------------------
    // SCANNER / LETTER
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "scan this"
      ) ||
      normalized.includes(
        "scan a letter"
      ) ||
      normalized.includes(
        "scan document"
      ) ||
      normalized.includes(
        "what does this letter say"
      ) ||
      normalized.includes(
        "what does this mean"
      )
    ) {
      return "/scanner";
    }

    // ----------------------------------------------------------
    // WHAT DO I DO
    // ----------------------------------------------------------

    if (
      normalized.includes(
        "what should i do"
      ) ||
      normalized.includes(
        "what do i do"
      ) ||
      normalized.includes(
        "what can i do"
      ) ||
      normalized.includes(
        "i don't know what to do"
      ) ||
      normalized.includes(
        "i don't understand"
      ) ||
      normalized.includes(
        "help me"
      ) ||
      normalized.includes(
        "wat moet ik doen"
      )
    ) {
      return "/what-do-i-do";
    }

    return null;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  function navigateToPage(
    path: string
  ) {
    if (
      !ALLOWED_PATHS.has(path)
    ) {
      console.error(
        "Blocked navigation:",
        path
      );

      return false;
    }

    if (
      isNavigatingRef.current
    ) {
      return false;
    }

    isNavigatingRef.current =
      true;

    console.log(
      "🧭 ACTUALLY NAVIGATING:",
      path
    );

    /*
     * Stop queued Gemini audio so the
     * assistant doesn't continue talking
     * while the page changes.
     */
    stopAllAudio();

    try {
      router.push(path);
    } catch (error) {
      console.error(
        "Router navigation failed:",
        error
      );

      isNavigatingRef.current =
        false;

      return false;
    }

    window.setTimeout(() => {
      isNavigatingRef.current =
        false;
    }, 1500);

    return true;
  }

  // ============================================================
  // NAVIGATE FROM USER'S TRANSCRIPTION
  // ============================================================

  function handleUserTranscription(
    text: string
  ) {
    if (!text) {
      return;
    }

    console.log(
      "👤 USER:",
      text
    );

    const normalized =
      text
        .toLowerCase()
        .trim();

    /*
     * Ignore exactly repeated
     * transcription events.
     */
    if (
      normalized ===
      lastNavigationTextRef.current
    ) {
      return;
    }

    lastNavigationTextRef.current =
      normalized;

    const path =
      detectNavigationPath(
        normalized
      );

    if (!path) {
      return;
    }

    console.log(
      "🧭 LOCAL NAVIGATION DETECTED:",
      {
        text,
        path,
      }
    );

    navigateToPage(path);
  }

  // ============================================================
  // TOOL RESPONSE
  // ============================================================

  function sendToolResponse(
    id: string,
    name: string,
    path: string,
    success: boolean
  ) {
    const socket =
      websocketRef.current;

    if (
      !socket ||
      socket.readyState !==
        WebSocket.OPEN
    ) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          toolResponse: {
            functionResponses: [
              {
                id,
                name,
                response: {
                  success,
                  path,
                },
              },
            ],
          },
        })
      );

      console.log(
        "📤 Tool response sent:",
        {
          id,
          path,
          success,
        }
      );
    } catch (error) {
      console.error(
        "Could not send tool response:",
        error
      );
    }
  }

  // ============================================================
  // MICROPHONE
  // ============================================================

  async function startMicrophoneProcessing(
    stream: MediaStream
  ) {
    if (
      microphoneStartedRef.current
    ) {
      return;
    }

    microphoneStartedRef.current =
      true;

    try {
      const context =
        new AudioContext();

      microphoneContextRef.current =
        context;

      await context.resume();

      const source =
        context.createMediaStreamSource(
          stream
        );

      microphoneSourceRef.current =
        source;

      const processor =
        context.createScriptProcessor(
          4096,
          1,
          1
        );

      processorRef.current =
        processor;

      processor.onaudioprocess =
        (event) => {
          const input =
            event.inputBuffer.getChannelData(
              0
            );

          const downsampled =
            downsampleTo16k(
              input,
              context.sampleRate
            );

          const pcm =
            floatTo16BitPCM(
              downsampled
            );

          sendAudioChunk(pcm);

          setListening(true);
        };

      source.connect(
        processor
      );

      processor.connect(
        context.destination
      );

      console.log(
        "🎤 Microphone streaming started."
      );
    } catch (error) {
      microphoneStartedRef.current =
        false;

      console.error(
        "Microphone processing error:",
        error
      );

      throw error;
    }
  }

  // ============================================================
  // GEMINI MESSAGE
  // ============================================================

  async function handleGeminiMessage(
    data: GeminiMessage
  ) {
    console.log(
      "📩 Gemini:",
      data
    );

    // ----------------------------------------------------------
    // ERROR
    // ----------------------------------------------------------

    if (data.error) {
      console.error(
        "Gemini server error:",
        data.error
      );

      setError(
        data.error.message ||
          "Gemini returned an error."
      );

      return;
    }

    // ----------------------------------------------------------
    // SETUP COMPLETE
    // ----------------------------------------------------------

    if (data.setupComplete) {
      console.log(
        "✅ Gemini setup complete."
      );

      setConnected(true);
      setConnecting(false);

      const stream =
        microphoneStreamRef.current;

      if (stream) {
        try {
          await startMicrophoneProcessing(
            stream
          );
        } catch (error) {
          console.error(
            "Could not start microphone:",
            error
          );

          setError(
            "Could not start microphone streaming."
          );
        }
      }

      /*
       * ONE greeting only.
       */
      if (
        !greetingSentRef.current
      ) {
        greetingSentRef.current =
          true;

        const socket =
          websocketRef.current;

        if (
          socket &&
          socket.readyState ===
            WebSocket.OPEN
        ) {
          socket.send(
            JSON.stringify({
              clientContent: {
                turns: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `
Give one very short, warm welcome.

Speak only in ${getProfileLanguage()}.

This is the first greeting of the session.

Do not explain anything.

Do not mention AI, technology, APIs, code or systems.

Use the language from your first word.

Keep it natural and conversational.
                        `.trim(),
                      },
                    ],
                  },
                ],
                turnComplete: true,
              },
            })
          );

          console.log(
            "👋 One-time greeting requested."
          );
        }
      }

      return;
    }

    // ----------------------------------------------------------
    // INTERRUPTION
    // ----------------------------------------------------------

    if (
      data.serverContent?.interrupted
    ) {
      console.log(
        "🛑 Gemini interrupted."
      );

      stopAllAudio();
    }

    // ----------------------------------------------------------
    // AUDIO
    // ----------------------------------------------------------

    const audioParts =
      data.serverContent
        ?.modelTurn
        ?.parts || [];

    for (
      const part of audioParts
    ) {
      const inlineData =
        part?.inlineData;

      if (
        inlineData?.data &&
        inlineData?.mimeType?.startsWith(
          "audio/pcm"
        )
      ) {
        await playAudio(
          inlineData.data
        );
      }
    }

    // ----------------------------------------------------------
    // INPUT TRANSCRIPTION
    // ----------------------------------------------------------

    const inputText =
      data.serverContent
        ?.inputTranscription
        ?.text;

    if (inputText) {
      handleUserTranscription(
        inputText
      );
    }

    // ----------------------------------------------------------
    // OUTPUT TRANSCRIPTION
    // ----------------------------------------------------------

    const outputText =
      data.serverContent
        ?.outputTranscription
        ?.text;

    if (outputText) {
      console.log(
        "🤖 GEMINI:",
        outputText
      );
    }

    // ----------------------------------------------------------
    // FUNCTION CALL
    // ----------------------------------------------------------

    const functionCalls =
      data.toolCall
        ?.functionCalls;

    if (functionCalls) {
      console.log(
        "🧭 FUNCTION CALLS RECEIVED:",
        functionCalls
      );

      for (
        const functionCall of
          functionCalls
      ) {
        if (
          functionCall.name !==
          "navigate_to_page"
        ) {
          continue;
        }

        const path =
          functionCall.args
            ?.path;

        const id =
          functionCall.id;

        console.log(
          "🧭 GEMINI NAVIGATION REQUEST:",
          {
            path,
            id,
          }
        );

        if (
          !id ||
          typeof path !==
            "string"
        ) {
          console.error(
            "Invalid navigation function call."
          );

          continue;
        }

        const success =
          navigateToPage(path);

        sendToolResponse(
          id,
          "navigate_to_page",
          path,
          success
        );
      }
    }

    // ----------------------------------------------------------
    // TURN COMPLETE
    // ----------------------------------------------------------

    if (
      data.serverContent
        ?.turnComplete
    ) {
      setListening(false);
    }
  }

  // ============================================================
  // PARSE WEBSOCKET
  // ============================================================

  async function parseWebSocketMessage(
    event: MessageEvent
  ) {
    try {
      if (
        typeof event.data ===
        "string"
      ) {
        return JSON.parse(
          event.data
        );
      }

      if (
        typeof Blob !==
          "undefined" &&
        event.data instanceof
          Blob
      ) {
        const text =
          await event.data.text();

        return JSON.parse(text);
      }

      if (
        event.data instanceof
        ArrayBuffer
      ) {
        const text =
          new TextDecoder().decode(
            new Uint8Array(
              event.data
            )
          );

        return JSON.parse(text);
      }

      if (
        event.data &&
        typeof event.data ===
          "object"
      ) {
        console.warn(
          "Unsupported WebSocket data:",
          event.data
        );

        return null;
      }

      return null;
    } catch (error) {
      console.error(
        "❌ Could not decode Gemini WebSocket message:",
        error
      );

      return null;
    }
  }

  // ============================================================
  // START VOICE
  // ============================================================

  async function startVoice() {
    if (
      connecting ||
      connected
    ) {
      return;
    }

    setError("");
    setConnecting(true);

    microphoneStartedRef.current =
      false;

    greetingSentRef.current =
      false;

    lastNavigationTextRef.current =
      "";

    try {
      // --------------------------------------------------------
      // MICROPHONE
      // --------------------------------------------------------

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            },
          }
        );

      microphoneStreamRef.current =
        stream;

      console.log(
        "🎤 Microphone permission granted."
      );

      // --------------------------------------------------------
      // TOKEN
      // --------------------------------------------------------

      const tokenResponse =
        await fetch(
          "/api/realtime",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              profile,
            }),
          }
        );

      const tokenData =
        await tokenResponse.json();

      if (
        !tokenResponse.ok
      ) {
        throw new Error(
          tokenData?.error ||
            "Could not create Gemini realtime token."
        );
      }

      if (
        !tokenData?.token
      ) {
        throw new Error(
          "Gemini realtime token was not returned."
        );
      }

      console.log(
        "🔑 Ephemeral token received."
      );

      // --------------------------------------------------------
      // WEBSOCKET
      // --------------------------------------------------------

      const socketUrl =
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
          tokenData.token
        )}`;

      console.log(
        "🔌 Connecting to Gemini Live..."
      );

      const socket =
        new WebSocket(
          socketUrl
        );

      websocketRef.current =
        socket;

      // --------------------------------------------------------
      // OPEN
      // --------------------------------------------------------

      socket.onopen = () => {
        console.log(
          "✅ WebSocket opened."
        );

        try {
          socket.send(
            JSON.stringify({
              setup: {
                model:
                  `models/${tokenData.model}`,

                generationConfig: {
                  responseModalities: [
                    "AUDIO",
                  ],

                  temperature: 0.7,
                },

                inputAudioTranscription:
                  {},

                outputAudioTranscription:
                  {},

                realtimeInputConfig: {
                  automaticActivityDetection:
                    {},
                },

                tools: [
                  {
                    functionDeclarations:
                      [
                        {
                          name:
                            "navigate_to_page",

                          description:
                            `
Navigate the user to a relevant Netherlands Guide page.

Use this when the user clearly needs information or help from one of the available sections.

Examples:

If the user says:
"I don't know anything about housing"
"I need help finding a place to live"
"I don't understand housing in the Netherlands"

Navigate to /housing.

If the user says:
"What should I do about transport?"
"I don't understand public transport"
"How does OVpay work?"

Navigate to /transport.

If the user says:
"I don't understand my documents"
"I need help with BSN or DigiD"

Navigate to /documents.

If the user says:
"I need help with healthcare"
"I don't know how doctors work here"

Navigate to /healthcare.

If the user says:
"I don't understand money, taxes or benefits"

Navigate to /money.

If the user says:
"I need help finding a job"

Navigate to /work.

If the user says:
"I don't understand studying here"

Navigate to /study.

If the user says:
"I need help with registration or the municipality"

Navigate to /municipality.

If the user says:
"I need help with my car, driving or parking"

Navigate to /vehicles.

If the user says:
"I don't understand waste collection"

Navigate to /waste.

Do not navigate for casual conversation.

Do not navigate merely because a random word matches.

When a relevant section is clearly needed, navigation is useful.
                          `.trim(),

                          parameters: {
                            type:
                              "OBJECT",

                            properties: {
                              path: {
                                type:
                                  "STRING",

                                enum: [
                                  "/dashboard",
                                  "/dutch-phone-number",
                                  "/housing",
                                  "/documents",
                                  "/healthcare",
                                  "/money",
                                  "/work",
                                  "/study",
                                  "/transport",
                                  "/municipality",
                                  "/vehicles",
                                  "/waste",
                                  "/explore",
                                  "/plan-day",
                                  "/trip-planner",
                                  "/scanner",
                                  "/what-do-i-do",
                                ],
                              },
                            },

                            required: [
                              "path",
                            ],
                          },
                        },
                      ],
                  },
                ],
              },
            })
          );

          console.log(
            "📤 Setup message sent."
          );
        } catch (error) {
          console.error(
            "Could not send setup:",
            error
          );

          setError(
            "Could not initialize Gemini Live."
          );
        }
      };

      // --------------------------------------------------------
      // MESSAGE
      // --------------------------------------------------------

      socket.onmessage =
        async (event) => {
          const data =
            await parseWebSocketMessage(
              event
            );

          if (!data) {
            return;
          }

          await handleGeminiMessage(
            data
          );
        };

      // --------------------------------------------------------
      // ERROR
      // --------------------------------------------------------

      socket.onerror =
        (event) => {
          console.error(
            "❌ WebSocket error:",
            event
          );

          setError(
            "Gemini voice connection encountered a problem."
          );

          setConnecting(false);
        };

      // --------------------------------------------------------
      // CLOSE
      // --------------------------------------------------------

      socket.onclose =
        (event) => {
          console.log(
            "🔴 WebSocket closed.",
            {
              code: event.code,
              reason: event.reason,
            }
          );

          setConnected(false);
          setConnecting(false);
          setListening(false);

          stopAllAudio();

          microphoneStartedRef.current =
            false;
        };
    } catch (error) {
      console.error(
        "❌ Voice startup error:",
        error
      );

      cleanup();

      setConnecting(false);
      setConnected(false);
      setListening(false);
      setSpeaking(false);

      setError(
        error instanceof Error
          ? error.message
          : "Could not start the voice assistant."
      );
    }
  }

  // ============================================================
  // STOP SPEAKING
  // ============================================================

  function stopSpeaking() {
    stopAllAudio();
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  function cleanup() {
    try {
      stopAllAudio();

      processorRef.current?.disconnect();

      microphoneSourceRef.current?.disconnect();

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      microphoneStreamRef.current =
        null;

      if (
        microphoneContextRef.current
      ) {
        microphoneContextRef.current
          .close()
          .catch(() => {});
      }

      microphoneContextRef.current =
        null;

      if (
        outputContextRef.current
      ) {
        outputContextRef.current
          .close()
          .catch(() => {});
      }

      outputContextRef.current =
        null;

      if (
        websocketRef.current
      ) {
        try {
          websocketRef.current.close();
        } catch {}
      }

      websocketRef.current =
        null;

      processorRef.current =
        null;

      microphoneSourceRef.current =
        null;

      microphoneStartedRef.current =
        false;

      greetingSentRef.current =
        false;

      lastNavigationTextRef.current =
        "";
    } catch (error) {
      console.error(
        "Cleanup error:",
        error
      );
    }
  }

  // ============================================================
  // DISCONNECT
  // ============================================================

  function disconnectVoice() {
    cleanup();

    setConnected(false);
    setConnecting(false);
    setListening(false);
    setSpeaking(false);

    isNavigatingRef.current =
      false;
  }

  // ============================================================
  // BUTTON
  // ============================================================

  function handleVoiceButton() {
    setError("");

    if (speaking) {
      stopSpeaking();
      return;
    }

    if (connected) {
      disconnectVoice();
      return;
    }

    startVoice();
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <button
        type="button"
        onClick={
          handleVoiceButton
        }
        disabled={connecting}
        aria-label={
          connecting
            ? "Connecting"
            : speaking
            ? "Stop speaking"
            : connected
            ? "Turn voice off"
            : "Turn voice on"
        }
        className={`
          fixed
          bottom-6
          right-6
          z-[9999]
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          text-3xl
          shadow-2xl
          transition-all
          duration-200

          ${
            speaking
              ? "bg-green-500 text-white shadow-green-500/50 ring-4 ring-green-200"
              : listening
              ? "animate-pulse bg-orange-500 text-white shadow-orange-500/40 ring-4 ring-orange-200"
              : connecting
              ? "cursor-wait bg-indigo-600 text-white"
              : connected
              ? "bg-orange-500 text-white hover:scale-110 hover:bg-orange-600 shadow-orange-500/40"
              : "bg-orange-500 text-white hover:scale-110 hover:bg-orange-600"
          }
        `}
      >
        {connecting
          ? "..."
          : speaking
          ? "🔊"
          : listening
          ? "🎤"
          : connected
          ? "⏹"
          : "🎤"}
      </button>

      {connecting && (
        <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-600 shadow-xl">
          Connecting...
        </div>
      )}

      {connected &&
        listening &&
        !speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-500 shadow-xl">
            🎤 I'm listening
          </div>
        )}

      {connected &&
        speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-green-600 shadow-xl">
            🔊 I'm here with you
          </div>
        )}

      {connected &&
        !listening &&
        !speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-500 shadow-xl">
            🎤 I'm here whenever you need me
          </div>
        )}

      {error && (
        <div className="fixed bottom-24 right-6 z-[9998] max-w-xs rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-xl">
          {error}
        </div>
      )}
    </>
  );
}