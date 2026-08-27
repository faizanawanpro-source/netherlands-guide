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
  arguments?: string | object;
  error?: {
    message?: string;
  };
};

export default function VoiceAssistant() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile>({});

  const [connected, setConnected] =
    useState(false);

  const [connecting, setConnecting] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [error, setError] =
    useState("");

  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  const dataChannelRef =
    useRef<RTCDataChannel | null>(null);

  const microphoneStreamRef =
    useRef<MediaStream | null>(null);

  const audioElementRef =
    useRef<HTMLAudioElement | null>(null);

  const navigationTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

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

    try {
      // ========================================================
      // MICROPHONE
      // ========================================================

      const microphoneStream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
          },
        });

      microphoneStreamRef.current =
        microphoneStream;

      // ========================================================
      // GET TEMPORARY CLIENT SECRET
      // ========================================================

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
            "Could not create voice session."
        );
      }

      const ephemeralKey =
        tokenData?.client_secret;

      if (!ephemeralKey) {
        throw new Error(
          "No realtime client secret was returned."
        );
      }

      // ========================================================
      // PEER CONNECTION
      // ========================================================

      const peerConnection =
        new RTCPeerConnection();

      peerConnectionRef.current =
        peerConnection;

      // ========================================================
      // AUDIO OUTPUT
      // ========================================================

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
          const remoteStream =
            event.streams[0];

          if (
            audioElementRef.current
          ) {
            audioElementRef.current.srcObject =
              remoteStream;

            audioElementRef.current
              .play()
              .catch((error) => {
                console.warn(
                  "Audio playback was blocked:",
                  error
                );
              });
          }
        };

      // ========================================================
      // MICROPHONE TRACK
      // ========================================================

      for (
        const track of microphoneStream.getTracks()
      ) {
        peerConnection.addTrack(
          track,
          microphoneStream
        );
      }

      // ========================================================
      // DATA CHANNEL
      // ========================================================

      const dataChannel =
        peerConnection.createDataChannel(
          "oai-events"
        );

      dataChannelRef.current =
        dataChannel;

      dataChannel.onopen = () => {
        console.log(
          "Realtime data channel connected."
        );

        setConnected(true);
        setConnecting(false);

        // ======================================================
        // FIRST GREETING
        // ======================================================

        sendEvent({
          type: "response.create",

          response: {
            instructions: `
Start the conversation now.

Greet the user warmly and naturally.

IMPORTANT:
Speak in the user's preferred language from the session instructions.

Do not start in English if their preferred language is different.

Keep the greeting short and friendly.

Do not explain that you are an AI.
`,
          },
        });
      };

      dataChannel.onmessage =
        (event) => {
          try {
            const serverEvent =
              JSON.parse(event.data) as RealtimeEvent;

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

      // ========================================================
      // CONNECTION STATE
      // ========================================================

      peerConnection.onconnectionstatechange =
        () => {
          console.log(
            "Connection state:",
            peerConnection.connectionState
          );

          switch (
            peerConnection.connectionState
          ) {
            case "connected":
              setConnected(true);
              setConnecting(false);
              break;

            case "failed":
            case "disconnected":
            case "closed":
              setConnected(false);
              setConnecting(false);
              setListening(false);
              setSpeaking(false);
              break;

            default:
              break;
          }
        };

      // ========================================================
      // CREATE OFFER
      // ========================================================

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

      // ========================================================
      // CONNECT TO OPENAI REALTIME
      // ========================================================

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
        "Realtime voice connection established."
      );
    } catch (error) {
      console.error(
        "Voice startup error:",
        error
      );

      // Clean up microphone if startup fails.

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      microphoneStreamRef.current =
        null;

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
      // ========================================================
      // USER STARTED SPEAKING
      // ========================================================

      case "input_audio_buffer.speech_started":
        setListening(true);
        setSpeaking(false);
        break;

      // ========================================================
      // USER STOPPED SPEAKING
      // ========================================================

      case "input_audio_buffer.speech_stopped":
        setListening(false);
        break;

      // ========================================================
      // ASSISTANT SPEAKING
      // ========================================================

      case "response.audio.delta":
        setSpeaking(true);
        setListening(false);
        break;

      // ========================================================
      // ASSISTANT FINISHED
      // ========================================================

      case "response.audio.done":
        setSpeaking(false);
        break;

      case "response.done":
        setSpeaking(false);
        break;

      // ========================================================
      // NAVIGATION FUNCTION
      // ========================================================

      case "response.function_call_arguments.done":
        handleFunctionCall(event);
        break;

      // ========================================================
      // ERROR
      // ========================================================

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
  // HANDLE NAVIGATION
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

      const destination =
        (args as { path?: string })
          ?.path;

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

      // ========================================================
      // TELL REALTIME FUNCTION SUCCEEDED
      // ========================================================

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

      // ========================================================
      // LET ASSISTANT CONTINUE TALKING
      // ========================================================

      sendEvent({
        type: "response.create",

        response: {
          instructions: `
Continue naturally after navigating.

Do not mention technical details.

Do not say "I clicked the button".

Simply continue the conversation naturally.
`,
        },
      });

      // ========================================================
      // NAVIGATE
      // ========================================================

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
  // SEND EVENT
  // ============================================================

  function sendEvent(
    event: unknown
  ) {
    const channel =
      dataChannelRef.current;

    if (
      !channel ||
      channel.readyState !==
        "open"
    ) {
      console.warn(
        "Realtime data channel is not ready."
      );

      return;
    }

    channel.send(
      JSON.stringify(event)
    );
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
      // --------------------------------------------------------
      // Navigation timeout
      // --------------------------------------------------------

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
      // Data channel
      // --------------------------------------------------------

      const channel =
        dataChannelRef.current;

      if (channel) {
        try {
          channel.close();
        } catch {}
      }

      // --------------------------------------------------------
      // Microphone
      // --------------------------------------------------------

      const microphoneStream =
        microphoneStreamRef.current;

      if (microphoneStream) {
        microphoneStream
          .getTracks()
          .forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
      }

      // --------------------------------------------------------
      // Peer connection
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
      // Audio
      // --------------------------------------------------------

      const audioElement =
        audioElementRef.current;

      if (audioElement) {
        try {
          audioElement.pause();
        } catch {}

        audioElement.srcObject =
          null;
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

    microphoneStreamRef.current =
      null;

    audioElementRef.current =
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
    // CONNECTING
    // ----------------------------------------------------------

    if (connecting) {
      return;
    }

    // ----------------------------------------------------------
    // CONNECTED
    //
    // Pressing the SAME MIC BUTTON turns the assistant OFF.
    // ----------------------------------------------------------

    if (connected) {
      disconnectVoice();
      return;
    }

    // ----------------------------------------------------------
    // OFF
    //
    // Pressing the mic turns it ON.
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
        onClick={handleVoiceButton}
        disabled={connecting}
        aria-label={
          connected
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
            connected
              ? listening
                ? "animate-pulse bg-orange-600 text-white shadow-orange-600/50 ring-4 ring-orange-200"
                : speaking
                ? "bg-green-500 text-white shadow-green-500/50 ring-4 ring-green-200"
                : "bg-orange-500 text-white shadow-orange-500/40"
              : connecting
              ? "cursor-wait bg-indigo-600 text-white shadow-indigo-500/40"
              : "bg-orange-500 text-white shadow-orange-500/40 hover:scale-110 hover:bg-orange-600"
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