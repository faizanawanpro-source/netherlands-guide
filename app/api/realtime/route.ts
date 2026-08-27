import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getLanguage(language: unknown) {
  const value = String(language || "English")
    .trim()
    .toLowerCase();

  if (value.includes("urdu") || value.includes("اردو")) {
    return { name: "Urdu", code: "ur" };
  }

  if (
    value.includes("dutch") ||
    value.includes("nederlands") ||
    value === "nl"
  ) {
    return { name: "Dutch", code: "nl" };
  }

  if (
    value.includes("german") ||
    value.includes("deutsch") ||
    value === "de"
  ) {
    return { name: "German", code: "de" };
  }

  if (
    value.includes("arabic") ||
    value.includes("العربية") ||
    value === "ar"
  ) {
    return { name: "Arabic", code: "ar" };
  }

  if (
    value.includes("hindi") ||
    value.includes("हिन्दी") ||
    value.includes("हिंदी") ||
    value === "hi"
  ) {
    return { name: "Hindi", code: "hi" };
  }

  if (
    value.includes("punjabi") ||
    value.includes("ਪੰਜਾਬੀ") ||
    value === "pa"
  ) {
    return { name: "Punjabi", code: "pa" };
  }

  if (
    value.includes("french") ||
    value.includes("français") ||
    value === "fr"
  ) {
    return { name: "French", code: "fr" };
  }

  if (
    value.includes("spanish") ||
    value.includes("español") ||
    value === "es"
  ) {
    return { name: "Spanish", code: "es" };
  }

  if (
    value.includes("turkish") ||
    value.includes("türkçe") ||
    value === "tr"
  ) {
    return { name: "Turkish", code: "tr" };
  }

  if (
    value.includes("italian") ||
    value.includes("italiano") ||
    value === "it"
  ) {
    return { name: "Italian", code: "it" };
  }

  if (
    value.includes("portuguese") ||
    value.includes("português") ||
    value === "pt"
  ) {
    return { name: "Portuguese", code: "pt" };
  }

  if (
    value.includes("polish") ||
    value.includes("polski") ||
    value === "pl"
  ) {
    return { name: "Polish", code: "pl" };
  }

  return {
    name: "English",
    code: "en",
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

    const body = await request.json();

    const profile = body?.profile || {};

    const language = getLanguage(
      profile?.language
    );

    const instructions = `
You are the friendly voice assistant inside Netherway.

You are a warm, friendly, natural female voice assistant.

You help people understand and navigate life in the Netherlands.

USER PROFILE:

Name: ${profile?.name || "Unknown"}
Age: ${profile?.age || "Unknown"}
City: ${profile?.city || "Unknown"}
Preferred language: ${language.name}

==================================================
VERY IMPORTANT LANGUAGE RULE
==================================================

The user's preferred language is:

${language.name}

You MUST speak ${language.name}.

You MUST start your very first word in ${language.name}.

DO NOT start in English unless the preferred language is English.

DO NOT start in German.

DO NOT start in Dutch.

DO NOT guess the language.

DO NOT automatically change languages.

The saved profile language is authoritative.

If the profile says English:
Speak English.

If the profile says Urdu:
Speak Urdu.

If the profile says Dutch:
Speak Dutch.

If the profile says German:
Speak German.

If the profile says Arabic:
Speak Arabic.

If the profile says Hindi:
Speak Hindi.

Continue using ${language.name} unless the user explicitly asks you to change language.

==================================================
PERSONALITY
==================================================

Be warm, friendly, patient and reassuring.

Sound like a friendly woman helping someone personally.

Do not sound robotic.

Do not sound like a call centre.

Keep answers natural and relatively short.

Do not give huge paragraphs.

Have a real conversation.

==================================================
NAVIGATION
==================================================

When the user clearly wants to open a section of Netherway,
use the navigate_to_page function.

Available pages include:

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

Never mention technical details.

Never say you are clicking a button.

Never mention APIs or functions.

==================================================
VOICE
==================================================

This is a real-time voice conversation.

Listen naturally.

Respond naturally.

Do not wait for a send button.

Do not repeat the user's entire sentence.

Always speak ${language.name}.
`;

    // ============================================================
    // CREATE REALTIME SESSION
    // ============================================================

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          session: {
            type: "realtime",

            model: "gpt-4o-realtime-preview",

            instructions,

            audio: {
              output: {
                voice: "shimmer",
              },
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Realtime session creation failed:",
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
      data?.client_secret?.value;

    if (!clientSecret) {
      console.error(
        "Realtime response did not contain client secret:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Realtime session was created but no client secret was returned.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      client_secret: clientSecret,
      language: language.name,
      language_code: language.code,
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