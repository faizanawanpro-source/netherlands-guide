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

type NavigationArguments = {
  path: string;
  reason?: string;
};

const ALLOWED_PATHS = [
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
  "/voice",
];

export default function VoiceAssistant() {
  const router = useRouter();

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<Profile>({});

  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  const dataChannelRef =
    useRef<RTCDataChannel | null>(null);

  const audioElementRef =
    useRef<HTMLAudioElement | null>(null);

  const localStreamRef =
    useRef<MediaStream | null>(null);

  const greetingSentRef =
    useRef(false);

  /*
   * ============================================================
   * LOAD PROFILE
   * ============================================================
   */

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

  /*
   * ============================================================
   * CLEANUP
   * ============================================================
   */

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  /*
   * ============================================================
   * CREATE REALTIME SESSION
   * ============================================================
   */

  async function createSession() {
    const response =
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

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Could not start the voice assistant."
      );
    }

    if (!data.client_secret) {
      throw new Error(
        "No Realtime client secret was returned."
      );
    }

    return data.client_secret;
  }

  /*
   * ============================================================
   * NAVIGATION TOOL
   * ============================================================
   */

  const navigationTool = {
    type: "function",

    name: "navigate_to_page",

    description: `
Navigate the user to a section of Netherlands Guide.

Use this when the user clearly asks for help with a section,
wants to open a section, or when opening the section will
clearly help continue the task.

Do not navigate merely because a topic was casually mentioned.

Available pages:

/dashboard
/dutch-phone-number
/housing
/documents
/healthcare
/money
/work
/study
/transport
/municipality
/vehicles
/waste
/explore
/plan-day
/trip-planner
/scanner
/what-do-i-do
/voice

Examples:

"I need help with public transport."
→ /transport

"I need help with housing."
→ /housing

"I need help with my BSN."
→ /documents

"I need help with DigiD."
→ /documents

"I need a job."
→ /work

"I need healthcare help."
→ /healthcare

"I need help with money."
→ /money

"I need help with driving."
→ /vehicles

"I need help studying."
→ /study

"I need help with waste."
→ /waste

"I want to plan a trip."
→ /trip-planner

The conversation must continue after navigation.
`,

    parameters: {
      type: "object",

      properties: {
        path: {
          type: "string",

          enum: ALLOWED_PATHS,

          description:
            "The Netherlands Guide page to open.",
        },

        reason: {
          type: "string",

          description:
            "Brief reason why this page is useful.",
        },
      },

      required: ["path"],
    },
  };

  /*
   * ============================================================
   * ASSISTANT INSTRUCTIONS
   * ============================================================
   */

  function buildInstructions() {
    const language =
      profile.language ||
      "English";

    return `
You are Netherlands Guide AI.

You are a warm, friendly female voice assistant.

Think like a helpful older sister, mum, friend, or patient
municipality employee.

You help people understand and navigate everyday life in
the Netherlands.

============================================================
CONVERSATION STYLE
============================================================

Have a REAL conversation.

Be warm.

Be friendly.

Be patient.

Be reassuring.

Be natural.

Keep answers relatively short.

Do not sound robotic.

Do not sound like a government document.

Do not give huge lists unless the user asks.

Do not repeatedly say:
"As an AI..."

Do not repeatedly say:
"How can I assist you today?"

Do not repeat the user's question.

Remember what the user already told you.

Understand follow-up questions such as:

"what about that?"

"how much?"

"where do I get it?"

"and then?"

"what happens next?"

"what if I don't have that?"

"can I do it online?"

"where do I go?"

Guide the user step by step.

You can naturally say:

"Yeah, absolutely."

"Of course."

"Ah, got you."

"Don't worry, we can figure that out."

"Let me walk you through it."

"Okay, let's do it step by step."

Do not overuse these phrases.

============================================================
LANGUAGE
============================================================

The user's selected profile language is:

${language}

This is the DEFAULT language.

Always speak in the selected profile language.

If the selected language is English:
speak English.

If Dutch:
speak Dutch.

If German:
speak German.

If French:
speak French.

If Urdu:
speak Urdu.

If Ukrainian:
speak Ukrainian.

If the user explicitly says:

"Speak English"
"English please"
"Switch to English"

immediately switch to English.

If they explicitly request Urdu,
switch to Urdu.

If they explicitly request Ukrainian,
switch to Ukrainian.

If they explicitly request Dutch,
switch to Dutch.

If they explicitly request German or French,
switch accordingly.

Do not change language because of one accidentally
recognized word.

============================================================
VOICE CONVERSATION
============================================================

The user is speaking through a microphone.

Listen carefully.

Never intentionally talk over the user.

If the user interrupts you, stop your response and listen.

Do not manually cancel responses.

If speech recognition is unclear, ask naturally:

"Sorry, I didn't quite catch that. Could you say that again?"

============================================================
MAIN SUBJECTS
============================================================

Help with:

Dutch government
municipalities
BSN
DigiD
registration
residence documents
immigration practical information
official letters
healthcare
huisarts
health insurance
housing
renting
work
jobs
employment
study
education
money
banking
taxes
public transport
OV-chipkaart
OVpay
driving
driving licence
vehicles
parking
waste
Dutch phone numbers
SIM cards
travel
everyday life
finding services
planning

Do not become a general tutor.

If the request is completely unrelated,
politely ask the user to repeat themselves or
bring the conversation back to Netherlands-related help.

============================================================
NAVIGATION
============================================================

You have a function called:

navigate_to_page

Navigation is an additional capability.

Conversation comes first.

When the user clearly needs a section,
you SHOULD use the navigation function.

Examples:

User:
"I need help with public transport."

Say something natural such as:

"Of course. Let's open the transport section and figure it
out together."

Then call:

navigate_to_page({
  "path": "/transport"
})

User:
"I need help with housing."

→ /housing

User:
"I need help with my BSN."

→ /documents

User:
"I need help with DigiD."

→ /documents

User:
"I need a job."

→ /work

User:
"I need healthcare help."

→ /healthcare

User:
"I need help with money or taxes."

→ /money

User:
"I need help with driving."

→ /vehicles

User:
"I need help studying."

→ /study

User:
"I need help with waste."

→ /waste

User:
"I want to plan a trip."

→ /trip-planner

Do not navigate just because a keyword was casually mentioned.

For example:

"Public transport in the Netherlands can be expensive."

Do not automatically navigate.

But:

"I need help using public transport."

Navigate to /transport.

============================================================
AFTER NAVIGATION
============================================================

Navigation does NOT end the conversation.

After the function succeeds, continue helping.

Say naturally:

"Okay, we're here. Let's figure this out together."

or:

"Alright, let's continue from here."

or:

"Okay, now we can work through it."

Do not say:

"I successfully navigated you."

Do not sound like a system.

============================================================
USER PROFILE
============================================================

Name:
${profile.name || "Not provided"}

Age:
${profile.age || "Not provided"}

City:
${profile.city || "Not provided"}

Profile:
${profile.profile || "Not provided"}

Preferred language:
${language}

Use profile information only when relevant.

============================================================
SAFETY
============================================================

Never ask for:

DigiD password
DigiD PIN
bank password
card PIN
verification code
authentication code
passwords
secret credentials

Never ask the user to read these aloud.

============================================================
FINAL RULE
============================================================

You are a conversational Netherlands Guide first.

Navigation is a capability that helps the conversation.

Do not sacrifice warmth for navigation.

Do not sacrifice conversation for navigation.

When navigation is clearly useful, actually use the
navigation tool.

After navigation, keep helping the user.
`.trim();
  }

  /*
   * ============================================================
   * START VOICE
   * ============================================================
   */

  async function startVoice() {
    if (
      connected ||
      connecting
    ) {
      return;
    }

    setError("");
    setConnecting(true);

    try {
      /*
       * MICROPHONE
       */

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      localStreamRef.current =
        stream;

      /*
       * CREATE TEMPORARY REALTIME CREDENTIAL
       */

      const clientSecret =
        await createSession();

      /*
       * WEBRTC
       */

      const pc =
        new RTCPeerConnection();

      peerConnectionRef.current =
        pc;

      /*
       * REMOTE AUDIO
       */

      const audio =
        document.createElement(
          "audio"
        );

      audio.autoplay = true;

      audioElementRef.current =
        audio;

      pc.ontrack = (event) => {
        const remoteStream =
          event.streams[0];

        audio.srcObject =
          remoteStream;

        audio.play().catch(
          (error) => {
            console.warn(
              "Remote audio autoplay issue:",
              error
            );
          }
        );
      };

      /*
       * MICROPHONE
       */

      stream
        .getTracks()
        .forEach((track) => {
          pc.addTrack(
            track,
            stream
          );
        });

      /*
       * DATA CHANNEL
       */

      const dc =
        pc.createDataChannel(
          "oai-events"
        );

      dataChannelRef.current =
        dc;

      /*
       * ========================================================
       * DATA CHANNEL OPEN
       * ========================================================
       */

      dc.onopen = () => {
        console.log(
          "Realtime data channel OPEN"
        );

        setConnected(true);
        setConnecting(false);

        /*
         * SESSION CONFIGURATION
         */

        dc.send(
          JSON.stringify({
            type: "session.update",

            session: {
              type: "realtime",

              instructions:
                buildInstructions(),

              tools: [
                navigationTool,
              ],

              tool_choice: "auto",

              audio: {
                output: {
                  voice: "marin",
                },
              },
            },
          })
        );

        /*
         * FIRST GREETING ONLY
         */

        let alreadyGreeted =
          false;

        try {
          alreadyGreeted =
            localStorage.getItem(
              "netherlandsGuideVoiceGreeted"
            ) === "true";
        } catch {}

        if (
          !alreadyGreeted &&
          !greetingSentRef.current
        ) {
          greetingSentRef.current =
            true;

          setTimeout(() => {
            if (
              dc.readyState !==
              "open"
            ) {
              return;
            }

            try {
              dc.send(
                JSON.stringify({
                  type:
                    "response.create",

                  response: {
                    instructions:
                      `Give a very short friendly greeting in ${profile.language || "English"}.
Do not say "How can I assist you today?"
Say something natural like:
"Hi! I'm here. What do you need help with?"`,
                  },
                })
              );

              try {
                localStorage.setItem(
                  "netherlandsGuideVoiceGreeted",
                  "true"
                );
              } catch {}
            } catch (
              error
            ) {
              console.error(
                "Greeting error:",
                error
              );
            }
          }, 150);
        }
      };

      /*
       * ========================================================
       * WEBRTC CONNECTION STATE
       * ========================================================
       */

      pc.onconnectionstatechange =
        () => {
          console.log(
            "WebRTC connection:",
            pc.connectionState
          );

          if (
            pc.connectionState ===
            "connected"
          ) {
            setConnected(true);
            setConnecting(false);
          }

          if (
            pc.connectionState ===
              "failed" ||
            pc.connectionState ===
              "disconnected"
          ) {
            setConnected(false);
            setConnecting(false);
          }

          if (
            pc.connectionState ===
            "closed"
          ) {
            setConnected(false);
            setConnecting(false);
          }
        };

      /*
       * ========================================================
       * REALTIME EVENTS
       * ========================================================
       */

      dc.onmessage = (event) => {
        try {
          const message =
            JSON.parse(
              event.data
            );

          console.log(
            "Realtime event:",
            message.type
          );

          /*
           * USER STARTED SPEAKING
           *
           * IMPORTANT:
           * DO NOT PAUSE AUDIO HERE.
           *
           * Realtime handles interruption.
           */

          if (
            message.type ===
            "input_audio_buffer.speech_started"
          ) {
            console.log(
              "User started speaking"
            );

            setListening(true);
          }

          /*
           * USER STOPPED SPEAKING
           */

          if (
            message.type ===
            "input_audio_buffer.speech_stopped"
          ) {
            console.log(
              "User stopped speaking"
            );

            setListening(false);
          }

          /*
           * ASSISTANT RESPONSE STARTED
           */

          if (
            message.type ===
            "response.created"
          ) {
            setListening(false);
          }

          /*
           * NAVIGATION FUNCTION CALL
           */

          if (
            message.type ===
            "response.function_call_arguments.done"
          ) {
            handleFunctionCall(
              message
            );
          }

          /*
           * RESPONSE FINISHED
           */

          if (
            message.type ===
            "response.done"
          ) {
            setListening(false);
          }

          /*
           * ERRORS
           */

          if (
            message.type ===
            "error"
          ) {
            console.error(
              "Realtime error:",
              message
            );

            const errorMessage =
              message.error?.message ||
              "The voice assistant encountered an error.";

            setError(
              errorMessage
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Realtime event processing error:",
            error
          );
        }
      };

      /*
       * ========================================================
       * CREATE OFFER
       * ========================================================
       */

      const offer =
        await pc.createOffer();

      await pc.setLocalDescription(
        offer
      );

      /*
       * ========================================================
       * CONNECT TO REALTIME
       * ========================================================
       */

      const response =
        await fetch(
          "https://api.openai.com/v1/realtime/calls",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${clientSecret}`,

              "Content-Type":
                "application/sdp",
            },

            body:
              offer.sdp,
          }
        );

      if (
        !response.ok
      ) {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Could not connect to OpenAI Realtime."
        );
      }

      const answer =
        await response.text();

      /*
       * SET REMOTE DESCRIPTION
       */

      await pc.setRemoteDescription(
        {
          type: "answer",
          sdp: answer,
        }
      );

      /*
       * IMPORTANT:
       * Do not wait for anything else.
       */

      setConnected(true);
      setConnecting(false);

      console.log(
        "Netherlands Guide voice is ready."
      );
    } catch (
      error: any
    ) {
      console.error(
        "Voice connection error:",
        error
      );

      setError(
        error?.message ||
          "Could not start the voice assistant."
      );

      setConnected(false);
      setConnecting(false);

      disconnect();
    }
  }

  /*
   * ============================================================
   * HANDLE NAVIGATION FUNCTION
   * ============================================================
   */

  function handleFunctionCall(
    message: any
  ) {
    const {
      name,
      call_id,
      arguments: rawArguments,
    } = message;

    if (
      name !==
      "navigate_to_page"
    ) {
      return;
    }

    console.log(
      "Navigation function called:",
      rawArguments
    );

    let args:
      NavigationArguments;

    try {
      args =
        JSON.parse(
          rawArguments ||
            "{}"
        );
    } catch (
      error
    ) {
      console.error(
        "Navigation JSON error:",
        error
      );

      sendFunctionResult(
        call_id,
        {
          success: false,
          error:
            "Invalid navigation arguments.",
        }
      );

      return;
    }

    if (
      !ALLOWED_PATHS.includes(
        args.path
      )
    ) {
      console.error(
        "Blocked invalid navigation:",
        args.path
      );

      sendFunctionResult(
        call_id,
        {
          success: false,
          error:
            "That page is not available.",
        }
      );

      return;
    }

    console.log(
      "NAVIGATING TO:",
      args.path
    );

    /*
     * ACTUAL NEXT.JS NAVIGATION
     */

    router.push(
      args.path
    );

    /*
     * Tell the model the navigation succeeded.
     */

    sendFunctionResult(
      call_id,
      {
        success: true,
        navigated_to:
          args.path,
        message:
          "The requested page is now open. Continue helping the user naturally.",
      }
    );
  }

  /*
   * ============================================================
   * FUNCTION RESULT
   * ============================================================
   */

  function sendFunctionResult(
    callId: string,
    result: any
  ) {
    const dc =
      dataChannelRef.current;

    if (
      !dc ||
      dc.readyState !==
        "open"
    ) {
      console.warn(
        "Data channel is not open."
      );

      return;
    }

    try {
      /*
       * Send function output.
       */

      dc.send(
        JSON.stringify({
          type:
            "conversation.item.create",

          item: {
            type:
              "function_call_output",

            call_id:
              callId,

            output:
              JSON.stringify(
                result
              ),
          },
        })
      );

      /*
       * Ask assistant to continue.
       */

      dc.send(
        JSON.stringify({
          type:
            "response.create",
        })
      );
    } catch (
      error
    ) {
      console.error(
        "Could not send function result:",
        error
      );
    }
  }

  /*
   * ============================================================
   * DISCONNECT
   * ============================================================
   */

  function disconnect() {
    try {
      dataChannelRef.current?.close();
    } catch {}

    try {
      peerConnectionRef.current?.close();
    } catch {}

    if (
      localStreamRef.current
    ) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    if (
      audioElementRef.current
    ) {
      audioElementRef.current.pause();

      audioElementRef.current.srcObject =
        null;
    }

    dataChannelRef.current =
      null;

    peerConnectionRef.current =
      null;

    localStreamRef.current =
      null;

    audioElementRef.current =
      null;

    setConnected(false);
    setConnecting(false);
    setListening(false);
  }

  /*
   * ============================================================
   * MICROPHONE BUTTON
   * ============================================================
   */

  function handleMicClick() {
    if (connected) {
      disconnect();
      return;
    }

    startVoice();
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="flex items-center gap-3">

        {connecting && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <p className="text-sm font-semibold text-slate-800">
              Starting...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Connecting to Netherlands Guide
            </p>
          </div>
        )}

        {connected &&
          !connecting && (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
              <p className="text-sm font-semibold text-slate-800">
                {listening
                  ? "Listening..."
                  : "I'm here"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {listening
                  ? "Speak naturally — I'm listening."
                  : "You can talk to me anytime."}
              </p>
            </div>
          )}

        <button
          type="button"
          onClick={
            handleMicClick
          }
          disabled={
            connecting
          }
          aria-label={
            connected
              ? "Stop Netherlands Guide"
              : "Talk to Netherlands Guide"
          }
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            text-2xl
            shadow-2xl
            transition-all
            duration-200
            ${
              connecting
                ? "cursor-wait bg-slate-400 text-white"
                : listening
                ? "scale-105 bg-orange-500 text-white ring-4 ring-orange-200"
                : "bg-orange-500 text-white hover:scale-105 hover:bg-orange-600"
            }
          `}
        >
          {connecting
            ? "…"
            : connected
            ? "🎙️"
            : "🎤"}
        </button>
      </div>

      {error && (
        <div className="absolute bottom-20 right-0 w-80 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600 shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}