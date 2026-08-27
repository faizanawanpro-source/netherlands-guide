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
    useRef<RTCPeerConnection | null>(
      null
    );

  const dataChannelRef =
    useRef<RTCDataChannel | null>(
      null
    );

  const microphoneStreamRef =
    useRef<MediaStream | null>(
      null
    );

  const audioElementRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  const navigationTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

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
        !navigator.mediaDevices
          .getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available on this device."
        );
      }

      const mediaStream =
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
        mediaStream;

      // --------------------------------------------------------
      // GET EPHEMERAL KEY
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

      if (!ephemeralKey) {
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
        document.createElement(
          "audio"
        );

      audioElement.autoplay =
        true;

      audioElement.setAttribute(
        "playsinline",
        "true"
      );

      /*
       * Normal volume.
       *
       * We are NOT amplifying the
       * Realtime audio.
       */
      audioElement.volume = 1;

      audioElementRef.current =
        audioElement;

      peerConnection.ontrack = (
        event
      ) => {
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
                "Audio playback warning:",
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
          "Realtime voice connected."
        );

        setConnected(true);
        setConnecting(false);

        /*
         * IMPORTANT:
         *
         * The server already knows the
         * preferred language.
         *
         * This instruction reinforces it
         * for the first response.
         */
        sendEvent({
          type:
            "response.create",

          response: {
            instructions:
              "Immediately greet the user in the preferred language from their profile. The first word must be in that language. Do not use English unless English is the user's preferred language. Keep the greeting short, warm and natural.",
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
        } catch (error) {
          console.error(
            "Realtime event parsing error:",
            error
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
            state ===
            "connected"
          ) {
            setConnected(true);
            setConnecting(false);
          }

          if (
            state ===
              "failed" ||
            state ===
              "disconnected" ||
            state ===
              "closed"
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
      // CONNECT TO REALTIME
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
          "Realtime service error:",
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
  // NAVIGATION
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
        args &&
        typeof args ===
          "object" &&
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
        !destination.startsWith(
          "/"
        )
      ) {
        return;
      }

      console.log(
        "AI NAVIGATION:",
        destination
      );

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

      sendEvent({
        type:
          "response.create",

        response: {
          instructions:
            "Continue naturally after navigation. Do not mention technical details. Continue helping the user in their preferred language.",
        },
      });

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

      const channel =
        dataChannelRef.current;

      if (channel) {
        try {
          channel.close();
        } catch {}
      }

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
  }

  // ============================================================
  // MIC BUTTON
  // ============================================================

  function handleVoiceButton() {
    setError("");

    /*
     * If AI is currently speaking,
     * stop the AI.
     */
    if (speaking) {
      stopSpeaking();
      return;
    }

    /*
     * If voice is ON,
     * pressing the mic turns it OFF.
     */
    if (connected) {
      disconnectVoice();
      return;
    }

    /*
     * If voice is OFF,
     * pressing the mic turns it ON.
     */
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
              ? "cursor-wait bg-indigo-600 text-white"
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