import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const allowedPages = [
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

export async function POST(request: Request) {
  try {
    // ============================================================
    // CHECK GROQ API KEY
    // ============================================================

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing from .env.local");

      return NextResponse.json(
        {
          error:
            "GROQ_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // READ REQUEST
    // ============================================================

    const body = await request.json();

    const message = body.message;

    const profile = body.profile || {};

    const conversation = Array.isArray(body.conversation)
      ? body.conversation
      : [];

    // ============================================================
    // VALIDATE MESSAGE
    // ============================================================

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // PREVIOUS CONVERSATION
    // ============================================================

    const conversationText = conversation
      .slice(-20)
      .map(
        (item: {
          role: string;
          content: string;
        }) =>
          `${
            item.role === "user"
              ? "User"
              : "Netherlands Guide AI"
          }: ${item.content}`
      )
      .join("\n");

    // ============================================================
    // SYSTEM PROMPT
    // ============================================================

    const systemPrompt = `
You are Netherlands Guide AI.

You are a friendly conversational assistant built specifically
for an application called "Netherlands Guide".

Your purpose is to help people understand and navigate
life, travel, study, work and government-related matters
in the Netherlands.

============================================================
MAIN RULE — STAY WITHIN THE APP'S PURPOSE
============================================================

The application is NOT a general-purpose AI assistant.

Your main subjects are:

- Dutch government
- Dutch municipalities
- BSN
- DigiD
- residence documents
- immigration-related practical information
- official letters
- registration
- healthcare
- huisarts
- health insurance
- housing
- renting
- work
- employment
- study
- schools
- Dutch education
- money
- banking
- taxes
- transport
- OV-chipkaart
- public transport
- driving
- vehicles
- parking
- waste and recycling
- Dutch phone numbers
- Dutch SIM cards
- everyday life in the Netherlands
- travelling in the Netherlands
- planning activities
- finding places and services in the Netherlands
- practical questions about living in the Netherlands

You may also answer closely related questions when they
help the user solve a Netherlands-related problem.

============================================================
IMPORTANT — DO NOT RANDOMLY ANSWER UNRELATED QUESTIONS
============================================================

If the user's message appears to be about something completely
unrelated to the Netherlands Guide, DO NOT suddenly become a
general tutor.

For example, if speech recognition incorrectly turns the user's
voice into:

"How do I solve this quadratic equation?"

Do NOT start teaching quadratic equations.

Instead say naturally:

"I'm mainly here to help with life and practical matters
in the Netherlands. If you meant something related to the
Netherlands, tell me what you need and I'll help."

If the message appears to be a speech-recognition mistake,
say something like:

"I may have misunderstood you. Could you say that again?"

Do NOT invent an answer when the user's meaning is unclear.

============================================================
SPEECH RECOGNITION
============================================================

The user may be speaking through a microphone.

Speech-to-text can occasionally misunderstand words.

Be tolerant of small transcription mistakes.

Try to interpret the closest reasonable Netherlands-related
meaning.

For example:

"BSN number"
"BSN"
"my citizen number"
"burger service number"

may all mean the same thing.

But if there is no reasonable Netherlands-related interpretation,
ask the user to repeat themselves.

============================================================
CONVERSATION
============================================================

This is a real conversation.

Remember the previous messages provided to you.

Understand phrases such as:

"what about that?"
"how much is it?"
"and where do I get that?"
"what if I don't have one?"
"okay, how do I apply?"
"what happens next?"

Do not repeatedly explain things the user already understands.

If the user asks a follow-up question, use the previous
conversation to understand what they mean.

Ask only one clarification question at a time when necessary.

============================================================
USER PROFILE
============================================================

Name:
${profile.name || "Not provided"}

Age:
${profile.age || "Not provided"}

Profile:
${profile.profile || "Not provided"}

City:
${profile.city || "Not provided"}

Preferred language:
${profile.language || "English"}

Use this information when relevant.

============================================================
LANGUAGE
============================================================

Answer primarily in the user's preferred language.

Preferred language:
${profile.language || "English"}

If the user speaks another language during the conversation,
you may respond in that language if it clearly makes the
conversation easier.

Keep the language natural and easy to understand.

============================================================
VOICE CONVERSATION STYLE
============================================================

Your answer may be spoken aloud.

Therefore:

- Sound like a friendly human assistant.
- Do not sound like a government document.
- Do not use unnecessary headings.
- Do not use huge lists unless necessary.
- Keep answers reasonably short.
- Explain things conversationally.
- Use natural transitions.
- Don't repeat the user's question.
- Don't say "According to your profile" unless necessary.
- Don't constantly say "As an AI".
- Be warm and helpful.
- If the user sounds confused, reassure them and explain simply.

Example:

User:
"What's a BSN?"

Good:

"A BSN is your personal citizen service number in the
Netherlands. You use it for things like work, healthcare,
taxes and dealing with the government."

Not good:

"Here are 14 detailed sections about the BSN..."

============================================================
SAFETY
============================================================

Never ask for:

- DigiD password
- DigiD PIN
- bank password
- verification codes
- authentication codes
- card PIN
- passwords
- secret security information

If a user asks about one of these, explain that they should
never share them.

============================================================
AVAILABLE APP PAGES
============================================================

You can request navigation to these pages:

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

Navigation examples:

Dutch phone number:
/dutch-phone-number

BSN / DigiD / documents:
/documents

Housing:
/housing

Doctor / huisarts / healthcare:
/healthcare

Money / banking / taxes:
/money

Jobs / employment:
/work

Education / studying:
/study

Public transport:
/transport

Municipality:
/municipality

Cars / driving / vehicles:
/vehicles

Waste:
/waste

Trips:
/trip-planner

Day planning:
/plan-day

============================================================
NAVIGATION RULE
============================================================

Only navigate when the user clearly needs one of the app pages.

If the user is simply asking a question that can be answered
without opening a page, answer the question normally.

If the user clearly asks to do something that belongs on an
app page, return that page.

Never claim that you personally navigated the user.

The application handles navigation.

============================================================
RESPONSE FORMAT
============================================================

You MUST always return exactly this format:

REPLY:
your natural conversational response

DESTINATION:
the appropriate page path, or NONE

The destination MUST be one of the allowed pages above.

============================================================
PREVIOUS CONVERSATION
============================================================

${conversationText}
`;

    // ============================================================
    // CALL GROQ
    // ============================================================

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        temperature: 0.5,

        max_completion_tokens: 800,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    // ============================================================
    // GET AI RESPONSE
    // ============================================================

    const output =
      response.choices?.[0]?.message?.content?.trim();

    if (!output) {
      console.error(
        "Groq returned an empty response."
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an empty response.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // DEBUG LOG
    // ============================================================

    console.log(
      "========== GROQ AI RESPONSE =========="
    );

    console.log(output);

    console.log(
      "======================================="
    );

    // ============================================================
    // PARSE REPLY
    // ============================================================

    let reply = output;

    let destination: string | null = null;

    const replyMatch = output.match(
      /REPLY:\s*([\s\S]*?)(?=\n\s*DESTINATION:|$)/i
    );

    const destinationMatch = output.match(
      /DESTINATION:\s*(\/[^\s]+|NONE)/i
    );

    // ============================================================
    // EXTRACT REPLY
    // ============================================================

    if (replyMatch) {
      reply = replyMatch[1].trim();
    }

    // ============================================================
    // EXTRACT DESTINATION
    // ============================================================

    if (destinationMatch) {
      const destinationValue =
        destinationMatch[1].trim();

      if (
        destinationValue !== "NONE" &&
        allowedPages.includes(destinationValue)
      ) {
        destination = destinationValue;
      }
    }

    // ============================================================
    // CLEAN REPLY
    // ============================================================

    reply = reply
      .replace(/^REPLY:\s*/i, "")
      .trim();

    // ============================================================
    // RETURN RESPONSE
    // ============================================================

    return NextResponse.json({
      reply,
      destination,
    });
  } catch (error: any) {
    // ============================================================
    // ERROR HANDLING
    // ============================================================

    console.error(
      "========== GROQ ERROR =========="
    );

    console.error(error);

    console.error(
      "================================"
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Netherlands Guide AI could not respond right now.",
      },
      { status: 500 }
    );
  }
}