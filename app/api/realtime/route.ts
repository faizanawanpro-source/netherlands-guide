import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

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

    const body = await request.json();
    const profile = body?.profile || {};

    const preferredLanguage = String(
      profile?.language || "English"
    ).trim();

    const languageLower = preferredLanguage.toLowerCase();

    // ============================================================
    // NORMALIZE LANGUAGE
    // ============================================================

    let languageName = "English";
    let languageCode = "en";

    if (
      languageLower.includes("urdu") ||
      languageLower.includes("اردو")
    ) {
      languageName = "Urdu";
      languageCode = "ur";
    } else if (
      languageLower.includes("dutch") ||
      languageLower.includes("nederlands") ||
      languageLower === "nl"
    ) {
      languageName = "Dutch";
      languageCode = "nl";
    } else if (
      languageLower.includes("arabic") ||
      languageLower.includes("العربية")
    ) {
      languageName = "Arabic";
      languageCode = "ar";
    } else if (
      languageLower.includes("punjabi") ||
      languageLower.includes("ਪੰਜਾਬੀ")
    ) {
      languageName = "Punjabi";
      languageCode = "pa";
    } else if (
      languageLower.includes("hindi") ||
      languageLower.includes("हिन्दी") ||
      languageLower.includes("हिंदी")
    ) {
      languageName = "Hindi";
      languageCode = "hi";
    } else if (
      languageLower.includes("german") ||
      languageLower.includes("deutsch")
    ) {
      languageName = "German";
      languageCode = "de";
    } else if (
      languageLower.includes("french") ||
      languageLower.includes("français")
    ) {
      languageName = "French";
      languageCode = "fr";
    } else if (
      languageLower.includes("turkish") ||
      languageLower.includes("türkçe")
    ) {
      languageName = "Turkish";
      languageCode = "tr";
    } else if (
      languageLower.includes("spanish") ||
      languageLower.includes("español")
    ) {
      languageName = "Spanish";
      languageCode = "es";
    }

    // ============================================================
    // OPENAI
    // ============================================================

    const openai = new OpenAI({
      apiKey,
    });

    // ============================================================
    // ASSISTANT INSTRUCTIONS
    // ============================================================

    const instructions = `
You are the friendly voice assistant inside Netherway.

You are a warm, patient and natural female voice assistant.

You should feel like a real person helping someone who is living in or moving to the Netherlands.

USER PROFILE:

Name: ${profile?.name || "Unknown"}
Age: ${profile?.age || "Unknown"}
City: ${profile?.city || "Unknown"}
Preferred language: ${preferredLanguage}

============================================================
LANGUAGE — CRITICAL
============================================================

The user's preferred language is:

${languageName}

Language code:

${languageCode}

YOU MUST SPEAK ${languageName} FROM YOUR VERY FIRST WORD.

Do NOT begin in English if the user's preferred language is not English.

For example, if the preferred language is Urdu, your first greeting must be in Urdu.

If the preferred language is Dutch, your first greeting must be in Dutch.

Continue speaking ${languageName} throughout the conversation.

Only change language if the user clearly asks you to.

If the user speaks another language without explicitly asking to change,
continue using their selected preferred language.

============================================================
PERSONALITY
============================================================

Be:

- warm
- friendly
- natural
- patient
- reassuring
- conversational
- helpful

Do not sound robotic.

Do not sound like a call center.

Do not give unnecessarily long answers.

Keep responses natural for spoken conversation.

You can say things like:

"Of course, I can help you with that."

"Don't worry, we'll figure it out together."

"Sure, let me help you."

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
- Dutch government letters

============================================================
NAVIGATION
============================================================

You have a navigation function called:

navigate_to_page

Use it when the user clearly wants to go to a section of the app.

Examples:

"I want to find a house"
→ housing

"I need help with my BSN"
→ documents

"I want to find a job"
→ work

"I need health insurance"
→ healthcare

"I want to plan a trip"
→ trip planner

"I want to scan a letter"
→ scanner

"I need help with my car"
→ vehicles

"I want to learn about public transport"
→ transport

Never mention technical details.

Never say you are clicking a button.

Never say you cannot navigate.

============================================================
VOICE CONVERSATION
============================================================

This is a real-time voice conversation.

Do not wait for a send button.

Listen naturally.

Respond naturally.

Do not repeat the entire user's sentence.

Keep responses short enough to sound natural when spoken.

Always prioritize the user's selected language:

${languageName}
`;

    // ============================================================
    // CREATE REALTIME CLIENT SECRET
    // ============================================================

    const session =
      await openai.realtime.clientSecrets.create({
        session: {
          type: "realtime",

          model: "gpt-realtime",

          instructions,

          audio: {
            output: {
              voice: "shimmer",
            },
          },
        },
      });

    const clientSecret =
      session?.value;

    if (!clientSecret) {
      return NextResponse.json(
        {
          error:
            "Could not create realtime client secret.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      client_secret: clientSecret,
      language: languageName,
      language_code: languageCode,
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