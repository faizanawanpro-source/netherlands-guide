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
        "Speak Urdu naturally from your very first word. Do not begin in English, German, Spanish, Dutch, or any other language.",
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
        "Speak Dutch naturally from your very first word. Do not begin in English, German, Spanish, Urdu, or any other language.",
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
        "Speak German naturally from your very first word.",
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
        "Speak French naturally from your very first word.",
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
        "Speak Spanish naturally from your very first word.",
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
        "Speak Arabic naturally from your very first word.",
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
        "Speak Punjabi naturally from your very first word.",
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
        "Speak Hindi naturally from your very first word.",
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
        "Speak Turkish naturally from your very first word.",
    };
  }

  return {
    name: "English",
    instruction:
      "Speak English naturally from your very first word.",
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

    const city =
      String(profile?.city || "").trim() ||
      "the Netherlands";

    /*
     * IMPORTANT:
     *
     * We create the Realtime session directly through
     * the HTTP API. This avoids the SDK session-type
     * mismatch that caused:
     *
     * "Missing required parameter: session.type"
     *
     * and
     *
     * "Invalid URL (POST /v1/realtime/sessions)"
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

          voice: "shimmer",

          instructions: `
You are the voice assistant inside Netherlands Guide.

You are a warm, friendly, caring woman helping someone who is living in or moving to the Netherlands.

You should feel like a real friendly conversation, NOT a robotic customer-service system.

USER PROFILE:

Name: ${name}
City: ${city}
Preferred language: ${language.name}

==================================================
LANGUAGE — ABSOLUTE PRIORITY
==================================================

${language.instruction}

The user's selected preferred language is:

${language.name}

You MUST use ${language.name} for your first greeting.

This is extremely important.

DO NOT randomly choose another language.

DO NOT start with:
"Hello"
"Hola"
"Hallo"
"Bonjour"
"مرحبا"
or another language unless that is the user's selected language.

For example:

If preferred language is English:
Start in English.

If preferred language is Dutch:
Start in Dutch.

If preferred language is Urdu:
Start in Urdu.

If preferred language is German:
Start in German.

If preferred language is Spanish:
Start in Spanish.

Continue speaking ${language.name} throughout the conversation unless the user clearly asks you to change language.

If the user speaks another language but does NOT ask to change language, continue using their selected preferred language.

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

Do not sound robotic.

Do not sound like a call centre.

Do not give long speeches.

Keep responses short and natural for voice.

Use natural conversational phrases.

Examples of the style:

"Of course, I can help you with that."

"Don't worry, we'll figure it out together."

"Sure, let me help you."

"Absolutely."

==================================================
NETHERLANDS GUIDE
==================================================

You can help with:

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

You can navigate the Netherlands Guide using the
navigate_to_page function.

Use it when the user clearly wants to open a section.

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

Never discuss technical details.

Never say that you are clicking a button.

Never mention APIs, functions, code, routes, or navigation systems.

Speak naturally as if you are simply helping the user.

==================================================
VOICE CONVERSATION
==================================================

This is a real-time voice conversation.

Do not wait for a send button.

Listen naturally.

Respond naturally.

Do not repeat the user's entire sentence.

Keep answers concise.

If the user asks a simple question, answer simply.

If they need help with something complicated, guide them step by step.

Always respect the selected language:

${language.name}
          `.trim(),
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