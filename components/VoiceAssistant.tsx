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

  const mountedRef =
    useRef(true);

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
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
          setProfile(parsed);
        }
      }
    } catch (err) {
      console.error(
        "Could not load profile:",
        err
      );
    }
  }, []);

  // ============================================================
  // COMPONENT CLEANUP
  // ============================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      disconnectVoice();
    };
  }, []);

  // ============================================================
  // SEND EVENT TO REALTIME
  // ============================================================

  function sendEvent(event: Record<string, unknown>) {
    const channel =
      dataChannelRef.current;

    if (
      !channel ||
      channel.readyState !== "open"
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
    } catch (err) {
      console.error(
        "Could not send realtime event:",
        err
      );
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
      // GET REALTIME CLIENT SECRET
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
            "Could not start the voice assistant."
        );
      }

      const ephemeralKey =
        tokenData?.client_secret;

      if (
        typeof ephemeralKey !==
        "string"
      ) {
        throw new Error(
          "No realtime client secret was returned."
        );
      }

      // --------------------------------------------------------
      // PEER CONNECTION
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

      /*
       * Keep volume normal.
       * We are NOT boosting the audio.
       */

      audioElement.volume = 1;

      audioElementRef.current =
        audioElement;

      peerConnection.ontrack = (
        event
      ) => {
        const stream =
          event.streams?.[0];

        if (!stream) {
          return;
        }

        if (
          audioElementRef.current
        ) {
          audioElementRef.current.srcObject =
            stream;

          audioElementRef.current
            .play()
            .catch((err) => {
              console.warn(
                "Audio playback waiting for user interaction:",
                err
              );
            });
        }
      };

      // --------------------------------------------------------
      // MICROPHONE TRACK
      // --------------------------------------------------------

      for (const track of mediaStream.getTracks()) {
        peerConnection.addTrack(
          track,
          mediaStream
        );
      }

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
          "Realtime voice connected."
        );

        if (!mountedRef.current) {
          return;
        }

        setConnected(true);
        setConnecting(false);

        /*
         * IMPORTANT:
         *
         * We explicitly tell the model to use
         * the language selected in the user's profile.
         */

        const selectedLanguage =
          String(
            profile?.language ||
              "English"
          ).trim();

        sendEvent({
          type: "session.update",

          session: {
            instructions: `
You are the friendly female voice assistant inside Netherway.

The user's preferred language is:
${selectedLanguage}

IMPORTANT:
Speak ${selectedLanguage} from your FIRST WORD.

Do NOT greet the user in English if their preferred language is not English.

Do NOT randomly switch languages.

The user's profile language is the source of truth.

Continue speaking ${selectedLanguage} unless the user explicitly asks you to change language.

You are warm, friendly, patient and natural.

Speak like a friendly woman helping someone in the Netherlands.

Keep answers conversational and relatively short.

Never sound robotic.

You can help with housing, documents, BSN, DigiD, healthcare, banking, jobs, study, transport, cars, municipalities, waste, trips, day planning and Dutch government letters.

If the user clearly asks to open a section of Netherway, use the navigate_to_page function.

Never mention technical details.
`,
          },
        });

        /*
         * Give the assistant one short natural greeting.
         */

        sendEvent({
          type: "response.create",

          response: {
            instructions: `
Greet the user warmly and naturally.

Speak ONLY in the user's preferred language:
${selectedLanguage}

Keep the greeting short.

Do not explain the system.

Do not mention language settings.

Simply greet them and tell them you are here to help.
`,
          },
        });
      };

      dataChannel.onmessage = (
        event
      ) => {
        try {
          const serverEvent =
            JSON.parse(
              event.data
            ) as RealtimeEvent;

          handleRealtimeEvent(
            serverEvent
          );
        } catch (err) {
          console.error(
            "Realtime event error:",
            err
          );
        }
      };

      dataChannel.onerror = (
        event
      ) => {
        console.error(
          "Realtime data channel error:",
          event
        );

        if (mountedRef.current) {
          setError(
            "The voice connection encountered a problem."
          );
        }
      };

      dataChannel.onclose = () => {
        if (!mountedRef.current) {
          return;
        }

        setConnected(false);
        setListening(false);
        setSpeaking(false);
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

          if (!mountedRef.current) {
            return;
          }

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
            setConnecting(false);
            setListening(false);
            setSpeaking(false);
          }
        };

      // --------------------------------------------------------
      // CREATE OFFER
      // --------------------------------------------------------

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      if (!offer.sdp) {
        throw new Error(
          "Could not create the voice connection."
        );
      }

      // --------------------------------------------------------
      // CONNECT TO OPENAI REALTIME
      // --------------------------------------------------------

      const realtimeResponse =
        await fetch(
          "https://api.openai.com/v1/realtime/calls",
          {
            method: "POST",

            body: offer.sdp,

            headers: {
              Authorization:
                `Bearer ${ephemeralKey}`,

              "Content-Type":
                "application/sdp",
            },
          }
        );

      if (!realtimeResponse.ok) {
        const errorText =
          await realtimeResponse.text();

        console.error(
          "Realtime connection error:",
          errorText
        );

        throw new Error(
          "Could not connect to the realtime voice service."
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
        "Realtime voice session ready."
      );
    } catch (err) {
      console.error(
        "Voice connection error:",
        err
      );

      // Stop microphone if connection failed.
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

      if (mountedRef.current) {
        setConnecting(false);
        setConnected(false);
        setListening(false);
        setSpeaking(false);

        setError(
          err instanceof Error
            ? err.message
            : "Could not start the voice assistant."
        );
      }
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
      // --------------------------------------------------------
      // USER STARTED SPEAKING
      // --------------------------------------------------------

      case "input_audio_buffer.speech_started":
        setListening(true);
        setSpeaking(false);
        break;

      // --------------------------------------------------------
      // USER STOPPED SPEAKING
      // --------------------------------------------------------

      case "input_audio_buffer.speech_stopped":
        setListening(false);
        break;

      // --------------------------------------------------------
      // ASSISTANT STARTED SPEAKING
      // --------------------------------------------------------

      case "response.audio.delta":
        setSpeaking(true);
        setListening(false);
        break;

      case "response.output_audio.delta":
        setSpeaking(true);
        setListening(false);
        break;

      // --------------------------------------------------------
      // ASSISTANT FINISHED SPEAKING
      // --------------------------------------------------------

      case "response.audio.done":
        setSpeaking(false);
        break;

      case "response.output_audio.done":
        setSpeaking(false);
        break;

      case "response.done":
        setSpeaking(false);
        break;

      // --------------------------------------------------------
      // NAVIGATION FUNCTION
      // --------------------------------------------------------

      case "response.function_call_arguments.done":
        handleFunctionCall(event);
        break;

      // --------------------------------------------------------
      // ERRORS
      // --------------------------------------------------------

      case "error":
        console.error(
          "Realtime API error:",
          event
        );

        setError(
          event.error?.message ||
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
      event.name !==
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

      if (
        !args ||
        typeof args !== "object"
      ) {
        return;
      }

      const destination =
        (args as { path?: unknown })
          .path;

      if (
        typeof destination !==
          "string" ||
        !destination.startsWith("/")
      ) {
        console.warn(
          "Invalid navigation path:",
          destination
        );
        return;
      }

      console.log(
        "AI NAVIGATION:",
        destination
      );

      // --------------------------------------------------------
      // TELL OPENAI FUNCTION SUCCEEDED
      // --------------------------------------------------------

      if (event.call_id) {
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

        // ------------------------------------------------------
        // LET AI CONTINUE TALKING
        // ------------------------------------------------------

        sendEvent({
          type:
            "response.create",

          response: {
            instructions: `
Continue naturally after navigating.

Do not mention technical details.

Do not say that you clicked anything.

Speak naturally to the user in their selected language.
`,
          },
        });
      }

      // --------------------------------------------------------
      // NAVIGATE
      // --------------------------------------------------------

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
    } catch (err) {
      console.error(
        "Navigation function error:",
        err
      );
    }
  }

  // ============================================================
  // STOP ASSISTANT SPEAKING
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
    try {
      if (
        navigationTimeoutRef.current
      ) {
        clearTimeout(
          navigationTimeoutRef.current
        );

        navigationTimeoutRef.current =
          null;
      }

      // --------------------------------------------------------
      // Stop microphone
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // Close data channel
      // --------------------------------------------------------

      const channel =
        dataChannelRef.current;

      if (channel) {
        try {
          channel.close();
        } catch {}
      }

      // --------------------------------------------------------
      // Close peer connection
      // --------------------------------------------------------

      const peerConnection =
        peerConnectionRef.current;

      if (peerConnection) {
        try {
          peerConnection
            .getSenders()
            .forEach((sender) => {
              try {
                sender.track?.stop();
              } catch {}
            });
        } catch {}

        try {
          peerConnection.close();
        } catch {}
      }

      // --------------------------------------------------------
      // Stop audio
      // --------------------------------------------------------

      if (
        audioElementRef.current
      ) {
        try {
          audioElementRef.current.pause();
        } catch {}

        audioElementRef.current.srcObject =
          null;

        audioElementRef.current =
          null;
      }
    } catch (err) {
      console.error(
        "Voice cleanup error:",
        err
      );
    }

    peerConnectionRef.current =
      null;

    dataChannelRef.current =
      null;

    microphoneStreamRef.current =
      null;

    setConnected(false);
    setConnecting(false);
    setListening(false);
    setSpeaking(false);
  }

  // ============================================================
  // MAIN BUTTON
  // ============================================================

  function handleVoiceButton() {
    setError("");

    // ----------------------------------------------------------
    // CONNECTED + SPEAKING
    // Pressing mic stops the assistant.
    // ----------------------------------------------------------

    if (
      connected &&
      speaking
    ) {
      stopSpeaking();
      return;
    }

    // ----------------------------------------------------------
    // CONNECTED
    // Pressing mic again turns the assistant OFF.
    // ----------------------------------------------------------

    if (connected) {
      disconnectVoice();
      return;
    }

    // ----------------------------------------------------------
    // NOT CONNECTED
    // Press mic to turn it ON.
    // ----------------------------------------------------------

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
        onClick={
          handleVoiceButton
        }
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

          select-none

          ${
            connecting
              ? `
                cursor-wait
                bg-indigo-600
                text-white
                shadow-indigo-500/40
              `
              : speaking
              ? `
                bg-green-500
                text-white
                shadow-green-500/50
                ring-4
                ring-green-200
              `
              : listening
              ? `
                animate-pulse
                bg-orange-600
                text-white
                shadow-orange-600/50
                ring-4
                ring-orange-200
              `
              : connected
              ? `
                bg-orange-500
                text-white
                shadow-orange-500/40
                ring-4
                ring-orange-100
              `
              : `
                bg-orange-500
                text-white
                shadow-orange-500/40
                hover:scale-110
                hover:bg-orange-600
              `
          }
        `}
      >
        {connecting
          ? "..."
          : speaking
          ? "🔊"
          : connected
          ? "🎤"
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
          CONNECTED BUT NOT CURRENTLY SPEAKING/LISTENING
      ====================================================== */}

      {connected &&
        !listening &&
        !speaking &&
        !connecting && (
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
            🎤 Voice is on
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