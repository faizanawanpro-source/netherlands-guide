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

  const navigationTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const disconnectingRef = useRef(false);

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        setProfile(parsed);
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
      disconnectVoice();
    };
  }, []);

  // ============================================================
  // START VOICE
  // ============================================================

  async function startVoice() {
    if (connecting || connected) {
      return;
    }

    setError("");
    setConnecting(true);

    disconnectingRef.current = false;

    try {
      // --------------------------------------------------------
      // MICROPHONE
      // --------------------------------------------------------

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available on this device."
        );
      }

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

      // --------------------------------------------------------
      // GET EPHEMERAL REALTIME CLIENT SECRET
      // --------------------------------------------------------

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
            "Could not start the voice assistant."
        );
      }

      const ephemeralKey =
        tokenData?.client_secret;

      if (!ephemeralKey) {
        throw new Error(
          "No realtime client secret was returned."
        );
      }

      // --------------------------------------------------------
      // CREATE PEER CONNECTION
      // --------------------------------------------------------

      const peerConnection =
        new RTCPeerConnection();

      peerConnectionRef.current =
        peerConnection;

      // --------------------------------------------------------
      // AUDIO OUTPUT
      // --------------------------------------------------------

      const audioElement =
        document.createElement("audio");

      audioElement.autoplay = true;

      audioElement.setAttribute(
        "playsinline",
        "true"
      );

      // Normal volume.
      // No artificial amplification.

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
                  "Audio playback could not start:",
                  error
                );
              });
          }
        };

      // --------------------------------------------------------
      // MICROPHONE TRACK
      // --------------------------------------------------------

      mediaStream
        .getTracks()
        .forEach((track) => {
          peerConnection.addTrack(
            track,
            mediaStream
          );
        });

      // --------------------------------------------------------
      // DATA CHANNEL
      // --------------------------------------------------------

      const dataChannel =
        peerConnection.createDataChannel(
          "oai-events"
        );

      dataChannelRef.current =
        dataChannel;

      dataChannel.onopen = () => {
        console.log(
          "Realtime voice data channel connected."
        );

        setConnected(true);
        setConnecting(false);

        // Ask the assistant to greet using
        // the preferred language from the session.

        sendEvent({
          type: "response.create",

          response: {
            instructions:
              "Give a very short, warm greeting. You MUST speak in the user's preferred language from the session instructions. Do not randomly choose another language. Do not use English unless English is the user's preferred language.",
          },
        });
      };

      dataChannel.onmessage =
        (event) => {
          try {
            const serverEvent =
              JSON.parse(
                event.data
              ) as RealtimeEvent;

            handleRealtimeEvent(
              serverEvent
            );
          } catch (error) {
            console.error(
              "Realtime event parsing error:",
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

      // --------------------------------------------------------
      // CONNECTION STATE
      // --------------------------------------------------------

      peerConnection.onconnectionstatechange =
        () => {
          const state =
            peerConnection.connectionState;

          console.log(
            "Realtime connection:",
            state
          );

          if (
            state === "connected"
          ) {
            setConnected(true);
            setConnecting(false);
          }

          if (
            state === "failed" ||
            state === "disconnected" ||
            state === "closed"
          ) {
            setConnected(false);
            setListening(false);
            setSpeaking(false);
          }
        };

      // --------------------------------------------------------
      // CREATE SDP OFFER
      // --------------------------------------------------------

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      // --------------------------------------------------------
      // IMPORTANT:
      // USE THE SDP STORED IN THE PEER CONNECTION
      // --------------------------------------------------------

      const localSdp =
        peerConnection.localDescription?.sdp;

      if (!localSdp) {
        throw new Error(
          "Could not create the WebRTC SDP offer."
        );
      }

      console.log(
        "Sending SDP offer to Realtime..."
      );

      // --------------------------------------------------------
      // CONNECT TO OPENAI REALTIME
      // --------------------------------------------------------

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
            },

            body: localSdp,
          }
        );

      if (!realtimeResponse.ok) {
        const errorText =
          await realtimeResponse.text();

        console.error(
          "Realtime service error:",
          errorText
        );

        throw new Error(
          errorText ||
            "Could not connect to the realtime voice service."
        );
      }

      const answerSdp =
        await realtimeResponse.text();

      if (!answerSdp) {
        throw new Error(
          "The Realtime service returned an empty SDP answer."
        );
      }

      await peerConnection.setRemoteDescription(
        {
          type: "answer",
          sdp: answerSdp,
        }
      );

      console.log(
        "Realtime voice session started successfully."
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

      // Stop microphone if connection fails.

      if (
        microphoneStreamRef.current
      ) {
        microphoneStreamRef.current
          .getTracks()
          .forEach((track) => {
            try {
              track.stop();
            } catch {}
          });

        microphoneStreamRef.current =
          null;
      }

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
  // NAVIGATION FUNCTION
  // ============================================================

  function handleFunctionCall(
    event: RealtimeEvent
  ) {
    if (
      event?.name !==
      "navigate_to_page"
    ) {
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
          "string" ||
        !destination.startsWith("/")
      ) {
        return;
      }

      console.log(
        "AI NAVIGATION:",
        destination
      );

      // Tell the model that navigation succeeded.

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

      // Continue naturally.

      sendEvent({
        type:
          "response.create",

        response: {
          instructions:
            "Continue naturally after navigating. Do not mention technical details, APIs, functions, routes, or buttons.",
        },
      });

      // Navigate after a short delay.

      if (
        navigationTimeoutRef.current
      ) {
        clearTimeout(
          navigationTimeoutRef.current
        );
      }

      navigationTimeoutRef.current =
        setTimeout(() => {
          router.push(
            destination
          );
        }, 700);
    } catch (error) {
      console.error(
        "Navigation function error:",
        error
      );
    }
  }

  // ============================================================
  // SEND REALTIME EVENT
  // ============================================================

  function sendEvent(
    event: Record<
      string,
      unknown
    >
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
  // STOP AI SPEECH
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
  // DISCONNECT
  // ============================================================

  function disconnectVoice() {
    if (
      disconnectingRef.current
    ) {
      return;
    }

    disconnectingRef.current =
      true;

    try {
      // Navigation timeout

      if (
        navigationTimeoutRef.current
      ) {
        clearTimeout(
          navigationTimeoutRef.current
        );

        navigationTimeoutRef.current =
          null;
      }

      // Close data channel

      const channel =
        dataChannelRef.current;

      if (channel) {
        try {
          channel.close();
        } catch {}
      }

      // Stop microphone

      const microphone =
        microphoneStreamRef.current;

      if (microphone) {
        microphone
          .getTracks()
          .forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
      }

      microphoneStreamRef.current =
        null;

      // Close peer connection

      const peerConnection =
        peerConnectionRef.current;

      if (peerConnection) {
        try {
          peerConnection
            .getSenders()
            .forEach(
              (sender) => {
                try {
                  sender.track?.stop();
                } catch {}
              }
            );
        } catch {}

        try {
          peerConnection.close();
        } catch {}
      }

      // Stop audio output

      const audioElement =
        audioElementRef.current;

      if (audioElement) {
        try {
          audioElement.pause();
        } catch {}

        try {
          audioElement.srcObject =
            null;
        } catch {}
      }
    } catch (error) {
      console.error(
        "Voice cleanup error:",
        error
      );
    }

    peerConnectionRef.current =
      null;

    dataChannelRef.current =
      null;

    audioElementRef.current =
      null;

    setConnected(false);
    setConnecting(false);
    setListening(false);
    setSpeaking(false);

    disconnectingRef.current =
      false;
  }

  // ============================================================
  // MAIN MIC BUTTON
  // ============================================================

  function handleVoiceButton() {
    setError("");

    // AI speaking → stop speech

    if (speaking) {
      stopSpeaking();
      return;
    }

    // Voice already connected → turn it off

    if (connected) {
      disconnectVoice();
      return;
    }

    // Voice off → start it

    startVoice();
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      {/* ======================================================
          MIC BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handleVoiceButton}
        disabled={connecting}
        aria-label={
          connecting
            ? "Connecting to voice assistant"
            : speaking
            ? "Stop speaking"
            : connected
            ? "Turn voice assistant off"
            : "Turn voice assistant on"
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
              ? "cursor-wait bg-indigo-600 text-white shadow-indigo-500/40"
              : connected
              ? "bg-red-500 text-white shadow-red-500/40 hover:scale-110"
              : "bg-orange-500 text-white shadow-orange-500/40 hover:scale-110 hover:bg-orange-600"
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

      {/* ======================================================
          CONNECTING
      ====================================================== */}

      {connecting && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[9998]

            rounded-full
            bg-white

            px-4
            py-2

            text-sm
            font-bold
            text-indigo-600

            shadow-xl
          "
        >
          Connecting...
        </div>
      )}

      {/* ======================================================
          LISTENING
      ====================================================== */}

      {connected &&
        listening &&
        !speaking && (
          <div
            className="
              fixed
              bottom-24
              right-6
              z-[9998]

              rounded-full
              bg-white

              px-4
              py-2

              text-sm
              font-bold
              text-orange-600

              shadow-xl
            "
          >
            🎤 I'm listening
          </div>
        )}

      {/* ======================================================
          SPEAKING
      ====================================================== */}

      {connected &&
        speaking && (
          <div
            className="
              fixed
              bottom-24
              right-6
              z-[9998]

              rounded-full
              bg-white

              px-4
              py-2

              text-sm
              font-bold
              text-green-600

              shadow-xl
          "
        >
          🔊 I'm speaking
        </div>
      )}

      {/* ======================================================
          CONNECTED
      ====================================================== */}

      {connected &&
        !listening &&
        !speaking && (
          <div
            className="
              fixed
              bottom-24
              right-6
              z-[9998]

              rounded-full
              bg-white

              px-4
              py-2

              text-sm
              font-bold
              text-red-500

              shadow-xl
            "
          >
            Tap mic to turn voice off
          </div>
        )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[9998]

            max-w-xs

            rounded-2xl
            border
            border-red-200

            bg-white

            px-4
            py-3

            text-sm
            font-semibold
            text-red-600

            shadow-xl
          "
        >
          {error}
        </div>
      )}
    </>
  );
}