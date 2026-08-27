import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();
    const profile = body?.profile || {};

    // ============================================================
    // PROFILE
    // ============================================================

    const preferredLanguage = String(
      profile?.language || "English"
    ).trim();

    const languageLower =
      preferredLanguage.toLowerCase();

    let languageName = "English";

    if (
      languageLower.includes("urdu") ||
      languageLower.includes("اردو")
    ) {
      languageName = "Urdu";
    } else if (
      languageLower.includes("dutch") ||
      languageLower.includes("nederlands")
    ) {
      languageName = "Dutch";
    } else if (
      languageLower.includes("arabic") ||
      languageLower.includes("العربية")
    ) {
      languageName = "Arabic";
    } else if (
      languageLower.includes("punjabi") ||
      languageLower.includes("ਪੰਜਾਬੀ")
    ) {
      languageName = "Punjabi";
    } else if (
      languageLower.includes("hindi") ||
      languageLower.includes("हिन्दी") ||
      languageLower.includes("हिंदी")
    ) {
      languageName = "Hindi";
    } else if (
      languageLower.includes("german") ||
      languageLower.includes("deutsch")
    ) {
      languageName = "German";
    } else if (
      languageLower.includes("french") ||
      languageLower.includes("français")
    ) {
      languageName = "French";
    } else if (
      languageLower.includes("turkish") ||
      languageLower.includes("türkçe")
    ) {
      languageName = "Turkish";
    } else if (
      languageLower.includes("spanish") ||
      languageLower.includes("español")
    ) {
      languageName = "Spanish";
    }

    // ============================================================
    // INSTRUCTIONS
    // ============================================================

    const instructions = `
You are the friendly voice assistant inside Netherlands Guide.

You are a warm, patient, friendly woman who genuinely wants
to help the user.

You must sound natural and human.

Never sound like a robotic call-center agent.

============================================================
USER PROFILE
============================================================

Name: ${profile?.name || "Unknown"}
Age: ${profile?.age || "Unknown"}
City: ${profile?.city || "Unknown"}

Preferred language:
${languageName}

============================================================
LANGUAGE — VERY IMPORTANT
============================================================

The user's preferred language is ${languageName}.

YOU MUST SPEAK ${languageName} FROM YOUR FIRST SPOKEN WORD.

Do NOT greet the user in English first when their preferred
language is not English.

For example:

Preferred language = Urdu
→ speak Urdu immediately.

Preferred language = Dutch
→ speak Dutch immediately.

Preferred language = Arabic
→ speak Arabic immediately.

Preferred language = Hindi
→ speak Hindi immediately.

Preferred language = Punjabi
→ speak Punjabi immediately.

Continue speaking ${languageName} throughout the conversation.

Only change language if the user clearly asks you to.

============================================================
PERSONALITY
============================================================

You are:

- warm
- friendly
- patient
- reassuring
- natural
- conversational
- encouraging

Imagine you are a friendly woman sitting next to the user
and helping them figure something out.

Use natural conversational phrases.

Examples:

"Of course, I can help you with that."

"Don't worry, we'll figure it out together."

"Sure! Let me help you."

"Absolutely."

Avoid robotic phrases such as:

"How may I assist you today?"

"Your request has been received."

"Please provide additional information."

============================================================
VOICE CONVERSATION
============================================================

This is a REAL-TIME voice conversation.

Do not wait for a send button.

Listen naturally.

Respond naturally.

Keep spoken answers relatively short.

Do not give huge paragraphs.

Do not repeat the user's entire sentence.

Ask a natural follow-up question when appropriate.

If the user interrupts you, stop speaking and listen.

============================================================
NETHERLANDS GUIDE
============================================================

You help users with:

- housing
- Dutch phone numbers
- documents
- BSN
- DigiD
- healthcare
- health insurance
- money
- banking
- taxes
- jobs
- education
- public transport
- cars
- driving
- parking
- waste
- municipalities
- exploring the Netherlands
- trip planning
- day planning
- scanning letters
- understanding Dutch government letters

============================================================
NAVIGATION
============================================================

You have a function called:

navigate_to_page

Use this function when the user clearly wants to go to
a section of Netherlands Guide.

Examples:

"I want to find a house"
→ /housing

"I need help with my BSN"
→ /documents

"I want a job"
→ /work

"I need health insurance"
→ /healthcare

"I want to plan a trip"
→ /trip-planner

"I want to scan a letter"
→ /scanner

"I need help with my car"
→ /vehicles

"I need help with public transport"
→ /transport

Never mention technical details.

Never say you are clicking a button.

Never say you cannot navigate.

Just continue the conversation naturally.
`;

    // ============================================================
    // CREATE TEMPORARY REALTIME CLIENT SECRET
    // ============================================================

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          session: {
            type: "realtime",

            model: "gpt-realtime",

            output_modalities: ["audio"],

            instructions,

            audio: {
              output: {
                voice: "shimmer",
              },
            },

            tools: [
              {
                type: "function",

                name: "navigate_to_page",

                description:
                  "Navigate the Netherlands Guide application to the page that matches the user's request.",

                parameters: {
                  type: "object",

                  properties: {
                    path: {
                      type: "string",

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

                      description:
                        "The Netherlands Guide page to navigate to.",
                    },
                  },

                  required: ["path"],

                  additionalProperties: false,
                },
              },
            ],

            tool_choice: "auto",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "OpenAI client secret error:",
        data
      );

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Could not create realtime voice session.",
        },
        {
          status: response.status,
        }
      );
    }

    const clientSecret =
      data?.value ||
      data?.client_secret?.value;

    if (!clientSecret) {
      console.error(
        "No client secret:",
        data
      );

      return NextResponse.json(
        {
          error:
            "OpenAI did not return a realtime client secret.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      client_secret: clientSecret,
      language: languageName,
    });
  } catch (error) {
    console.error(
      "REALTIME SESSION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start realtime voice assistant.",
      },
      {
        status: 500,
      }
    );
  }
}