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

type RealtimeEvent = {
  type?: string;
  name?: string;
  call_id?: string;
  arguments?: string | Record<string, unknown>;
  error?: {
    message?: string;
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

  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  const dataChannelRef =
    useRef<RTCDataChannel | null>(null);

  const microphoneStreamRef =
    useRef<MediaStream | null>(null);

  const audioElementRef =
    useRef<HTMLAudioElement | null>(null);

  const isNavigatingRef =
    useRef(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
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

  useEffect(() => {
    return () => {
      disconnectVoice();
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
      language.includes("русский язык") ||
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
  // START VOICE
  // ============================================================

  async function startVoice() {
    if (connecting || connected) {
      return;
    }

    setError("");
    setConnecting(true);

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available on this device."
        );
      }

      // ----------------------------------------------------------
      // MICROPHONE
      // ----------------------------------------------------------

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
          },
        });

      microphoneStreamRef.current =
        mediaStream;

      // ----------------------------------------------------------
      // GET EPHEMERAL KEY
      // ----------------------------------------------------------

      const tokenResponse =
        await fetch("/api/realtime", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            profile,
          }),
        });

      const tokenData =
        await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(
          tokenData?.error ||
            "Could not create the voice session."
        );
      }

      const ephemeralKey =
        tokenData?.client_secret;

      if (!ephemeralKey) {
        throw new Error(
          "Realtime client secret was not returned."
        );
      }

      // ----------------------------------------------------------
      // WEBRTC
      // ----------------------------------------------------------

      const peerConnection =
        new RTCPeerConnection();

      peerConnectionRef.current =
        peerConnection;

      // ----------------------------------------------------------
      // AUDIO
      // ----------------------------------------------------------

      const audioElement =
        document.createElement("audio");

      audioElement.autoplay = true;
      audioElement.setAttribute(
        "playsinline",
        "true"
      );
      audioElement.volume = 1;

      audioElementRef.current =
        audioElement;

      peerConnection.ontrack =
        (event) => {
          const stream =
            event.streams?.[0];

          if (
            stream &&
            audioElementRef.current
          ) {
            audioElementRef.current.srcObject =
              stream;

            audioElementRef.current
              .play()
              .catch((error) => {
                console.warn(
                  "Audio playback failed:",
                  error
                );
              });
          }
        };

      // ----------------------------------------------------------
      // MICROPHONE TRACK
      // ----------------------------------------------------------

      mediaStream
        .getTracks()
        .forEach((track) => {
          peerConnection.addTrack(
            track,
            mediaStream
          );
        });

      // ----------------------------------------------------------
      // DATA CHANNEL
      // ----------------------------------------------------------

      const dataChannel =
        peerConnection.createDataChannel(
          "oai-events"
        );

      dataChannelRef.current =
        dataChannel;

      dataChannel.onopen = () => {
        console.log(
          "Realtime voice connected."
        );

        setConnected(true);
        setConnecting(false);

        // Initial greeting
        sendEvent({
          type: "response.create",

          response: {
            instructions: `
Give a short, warm and genuinely friendly greeting.

Speak ONLY in ${getProfileLanguage()}.

You are a caring female voice assistant.

Sound natural, relaxed and happy to help.

Do not sound robotic, formal, scripted or like a call centre.

Use the user's preferred language from your very first word.

Do not mention AI, APIs, tools, functions, code or technology.

Keep the greeting short and conversational.
            `.trim(),
          },
        });
      };

      // ----------------------------------------------------------
      // EVENTS
      // ----------------------------------------------------------

      dataChannel.onmessage =
        (messageEvent) => {
          try {
            const serverEvent =
              JSON.parse(
                messageEvent.data
              ) as RealtimeEvent;

            handleRealtimeEvent(
              serverEvent
            );
          } catch (error) {
            console.error(
              "Could not parse realtime event:",
              error
            );
          }
        };

      dataChannel.onerror =
        (event) => {
          console.error(
            "Realtime data channel error:",
            event
          );

          setError(
            "The voice connection encountered a problem."
          );
        };

      // ----------------------------------------------------------
      // CONNECTION STATE
      // ----------------------------------------------------------

      peerConnection.onconnectionstatechange =
        () => {
          const state =
            peerConnection.connectionState;

          console.log(
            "Realtime connection:",
            state
          );

          if (state === "connected") {
            setConnected(true);
            setConnecting(false);
          }

          if (
            state === "failed" ||
            state === "closed"
          ) {
            setConnected(false);
            setListening(false);
            setSpeaking(false);
          }
        };

      // ----------------------------------------------------------
      // SDP OFFER
      // ----------------------------------------------------------

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      if (!offer.sdp) {
        throw new Error(
          "Could not create the WebRTC offer."
        );
      }

      // ----------------------------------------------------------
      // OPENAI REALTIME
      // ----------------------------------------------------------

      const realtimeResponse =
        await fetch(
          "https://api.openai.com/v1/realtime/calls",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${ephemeralKey}`,

              "Content-Type":
                "application/sdp",

              Accept:
                "application/sdp",
            },

            body: offer.sdp,
          }
        );

      if (!realtimeResponse.ok) {
        const errorText =
          await realtimeResponse.text();

        console.error(
          "Realtime connection failed:",
          errorText
        );

        throw new Error(
          errorText ||
            "Could not connect to the voice service."
        );
      }

      const answerSdp =
        await realtimeResponse.text();

      await peerConnection.setRemoteDescription(
        {
          type: "answer",
          sdp: answerSdp,
        }
      );

      console.log(
        "Realtime voice session started."
      );
    } catch (error) {
      console.error(
        "Voice connection error:",
        error
      );

      setConnecting(false);
      setConnected(false);
      setListening(false);
      setSpeaking(false);

      cleanupConnections();

      setError(
        error instanceof Error
          ? error.message
          : "Could not start the voice assistant."
      );
    }
  }

  // ============================================================
  // REALTIME EVENTS
  // ============================================================

  function handleRealtimeEvent(
    event: RealtimeEvent
  ) {
    console.log(
      "Realtime event:",
      event.type
    );

    switch (event.type) {
      case "input_audio_buffer.speech_started":
        setListening(true);
        setSpeaking(false);
        break;

      case "input_audio_buffer.speech_stopped":
        setListening(false);
        break;

      case "response.audio.delta":
        setSpeaking(true);
        setListening(false);
        break;

      case "response.audio.done":
        setSpeaking(false);
        break;

      case "response.done":
        setSpeaking(false);
        break;

      case "response.function_call_arguments.done":
        handleFunctionCall(event);
        break;

      case "error":
        console.error(
          "Realtime API error:",
          event
        );

        setError(
          event?.error?.message ||
            "The voice assistant encountered an error."
        );

        setSpeaking(false);
        setListening(false);
        break;

      default:
        break;
    }
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  function handleFunctionCall(
    event: RealtimeEvent
  ) {
    console.log(
      "🧭 NAVIGATION FUNCTION CALLED",
      event
    );

    if (
      event.name !==
      "navigate_to_page"
    ) {
      return;
    }

    if (isNavigatingRef.current) {
      return;
    }

    try {
      const args =
        typeof event.arguments ===
        "string"
          ? JSON.parse(
              event.arguments
            )
          : event.arguments;

      const destination =
        args &&
        typeof args === "object" &&
        "path" in args
          ? (
              args as {
                path?: unknown;
              }
            ).path
          : null;

      if (
        typeof destination !==
        "string"
      ) {
        console.error(
          "Invalid navigation destination:",
          destination
        );

        return;
      }

      if (
        !ALLOWED_PATHS.has(
          destination
        )
      ) {
        console.error(
          "Navigation path not allowed:",
          destination
        );

        return;
      }

      isNavigatingRef.current =
        true;

      console.log(
        "🧭 NAVIGATING TO:",
        destination
      );

      // ----------------------------------------------------------
      // CONFIRM FUNCTION CALL
      // ----------------------------------------------------------

      sendEvent({
        type:
          "conversation.item.create",

        item: {
          type:
            "function_call_output",

          call_id:
            event.call_id,

          output:
            JSON.stringify({
              success: true,
              path: destination,
            }),
        },
      });

      // ----------------------------------------------------------
      // NAVIGATE
      //
      // IMPORTANT:
      // We DO NOT disconnect the voice connection.
      // VoiceAssistant is mounted in layout.tsx.
      // ----------------------------------------------------------

      router.push(
        destination
      );

      // ----------------------------------------------------------
      // CONTINUE THE CONVERSATION
      // ----------------------------------------------------------

      window.setTimeout(() => {
        sendEvent({
          type:
            "response.create",

          response: {
            instructions: `
The user has now been taken to the relevant section.

Continue helping them naturally.

Do not talk about navigation, routes, tools, functions, APIs or code.

Say something short and friendly that fits the situation.

For example, say the equivalent of:
"You're there. I'm still with you, so let's sort this out."

Speak only in ${getProfileLanguage()}.

Do not repeat the user's original question.

Keep it conversational and warm.
            `.trim(),
          },
        });

        isNavigatingRef.current =
          false;
      }, 500);
    } catch (error) {
      console.error(
        "Navigation error:",
        error
      );

      isNavigatingRef.current =
        false;
    }
  }

  // ============================================================
  // SEND EVENT
  // ============================================================

  function sendEvent(
    event: Record<string, unknown>
  ) {
    const channel =
      dataChannelRef.current;

    if (
      !channel ||
      channel.readyState !==
        "open"
    ) {
      console.warn(
        "Realtime channel is not ready."
      );

      return;
    }

    try {
      channel.send(
        JSON.stringify(event)
      );
    } catch (error) {
      console.error(
        "Could not send realtime event:",
        error
      );
    }
  }

  // ============================================================
  // STOP SPEAKING
  // ============================================================

  function stopSpeaking() {
    if (!connected) {
      return;
    }

    sendEvent({
      type:
        "response.cancel",
    });

    setSpeaking(false);
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  function cleanupConnections() {
    try {
      dataChannelRef.current?.close();

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      microphoneStreamRef.current =
        null;

      peerConnectionRef.current?.close();

      peerConnectionRef.current =
        null;

      if (audioElementRef.current) {
        audioElementRef.current.pause();

        audioElementRef.current.srcObject =
          null;
      }

      audioElementRef.current =
        null;

      dataChannelRef.current =
        null;
    } catch (error) {
      console.error(
        "Voice cleanup error:",
        error
      );
    }
  }

  function disconnectVoice() {
    cleanupConnections();

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
              ? "animate-pulse bg-orange-600 text-white shadow-orange-600/50 ring-4 ring-orange-200"
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
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow-xl">
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