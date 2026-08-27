import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getLanguageInfo(language: unknown) {
  const value = String(language || "English")
    .trim()
    .toLowerCase();

  if (value.includes("urdu") || value.includes("اردو")) {
    return {
      name: "Urdu",
      instruction:
        "Speak Urdu naturally from the very first word.",
    };
  }

  if (
    value.includes("dutch") ||
    value.includes("nederlands") ||
    value === "nl"
  ) {
    return {
      name: "Dutch",
      instruction:
        "Speak Dutch naturally from the very first word.",
    };
  }

  if (
    value.includes("german") ||
    value.includes("deutsch") ||
    value === "de"
  ) {
    return {
      name: "German",
      instruction:
        "Speak German naturally from the very first word.",
    };
  }

  if (
    value.includes("french") ||
    value.includes("français") ||
    value === "fr"
  ) {
    return {
      name: "French",
      instruction:
        "Speak French naturally from the very first word.",
    };
  }

  if (
    value.includes("spanish") ||
    value.includes("español") ||
    value === "es"
  ) {
    return {
      name: "Spanish",
      instruction:
        "Speak Spanish naturally from the very first word.",
    };
  }

  if (
    value.includes("arabic") ||
    value.includes("العربية") ||
    value === "ar"
  ) {
    return {
      name: "Arabic",
      instruction:
        "Speak Arabic naturally from the very first word.",
    };
  }

  if (
    value.includes("punjabi") ||
    value.includes("ਪੰਜਾਬੀ") ||
    value === "pa"
  ) {
    return {
      name: "Punjabi",
      instruction:
        "Speak Punjabi naturally from the very first word.",
    };
  }

  if (
    value.includes("hindi") ||
    value.includes("हिन्दी") ||
    value.includes("हिंदी") ||
    value === "hi"
  ) {
    return {
      name: "Hindi",
      instruction:
        "Speak Hindi naturally from the very first word.",
    };
  }

  if (
    value.includes("turkish") ||
    value.includes("türkçe") ||
    value === "tr"
  ) {
    return {
      name: "Turkish",
      instruction:
        "Speak Turkish naturally from the very first word.",
    };
  }

  return {
    name: "English",
    instruction:
      "Speak English naturally from the very first word.",
  };
}

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

    const body = await request.json().catch(() => ({}));

    const profile = body?.profile || {};

    const language = getLanguageInfo(
      profile?.language
    );

    const name =
      String(profile?.name || "").trim() ||
      "friend";

    const city =
      String(profile?.city || "").trim() ||
      "the Netherlands";

    const instructions = `
You are the friendly voice assistant inside Netherlands Guide.

You are a warm, friendly and caring woman helping someone living in or moving to the Netherlands.

You must sound natural and conversational.

USER PROFILE

Name: ${name}
City: ${city}
Preferred language: ${language.name}

==================================================
LANGUAGE
==================================================

The user's preferred language is:

${language.name}

${language.instruction}

THIS IS VERY IMPORTANT:

You MUST speak ${language.name} from your FIRST spoken word.

Do NOT randomly choose another language.

Do NOT start in English if the user's preferred language is not English.

Do NOT start with:
"Hello"
"Hola"
"Hallo"
"Bonjour"
"مرحبا"

unless that language is actually the user's selected language.

If the user's preferred language is English:
speak English.

If it is Dutch:
speak Dutch.

If it is Urdu:
speak Urdu.

If it is German:
speak German.

If it is Spanish:
speak Spanish.

If it is French:
speak French.

If it is Arabic:
speak Arabic.

If it is Punjabi:
speak Punjabi.

If it is Hindi:
speak Hindi.

If it is Turkish:
speak Turkish.

Continue using ${language.name} throughout the conversation.

Only change language if the user clearly asks you to.

==================================================
PERSONALITY
==================================================

You are:

- warm
- friendly
- patient
- reassuring
- natural
- conversational
- encouraging

Sound like a friendly woman helping someone personally.

Do not sound like a call centre.

Do not sound robotic.

Do not give huge paragraphs.

Keep voice responses short and natural.

==================================================
NETHERLANDS GUIDE
==================================================

You help users with:

- housing
- phone numbers
- SIM cards
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
- trips
- planning a day
- scanning letters
- understanding Dutch government letters

==================================================
NAVIGATION
==================================================

You can use the navigate_to_page function when the user clearly asks to open a section.

Available pages:

Dashboard:
/dashboard

Dutch phone number:
/dutch-phone-number

Housing:
/housing

Documents:
/documents

Healthcare:
/healthcare

Money:
/money

Work:
/work

Study:
/study

Transport:
/transport

Municipality:
/municipality

Vehicles:
/vehicles

Waste:
/waste

Explore:
/explore

Plan day:
/plan-day

Trip planner:
/trip-planner

Scanner:
/scanner

Help:
/what-do-i-do

When navigation is appropriate, use the navigation function.

Never mention technical details.

Never mention APIs.

Never mention code.

Never mention routes.

Never say you are clicking a button.

Simply help the user naturally.

==================================================
VOICE
==================================================

This is a real-time voice conversation.

Listen naturally.

Respond naturally.

Do not repeat the entire user's sentence.

Keep responses concise.

If the user asks a simple question, answer simply.

If something requires multiple steps, guide them step by step.

Always respect the selected preferred language:

${language.name}
`.trim();

    /*
     * Create the ephemeral Realtime client secret.
     *
     * IMPORTANT:
     * This request is JSON.
     *
     * The browser will later use the returned client
     * secret with /v1/realtime/calls using application/sdp.
     */

    const sessionResponse = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "gpt-4o-realtime-preview",

          type: "realtime",

          instructions,

          audio: {
            output: {
              voice: "shimmer",
            },
          },
        }),
      }
    );

    const responseText =
      await sessionResponse.text();

    let sessionData: any = {};

    try {
      sessionData = JSON.parse(
        responseText
      );
    } catch {
      console.error(
        "Realtime returned non-JSON:",
        responseText
      );
    }

    if (!sessionResponse.ok) {
      console.error(
        "Realtime session creation failed:",
        sessionData || responseText
      );

      return NextResponse.json(
        {
          error:
            sessionData?.error?.message ||
            `Realtime session failed (${sessionResponse.status}).`,
        },
        {
          status: sessionResponse.status,
        }
      );
    }

    const clientSecret =
      sessionData?.client_secret?.value;

    if (!clientSecret) {
      console.error(
        "No Realtime client secret returned:",
        sessionData
      );

      return NextResponse.json(
        {
          error:
            "Realtime session was created, but no client secret was returned.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      client_secret: clientSecret,
      language: language.name,
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