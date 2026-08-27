import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getLanguageInfo(language: unknown) {
  const value = String(language || "English")
    .trim()
    .toLowerCase();

  if (value.includes("urdu") || value.includes("اردو")) {
    return {
      name: "Urdu",
      greeting:
        "سلام! میں نیدرلینڈز گائیڈ ہوں۔ میں آپ کی مدد کے لیے یہاں ہوں۔",
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
    // ============================================================
    // OPENAI API KEY
    // ============================================================

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing. Add it to your Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // READ PROFILE
    // ============================================================

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

    // ============================================================
    // AI INSTRUCTIONS
    // ============================================================

    const instructions = `
You are the friendly voice assistant inside Netherlands Guide.

You are a warm, friendly, caring woman helping someone who lives in or is moving to the Netherlands.

You should sound natural, friendly and human.

Do not sound robotic.
Do not sound like a call centre.

USER PROFILE

Name: ${name}
City: ${city}
Preferred language: ${language.name}

==================================================
LANGUAGE — ABSOLUTE PRIORITY
==================================================

The user's preferred language is:

${language.name}

You MUST speak ${language.name} from your very first spoken word.

Your first greeting MUST be in ${language.name}.

Do NOT randomly choose another language.

Do NOT start with English unless English is the user's preferred language.

Do NOT start with Spanish, German, Dutch, French, Arabic, Urdu, Hindi, Punjabi or Turkish unless that is the user's preferred language.

Your first greeting should be:

${language.greeting}

After the greeting, continue speaking ${language.name}.

Only change language if the user clearly asks you to.

If the user speaks another language without asking to change language, continue using ${language.name}.

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

Keep answers relatively short because this is a voice conversation.

Do not give unnecessarily long speeches.

==================================================
WHAT YOU CAN HELP WITH
==================================================

Help users with:

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

When the user clearly wants to open a section of Netherlands Guide, use the navigate_to_page tool.

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

    // ============================================================
    // CREATE EPHEMERAL REALTIME CLIENT SECRET
    //
    // IMPORTANT:
    // The old /v1/realtime/sessions endpoint is no longer
    // the endpoint we should use for this browser flow.
    //
    // Current endpoint:
    // /v1/realtime/client_secrets
    // ============================================================

    const sessionResponse = await fetch(
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
            instructions,
            output_modalities: ["audio"],
            audio: {
              output: {
                voice: "shimmer",
              },
            },
          },
        }),
      }
    );

    // ============================================================
    // READ OPENAI RESPONSE
    // ============================================================

    const responseText =
      await sessionResponse.text();

    let sessionData: any = {};

    try {
      sessionData = JSON.parse(
        responseText
      );
    } catch {
      console.error(
        "OpenAI returned non-JSON:",
        responseText
      );
    }

    // ============================================================
    // HANDLE OPENAI ERROR
    // ============================================================

    if (!sessionResponse.ok) {
      console.error(
        "Realtime client secret creation failed:",
        sessionData || responseText
      );

      return NextResponse.json(
        {
          error:
            sessionData?.error?.message ||
            `Realtime client secret failed (${sessionResponse.status}).`,
        },
        {
          status: sessionResponse.status,
        }
      );
    }

    // ============================================================
    // CURRENT API RETURNS:
    //
    // {
    //   "value": "ek_....",
    //   "expires_at": ...,
    //   "session": {...}
    // }
    //
    // We need the "value".
    // ============================================================

    const clientSecret =
      sessionData?.value;

    if (!clientSecret) {
      console.error(
        "No client secret returned by OpenAI:",
        sessionData
      );

      return NextResponse.json(
        {
          error:
            "OpenAI created the Realtime client secret request but did not return a client secret.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // SEND SHORT-LIVED KEY TO BROWSER
    // ============================================================

    return NextResponse.json({
      client_secret: clientSecret,
      language: language.name,
    });
  } catch (error) {
    console.error(
      "REALTIME ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create the Realtime voice session.",
      },
      {
        status: 500,
      }
    );
  }
}