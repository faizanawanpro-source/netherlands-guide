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
        "Speak Urdu from the very first word. Never begin in English or another language.",
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
        "Speak Dutch from the very first word. Never begin in English or another language.",
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
        "Speak German from the very first word. Never begin in English or another language.",
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
        "Speak French from the very first word. Never begin in English or another language.",
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
        "Speak Spanish from the very first word. Never begin in English or another language.",
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
        "Speak Arabic from the very first word. Never begin in English or another language.",
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
        "Speak Punjabi from the very first word. Never begin in English or another language.",
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
        "Speak Hindi from the very first word. Never begin in English or another language.",
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
        "Speak Turkish from the very first word. Never begin in English or another language.",
    };
  }

  if (
    value.includes("italian") ||
    value.includes("italiano") ||
    value === "it"
  ) {
    return {
      name: "Italian",
      instruction:
        "Speak Italian from the very first word. Never begin in English or another language.",
    };
  }

  if (
    value.includes("portuguese") ||
    value.includes("português") ||
    value === "pt"
  ) {
    return {
      name: "Portuguese",
      instruction:
        "Speak Portuguese from the very first word. Never begin in English or another language.",
    };
  }

  if (
    value.includes("polish") ||
    value.includes("polski") ||
    value === "pl"
  ) {
    return {
      name: "Polish",
      instruction:
        "Speak Polish from the very first word. Never begin in English or another language.",
    };
  }

  return {
    name: "English",
    instruction:
      "Speak English from the very first word.",
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
        { status: 500 }
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

    const age =
      String(profile?.age || "").trim() ||
      "unknown";

    const city =
      String(profile?.city || "").trim() ||
      "the Netherlands";

    const userProfile = `
Name: ${name}
Age: ${age}
City: ${city}
Preferred language: ${language.name}
`;

    /*
     * IMPORTANT:
     *
     * We use the Realtime calls endpoint because this is
     * the connection method that works with the current
     * WebRTC implementation.
     */

    const sessionResponse = await fetch(
      "https://api.openai.com/v1/realtime/calls",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "realtime",
          model: "gpt-4o-realtime-preview",
          audio: {
            output: {
              voice: "shimmer",
            },
          },
          instructions: `
You are the friendly voice assistant inside Netherway.

You are a warm, friendly and patient woman helping people living in or moving to the Netherlands.

You should sound natural and human.

Do NOT sound like a call-centre robot.

==================================================
USER PROFILE
==================================================

${userProfile}

==================================================
LANGUAGE — EXTREMELY IMPORTANT
==================================================

The user's selected preferred language is:

${language.name}

${language.instruction}

THIS LANGUAGE RULE HAS THE HIGHEST PRIORITY.

The very first word you speak MUST be in ${language.name}.

Do not randomly select another language.

Do not start with English.

Do not start with Spanish.

Do not start with German.

Do not start with Dutch.

Do not start with French.

Do not start with Arabic.

Do not start with Urdu.

Only speak ${language.name} unless the user clearly asks you to change language.

If the user says something in another language but does not explicitly ask to change their preferred language, continue speaking ${language.name}.

==================================================
FIRST GREETING
==================================================

When the voice conversation starts, greet the user briefly.

The greeting MUST be in ${language.name}.

Use the user's name if natural.

Keep the greeting short.

Do not explain why you are using the language.

Do not mention the profile.

Do not mention APIs or technical details.

==================================================
PERSONALITY
==================================================

Be:

- warm
- friendly
- patient
- reassuring
- natural
- conversational
- encouraging

Speak like a friendly woman helping someone personally.

Keep voice responses relatively short.

Do not give huge paragraphs.

If the user asks a simple question, give a simple answer.

If the user needs help with something complicated, guide them step by step.

==================================================
NETHERLANDS GUIDE
==================================================

You can help with:

- housing
- Dutch phone numbers
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

You have access to:

navigate_to_page

Use it when the user clearly wants to open a section of Netherway.

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

When navigation is appropriate, use the function.

Never mention technical details.

Never say "I'm clicking a button".

Never mention APIs.

Never mention routes.

Never mention code.

==================================================
VOICE
==================================================

This is a real-time voice conversation.

Listen naturally.

Respond naturally.

Do not repeat the entire user's sentence.

Keep answers conversational.

Always respect the selected preferred language:

${language.name}
          `.trim(),
        }),
      }
    );

    const responseText =
      await sessionResponse.text();

    let sessionData: any = {};

    try {
      sessionData =
        JSON.parse(responseText);
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
        "No client secret returned:",
        sessionData
      );

      return NextResponse.json(
        {
          error:
            "Realtime session was created, but no client secret was returned.",
        },
        { status: 500 }
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
      { status: 500 }
    );
  }
}