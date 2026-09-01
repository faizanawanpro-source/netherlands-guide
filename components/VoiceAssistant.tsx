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

  const websocketRef = useRef<WebSocket | null>(null);

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

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (saved) {
        setProfile(JSON.parse(saved));
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
    const language = String(
      profile?.language || "English"
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
    const bytes = new Uint8Array(buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      const chunk = bytes.subarray(
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
    const output = new Int16Array(
      input.length
    );

    for (
      let i = 0;
      i < input.length;
      i++
    ) {
      const sample = Math.max(
        -1,
        Math.min(1, input[i])
      );

      output[i] =
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff;
    }

    return output.buffer;
  }

  // ============================================================
  // DOWNSAMPLE TO 16KHZ
  // ============================================================

  function downsampleTo16k(
    input: Float32Array,
    inputSampleRate: number
  ) {
    if (inputSampleRate === 16000) {
      return input;
    }

    const ratio =
      inputSampleRate / 16000;

    const newLength = Math.round(
      input.length / ratio
    );

    const result = new Float32Array(
      newLength
    );

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (
      offsetResult < result.length
    ) {
      const nextOffsetBuffer =
        Math.round(
          (offsetResult + 1) * ratio
        );

      let accum = 0;
      let count = 0;

      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer &&
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
        context = new AudioContext({
          sampleRate: 24000,
        });

        outputContextRef.current =
          context;
      }

      if (context.state === "suspended") {
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
  // NAVIGATION
  // ============================================================

  function navigateToPage(
    path: string
  ) {
    if (
      typeof path !== "string"
    ) {
      console.error(
        "Navigation path is not a string:",
        path
      );

      return false;
    }

    const cleanPath =
      path.trim();

    if (
      !ALLOWED_PATHS.has(cleanPath)
    ) {
      console.error(
        "Blocked navigation:",
        cleanPath
      );

      return false;
    }

    if (
      isNavigatingRef.current
    ) {
      console.log(
        "Navigation already in progress."
      );

      return false;
    }

    isNavigatingRef.current =
      true;

    console.log(
      "🧭 NAVIGATING:",
      cleanPath
    );

    // Stop current Gemini audio.
    stopAllAudio();

    try {
      router.push(cleanPath);

      // Also refresh the route state after navigation.
      router.refresh();

      window.setTimeout(() => {
        isNavigatingRef.current =
          false;
      }, 2000);

      return true;
    } catch (error) {
      console.error(
        "Navigation failed:",
        error
      );

      isNavigatingRef.current =
        false;

      return false;
    }
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
      console.error(
        "Cannot send tool response because WebSocket is closed."
      );

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
        "📤 Navigation tool response:",
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

      // --------------------------------------------------------
      // ONE GREETING
      // --------------------------------------------------------

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

Use the requested language from your first word.

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
            "👋 Greeting requested."
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
      console.log(
        "👤 USER:",
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

    // ==========================================================
    // NAVIGATION FUNCTION CALL
    // ==========================================================

    const functionCalls =
      data.toolCall
        ?.functionCalls;

    if (
      functionCalls &&
      functionCalls.length > 0
    ) {
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
          "🧭 NAVIGATION REQUEST FROM GEMINI:",
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
            "❌ Invalid navigation function call:",
            functionCall
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
  // PARSE WEBSOCKET MESSAGE
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
        event.data instanceof Blob
      ) {
        const text =
          await event.data.text();

        return JSON.parse(
          text
        );
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

        return JSON.parse(
          text
        );
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
      // EPHEMERAL TOKEN
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

      if (!tokenResponse.ok) {
        throw new Error(
          tokenData?.error ||
            "Could not create Gemini realtime token."
        );
      }

      if (!tokenData?.token) {
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

                // =================================================
                // NAVIGATION TOOL
                // =================================================

                tools: [
                  {
                    functionDeclarations:
                      [
                        {
                          name:
                            "navigate_to_page",

                          description:
                            `
You control navigation inside the Netherlands Guide application.

The user may speak ANY supported language.

You MUST understand the user's meaning regardless of the language they use.

When the user clearly needs information or help that belongs to one of the pages below, call this function.

IMPORTANT:
The URL paths are ALWAYS in English.
Never translate the URL path.
Never create a new URL.
Only use one of the exact enum values.

Navigation examples:

- If the user says they know nothing about housing, needs a home, asks about finding housing, renting, finding an apartment, or asks what to do about housing → "/housing"

- If the user asks about documents, BSN, DigiD, residence documents, letters, paperwork, or official documents → "/documents"

- If the user asks about healthcare, a doctor, huisarts, health insurance, hospital, or medical help → "/healthcare"

- If the user asks about money, banking, benefits, finances, taxes, or financial help → "/money"

- If the user asks about finding a job, working, employment, CV, salary, or work → "/work"

- If the user asks about studying, school, university, courses, or education → "/study"

- If the user asks what to do about transport, public transport, OV-chipkaart, trains, buses, trams, metro, cycling, or getting around → "/transport"

- If the user asks about the municipality, gemeente, registering at the municipality, or municipal services → "/municipality"

- If the user asks about cars, driving, vehicle registration, parking, driving licence, or vehicle-related matters → "/vehicles"

- If the user asks about waste, rubbish, recycling, garbage collection, or afval → "/waste"

- If the user wants to explore places, activities, attractions, or things to do → "/explore"

- If the user asks for help planning their day → "/plan-day"

- If the user asks to plan a trip → "/trip-planner"

- If the user wants to scan or understand a letter/document → "/scanner"

- If the user asks "what should I do?", "what do I do now?", or needs general step-by-step help and it is not clearly one of the other categories → "/what-do-i-do"

- If the user wants to return to the home/dashboard → "/dashboard"

- If the user needs a Dutch phone number or help getting one → "/dutch-phone-number"

Only navigate when navigation would genuinely help.

Do NOT navigate just because a keyword happens to appear.

Do NOT navigate for normal conversation.

Do NOT navigate for questions that can be answered directly without opening a page.

If the user says something like:
"I don't know anything about housing"
"Help me find housing"
"What do I do about transport?"
"I don't understand how public transport works"
"Where can I get healthcare?"
"I need a job"
"I don't understand my documents"

then navigation IS appropriate.

The user does not have to explicitly say "open the housing page".

Understand intent and navigate automatically.

The assistant should still answer naturally after navigation when appropriate.
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
            "📤 Gemini setup sent."
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

      socket.onerror = (event) => {
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

      socket.onclose = (event) => {
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
        onClick={handleVoiceButton}
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
              ? "bg-red-500 text-white hover:scale-110"
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

      {connected && speaking && (
        <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-green-600 shadow-xl">
          🔊 I'm here with you
        </div>
      )}

      {connected &&
        !listening &&
        !speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-red-500 shadow-xl">
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
