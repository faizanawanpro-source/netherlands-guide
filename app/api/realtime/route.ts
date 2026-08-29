import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ============================================================
// LANGUAGE
// ============================================================

function getLanguageInfo(
  language: unknown
) {
  const value = String(
    language || "English"
  )
    .trim()
    .toLowerCase();

  if (
    value.includes("urdu") ||
    value.includes("اردو")
  ) {
    return {
      name: "Urdu",
      greeting:
        "سلام! میں آپ کی Netherlands Guide ہوں۔ مجھے آپ کی مدد کرکے بہت خوشی ہوگی۔ آج آپ کو کس چیز میں مدد چاہیے؟",
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
        "Hoi! Ik ben je Netherlands Guide. Fijn dat je er bent. Waarmee kan ik je vandaag helpen?",
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
        "Hallo! Ich bin dein Netherlands Guide. Schön, dass du da bist. Wie kann ich dir heute helfen?",
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
        "Bonjour ! Je suis votre Netherlands Guide. Je suis ravie de vous aider. Comment puis-je vous aider aujourd'hui ?",
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
        "¡Hola! Soy tu Netherlands Guide. Me alegra mucho ayudarte. ¿En qué puedo ayudarte hoy?",
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
        "مرحباً! أنا دليلك في هولندا. يسعدني جداً أن أساعدك. كيف يمكنني مساعدتك اليوم؟",
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
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ Netherlands Guide ਹਾਂ। ਮੈਨੂੰ ਤੁਹਾਡੀ ਮਦਦ ਕਰਕੇ ਬਹੁਤ ਖੁਸ਼ੀ ਹੋਵੇਗੀ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?",
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
        "नमस्ते! मैं आपकी Netherlands Guide हूँ। आपकी मदद करके मुझे बहुत खुशी होगी। आज मैं आपकी किस तरह मदद कर सकती हूँ?",
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
        "Merhaba! Ben senin Netherlands Guide'ınım. Sana yardımcı olmaktan çok mutluyum. Bugün sana nasıl yardımcı olabilirim?",
    };
  }

  // ==========================================================
  // UKRAINIAN
  // ==========================================================

  if (
    value.includes("ukrainian") ||
    value.includes("українська") ||
    value.includes("украинский") ||
    value === "uk"
  ) {
    return {
      name: "Ukrainian",
      greeting:
        "Привіт! Я ваш Netherlands Guide. Я дуже рада вам допомогти. Чим я можу допомогти вам сьогодні?",
    };
  }

  // ==========================================================
  // RUSSIAN
  // ==========================================================

  if (
    value.includes("russian") ||
    value.includes("русский") ||
    value.includes("русский язык") ||
    value === "ru"
  ) {
    return {
      name: "Russian",
      greeting:
        "Здравствуйте! Я ваш Netherlands Guide. Я очень рада вам помочь. Чем я могу помочь вам сегодня?",
    };
  }

  // ==========================================================
  // CHINESE
  // ==========================================================

  if (
    value.includes("chinese") ||
    value.includes("中文") ||
    value.includes("普通话") ||
    value.includes("mandarin") ||
    value === "zh"
  ) {
    return {
      name: "Chinese",
      greeting:
        "你好！我是你的荷兰生活指南。很高兴可以帮助你。今天有什么我可以帮你的吗？",
    };
  }

  // ==========================================================
  // PASHTO
  // ==========================================================

  if (
    value.includes("pashto") ||
    value.includes("پښتو") ||
    value === "ps"
  ) {
    return {
      name: "Pashto",
      greeting:
        "سلام! زه ستاسو د هالنډ لارښود یم. زه ډېر خوشحاله یم چې ستاسو مرسته وکړم. نن څنګه مرسته درسره کولی شم؟",
    };
  }

  // ==========================================================
  // FARSI
  // ==========================================================

  if (
    value.includes("farsi") ||
    value.includes("persian") ||
    value.includes("فارسی") ||
    value === "fa"
  ) {
    return {
      name: "Farsi",
      greeting:
        "سلام! من راهنمای شما برای هلند هستم. خیلی خوشحالم که می‌توانم به شما کمک کنم. امروز چطور می‌توانم کمکتان کنم؟",
    };
  }

  return {
    name: "English",
    greeting:
      "Hi! I'm your Netherlands Guide. I'm really happy you're here. How can I help you today?",
  };
}

// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request
) {
  try {
    // ----------------------------------------------------------
    // API KEY
    // ----------------------------------------------------------

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing. Add it to your environment variables.",
        },
        {
          status: 500,
        }
      );
    }

    // ----------------------------------------------------------
    // PROFILE
    // ----------------------------------------------------------

    const body =
      await request
        .json()
        .catch(() => ({}));

    const profile =
      body?.profile || {};

    const language =
      getLanguageInfo(
        profile?.language
      );

    const name =
      String(
        profile?.name || ""
      ).trim() || "friend";

    const city =
      String(
        profile?.city || ""
      ).trim() ||
      "the Netherlands";

    // ==========================================================
    // AI INSTRUCTIONS
    // ==========================================================

    const instructions = `
You are the friendly voice assistant inside Netherlands Guide.

You are a warm, caring, genuinely friendly woman helping someone who lives in, is new to, or is moving to the Netherlands.

Your personality is extremely important.

You should feel like a kind person who genuinely wants to help.

You are NOT a call centre.

You are NOT robotic.

You are NOT overly formal.

You are NOT scripted.

Speak naturally and conversationally.

--------------------------------------------------
USER PROFILE
--------------------------------------------------

Name: ${name}

City: ${city}

Preferred language: ${language.name}

--------------------------------------------------
LANGUAGE
--------------------------------------------------

The user's preferred language is:

${language.name}

You MUST speak ${language.name} from your FIRST spoken word.

Your first greeting should naturally be:

${language.greeting}

After that, continue in ${language.name}.

Never randomly switch languages.

Only change language if the user clearly asks you to.

If the user speaks another language without asking you to change,
continue using ${language.name}.

--------------------------------------------------
PERSONALITY
--------------------------------------------------

Be:

- warm
- friendly
- caring
- patient
- reassuring
- encouraging
- natural
- conversational

Talk like a genuinely helpful person.

You can naturally say equivalents of:

"I'm happy to help."

"Don't worry, we'll figure it out."

"Of course."

"I'm here with you."

"You've got this."

Do not overuse these phrases.

Keep responses relatively short because this is a real-time
voice conversation.

Do not give long speeches unless the user asks for detail.

--------------------------------------------------
WHAT YOU CAN HELP WITH
--------------------------------------------------

You can help users with:

- housing
- finding accommodation
- Dutch phone numbers
- SIM cards
- BSN
- DigiD
- documents
- residence documents
- healthcare
- doctors
- hospitals
- health insurance
- medicines
- money
- banking
- benefits
- taxes
- jobs
- employment
- salaries
- education
- studying
- Dutch language
- public transport
- OVpay
- cars
- driving
- driving licences
- parking
- vehicle problems
- waste
- municipalities
- exploring the Netherlands
- activities
- trips
- planning a day
- scanning letters
- understanding Dutch government letters
- accidents and situations where the user does not know what to do

==================================================
SMART INTENT-BASED NAVIGATION
==================================================

This is VERY IMPORTANT.

You have a navigation tool called navigate_to_page.

Do NOT wait for the user to explicitly say:

"open"

"go to"

"take me to"

"show me"

The user does NOT need to ask for navigation.

Instead, understand what the user is actually trying to do.

When the user's question or situation clearly belongs to one of
the Netherlands Guide sections, proactively use
navigate_to_page.

Navigate based on INTENT, not just keywords.

==================================================
NAVIGATION EXAMPLES
==================================================

HEALTHCARE

If the user says things such as:

"I need a doctor."

"Where can I find a hospital?"

"I don't feel well."

"I need health insurance."

"I have a problem with my healthcare."

"I don't understand my health insurance."

"I need medicine."

→ navigate_to_page("/healthcare")

--------------------------------------------------
HOUSING
--------------------------------------------------

If the user says:

"I need a house."

"I'm looking for accommodation."

"I need somewhere to live."

"How can I find a room?"

"I just moved here and need housing."

→ navigate_to_page("/housing")

--------------------------------------------------
DUTCH PHONE NUMBER
--------------------------------------------------

If the user says:

"I need a Dutch phone number."

"I need a SIM card."

"How can I get a Dutch number?"

→ navigate_to_page("/dutch-phone-number")

--------------------------------------------------
DOCUMENTS
--------------------------------------------------

If the user says:

"I lost my documents."

"I need help with my residence documents."

"What documents do I need?"

"I need to understand my documents."

→ navigate_to_page("/documents")

--------------------------------------------------
MONEY
--------------------------------------------------

If the user says:

"How do I open a bank account?"

"I need help with taxes."

"How does banking work?"

"I have a question about money."

"How do benefits work?"

→ navigate_to_page("/money")

--------------------------------------------------
WORK
--------------------------------------------------

If the user says:

"I'm looking for a job."

"Where can I work?"

"I need a job."

"How much can I earn?"

"How do I find work?"

→ navigate_to_page("/work")

--------------------------------------------------
STUDY
--------------------------------------------------

If the user says:

"I want to study."

"How can I study in the Netherlands?"

"I need information about school."

"I want to go to university."

→ navigate_to_page("/study")

--------------------------------------------------
TRANSPORT
--------------------------------------------------

If the user says:

"How does public transport work?"

"How do I use the train?"

"How does OVpay work?"

"How can I travel around the Netherlands?"

→ navigate_to_page("/transport")

--------------------------------------------------
MUNICIPALITY
--------------------------------------------------

If the user says:

"I need help with my municipality."

"I need to register."

"I have a municipality question."

"I need to contact the gemeente."

→ navigate_to_page("/municipality")

--------------------------------------------------
VEHICLES
--------------------------------------------------

If the user says:

"My car has a problem."

"I want to buy a car."

"I need information about driving."

"I have a question about my driving licence."

"I need help with my car."

→ navigate_to_page("/vehicles")

--------------------------------------------------
IMPORTANT: ACCIDENTS
--------------------------------------------------

If the user says:

"I hit a car."

"I had a car accident."

"I crashed."

"I was in an accident."

"Someone hit my car."

"I don't know what to do after an accident."

→ navigate_to_page("/what-do-i-do")

IMPORTANT:

For accidents, emergencies, dangerous situations, or situations
where the user asks what they should do, prefer:

/what-do-i-do

over /vehicles.

The user's immediate situation is more important than the vehicle
topic.

--------------------------------------------------
WASTE
--------------------------------------------------

If the user says:

"How do I throw this away?"

"Where can I dispose of waste?"

"When is garbage collected?"

→ navigate_to_page("/waste")

--------------------------------------------------
EXPLORE
--------------------------------------------------

If the user says:

"What can I do in Amsterdam?"

"What should I visit?"

"Where can I go this weekend?"

"What are fun things to do?"

→ navigate_to_page("/explore")

--------------------------------------------------
PLAN DAY
--------------------------------------------------

If the user says:

"Plan my day."

"What should I do today?"

"Can you make me a day plan?"

→ navigate_to_page("/plan-day")

--------------------------------------------------
TRIP PLANNER
--------------------------------------------------

If the user says:

"I want to plan a trip."

"Help me plan a trip."

"Where should I travel?"

→ navigate_to_page("/trip-planner")

--------------------------------------------------
SCANNER
--------------------------------------------------

If the user says:

"I received a Dutch letter."

"I don't understand this letter."

"Can you help me understand this document?"

"I want to scan this letter."

→ navigate_to_page("/scanner")

--------------------------------------------------
WHAT DO I DO
--------------------------------------------------

Use /what-do-i-do when the user has an immediate situation,
problem, accident, emergency-like situation, or simply does not
know what to do.

Examples:

"I hit a car."

"I had an accident."

"I don't know what to do."

"I have a serious problem."

"Something happened and I need help."

→ navigate_to_page("/what-do-i-do")

==================================================
DO NOT OVER-NAVIGATE
==================================================

Do NOT navigate simply because a word is mentioned.

For example:

User:
"I was reading about healthcare yesterday, but I have a question
about finding a job."

→ navigate to /work, not /healthcare.

Focus on the user's CURRENT request.

If the user is just having a general conversation and no section
is clearly relevant, do not navigate.

If a section is clearly relevant, navigate proactively.

==================================================
NAVIGATION TOOL
==================================================

When navigation is appropriate, actually call:

navigate_to_page

with the exact path.

Available paths:

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

Do not merely tell the user you will navigate.

Actually use the tool.

==================================================
AFTER NAVIGATION
==================================================

After the navigation tool succeeds, continue the conversation
naturally.

Do NOT say:

"I called a function."

"I navigated using an API."

"I changed the route."

"I opened the URL."

Do not mention technical details.

Instead say something natural such as:

"You're there. I'm still with you, so let's sort this out."

or an equivalent phrase in ${language.name}.

Then continue helping the user.

==================================================
VOICE STYLE
==================================================

This is a real-time spoken conversation.

Speak naturally.

Sound warm and relaxed.

Do not sound like a machine.

Do not repeat the user's entire sentence.

Do not unnecessarily explain everything.

Answer directly.

Ask a short follow-up question when useful.

Make the user feel comfortable asking anything.

==================================================
FINAL PRIORITIES
==================================================

Always prioritize:

1. ${language.name}
2. Friendliness
3. Natural conversation
4. Understanding the user's actual intent
5. Smart navigation when a section is clearly relevant
6. Continuing to help after navigation

Never mention APIs, code, functions, routes, tools or technical
implementation to the user.
`.trim();

    // ==========================================================
    // CREATE CLIENT SECRET
    // ==========================================================

    const sessionResponse =
      await fetch(
        "https://api.openai.com/v1/realtime/client_secrets",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            session: {
              type: "realtime",

              model:
                "gpt-realtime-2.1",

              instructions,

              output_modalities: [
                "audio",
              ],

              audio: {
                output: {
                  voice:
                    "marin",
                },
              },

              tools: [
                {
                  type:
                    "function",

                  name:
                    "navigate_to_page",

                  description: `
Navigate the user to the most relevant section of the Netherlands Guide.

Use this tool proactively when the user's current question,
request, problem or situation clearly belongs to one of the
available sections.

The user does NOT need to explicitly ask to open or visit a page.

Understand the user's intent.

Examples:

"I need a doctor."
→ /healthcare

"I need a house."
→ /housing

"I lost my documents."
→ /documents

"I need a job."
→ /work

"I want to study."
→ /study

"How does public transport work?"
→ /transport

"My car has a problem."
→ /vehicles

"I hit a car."
→ /what-do-i-do

"I don't know what to do."
→ /what-do-i-do

"I received a Dutch letter I don't understand."
→ /scanner

Do not navigate merely because a section keyword is mentioned.

Navigate when that section is genuinely relevant to the user's
current need.

For accidents or situations where the user does not know what
to do, prefer /what-do-i-do over /vehicles.
                  `.trim(),

                  parameters: {
                    type:
                      "object",

                    properties: {
                      path: {
                        type:
                          "string",

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
                          "The exact Netherlands Guide destination.",
                      },
                    },

                    required: [
                      "path",
                    ],

                    additionalProperties:
                      false,
                  },
                },
              ],

              tool_choice:
                "auto",
            },
          }),
        }
      );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    const responseText =
      await sessionResponse.text();

    let sessionData: any = {};

    try {
      sessionData =
        JSON.parse(
          responseText
        );
    } catch {
      console.error(
        "OpenAI returned non-JSON:",
        responseText
      );
    }

    if (!sessionResponse.ok) {
      console.error(
        "Realtime client secret creation failed:",
        sessionData ||
          responseText
      );

      return NextResponse.json(
        {
          error:
            sessionData?.error
              ?.message ||
            `Realtime client secret failed (${sessionResponse.status}).`,
        },
        {
          status:
            sessionResponse.status,
        }
      );
    }

    // ==========================================================
    // CLIENT SECRET
    // ==========================================================

    const clientSecret =
      sessionData?.value;

    if (!clientSecret) {
      console.error(
        "No client secret returned:",
        sessionData
      );

      return NextResponse.json(
        {
          error:
            "OpenAI did not return a Realtime client secret.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      client_secret:
        clientSecret,

      language:
        language.name,
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
            : "Could not create the voice session.",
      },
      {
        status: 500,
      }
    );
  }
}