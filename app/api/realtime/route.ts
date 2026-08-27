import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getLanguageInfo(language: unknown) {
  const value = String(language || "English")
    .trim()
    .toLowerCase();

  if (value.includes("urdu") || value.includes("اردو")) {
    return {
      name: "Urdu",
      greeting: "سلام! میں نیدرلینڈز گائیڈ ہوں۔ میں آپ کی مدد کے لیے یہاں ہوں۔",
    };
  }

  if (
    value.includes("dutch") ||
    value.includes("nederlands") ||
    value === "nl"
  ) {
    return {
      name: "Dutch",
      greeting:
        "Hoi! Ik ben je Netherlands Guide. Ik ben hier om je te helpen.",
    };
  }

  if (
    value.includes("german") ||
    value.includes("deutsch") ||
    value === "de"
  ) {
    return {
      name: "German",
      greeting:
        "Hallo! Ich bin dein Netherlands Guide. Ich bin hier, um dir zu helfen.",
    };
  }

  if (
    value.includes("french") ||
    value.includes("français") ||
    value === "fr"
  ) {
    return {
      name: "French",
      greeting:
        "Bonjour ! Je suis votre guide des Pays-Bas. Je suis là pour vous aider.",
    };
  }

  if (
    value.includes("spanish") ||
    value.includes("español") ||
    value === "es"
  ) {
    return {
      name: "Spanish",
      greeting:
        "¡Hola! Soy tu guía de los Países Bajos. Estoy aquí para ayudarte.",
    };
  }

  if (
    value.includes("arabic") ||
    value.includes("العربية") ||
    value === "ar"
  ) {
    return {
      name: "Arabic",
      greeting:
        "مرحباً! أنا دليلك في هولندا. أنا هنا لمساعدتك.",
    };
  }

  if (
    value.includes("punjabi") ||
    value.includes("ਪੰਜਾਬੀ") ||
    value === "pa"
  ) {
    return {
      name: "Punjabi",
      greeting:
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ Netherlands Guide ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ।",
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
      greeting:
        "नमस्ते! मैं आपका Netherlands Guide हूँ। मैं आपकी मदद करने के लिए यहाँ हूँ।",
    };
  }

  if (
    value.includes("turkish") ||
    value.includes("türkçe") ||
    value === "tr"
  ) {
    return {
      name: "Turkish",
      greeting:
        "Merhaba! Ben senin Netherlands Guide'ınım. Sana yardımcı olmak için buradayım.",
    };
  }

  return {
    name: "English",
    greeting:
      "Hi! I'm your Netherlands Guide. I'm here to help you.",
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

You are a warm, friendly, caring woman helping someone living in or moving to the Netherlands.

You should sound natural and human, not robotic.

USER PROFILE

Name: ${name}
City: ${city}
Preferred language: ${language.name}

==================================================
LANGUAGE — VERY IMPORTANT
==================================================

The user's preferred language is ${language.name}.

YOU MUST SPEAK ${language.name} FROM YOUR VERY FIRST WORD.

Never randomly switch languages.

Never begin in English if the preferred language is not English.

Never begin in German, Spanish, Dutch, French, Arabic, Urdu, Hindi or another language unless that is the user's selected language.

Your first greeting MUST be in ${language.name}.

Suggested first greeting:

${language.greeting}

After the greeting, continue the entire conversation in ${language.name}.

Only change language if the user clearly asks you to.

If the user speaks another language but does not ask you to change languages, continue using ${language.name}.

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

Speak like a friendly person helping someone personally.

Do not sound like a call centre.

Do not sound robotic.

Keep voice answers relatively short.

Do not give unnecessarily long explanations.

==================================================
WHAT YOU CAN HELP WITH
==================================================

You can help users with:

- housing
- Dutch phone numbers
- SIM cards
- BSN
- DigiD
- documents
- healthcare
- health insurance
- medicines
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

You have a function called:

navigate_to_page

Use it when the user clearly wants to open a section of Netherlands Guide.

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

Never mention technical details.

Never mention APIs.

Never mention functions.

Never mention routes.

Never say that you clicked a button.

Speak naturally.

==================================================
VOICE
==================================================

This is a real-time voice conversation.

Listen naturally.

Respond naturally.

Do not repeat the user's entire sentence.

Keep answers concise.

Always respect the user's preferred language:

${language.name}
    `.trim();

    /*
     * IMPORTANT:
     *
     * We use the HTTP Realtime Sessions endpoint directly.
     *
     * This avoids the SDK URL/session mismatch.
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

          instructions,

          type: "realtime",
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
        sessionData
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