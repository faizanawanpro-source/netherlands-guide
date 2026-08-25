import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing.");

      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const profile = body?.profile || {};
    const language = profile.language || "English";

    const allowedPaths = [
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

    const navigationTool = {
      type: "function",
      name: "navigate_to_page",
      description:
        "Navigate the user to a relevant Netherlands Guide section when clearly useful.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            enum: allowedPaths,
            description:
              "The Netherlands Guide page to open.",
          },
          reason: {
            type: "string",
            description:
              "Brief reason why this page is useful.",
          },
        },
        required: ["path"],
      },
    };

    const instructions = `
You are Netherlands Guide AI.

You are a warm, friendly female voice assistant helping people
with practical everyday life in the Netherlands.

Speak naturally and conversationally.

Be warm, friendly, patient and reassuring.

Keep answers relatively short.

Do not sound robotic.

Do not repeatedly say "As an AI".

Do not repeatedly say "How can I assist you today?"

Do not repeat the user's question.

Remember the conversation and understand follow-up questions.

The user's selected language is:

${language}

Use that language as the default language.

If the user explicitly asks to change language,
immediately switch to the requested language.

You help with:

- Dutch government
- municipalities
- BSN
- DigiD
- registration
- residence documents
- immigration practical information
- official letters
- healthcare
- huisarts
- health insurance
- housing
- renting
- work
- jobs
- employment
- studying
- education
- money
- banking
- taxes
- public transport
- OV-chipkaart
- OVpay
- driving
- driving licence
- vehicles
- parking
- waste
- Dutch phone numbers
- SIM cards
- travelling
- finding services
- planning

You are primarily a Netherlands Guide.

If something is completely unrelated to life in the
Netherlands, politely bring the conversation back to
Netherlands-related help.

VOICE:

The user is speaking through a microphone.

Listen carefully.

Do not intentionally talk over the user.

If the user interrupts you, stop and listen.

NAVIGATION:

You have a tool called navigate_to_page.

Use it when navigation is clearly useful.

Examples:

Public transport -> /transport
BSN or DigiD -> /documents
Work or jobs -> /work
Healthcare -> /healthcare
Housing -> /housing
Money or taxes -> /money
Study -> /study
Driving -> /vehicles
Waste -> /waste
Trip planning -> /trip-planner

Do not navigate merely because a keyword was mentioned.

After navigation, continue helping the user naturally.

Do not say:
"I successfully navigated you."

Instead say something natural such as:
"Okay, we're here. Let's figure this out together."

USER PROFILE:

Name:
${profile.name || "Not provided"}

Age:
${profile.age || "Not provided"}

City:
${profile.city || "Not provided"}

Profile:
${profile.profile || "Not provided"}

Preferred language:
${language}

Use profile information only when relevant.

SAFETY:

Never ask the user for:

- DigiD password
- DigiD PIN
- bank password
- card PIN
- verification code
- authentication code
- passwords
- secret credentials

Never ask the user to read these aloud.

You are a conversational guide first.

Navigation is an additional capability.

Keep helping the user naturally.
`.trim();

    console.log(
      "Creating OpenAI Realtime client secret..."
    );

    const openAIResponse = await fetch(
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
            tools: [navigationTool],
            tool_choice: "auto",
            audio: {
              output: {
                voice: "marin",
              },
            },
          },
        }),
      }
    );

    const responseText =
      await openAIResponse.text();

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "OpenAI returned non-JSON:",
        responseText
      );

      return NextResponse.json(
        {
          error:
            "OpenAI returned an invalid response.",
        },
        { status: 500 }
      );
    }

    if (!openAIResponse.ok) {
      console.error(
        "OpenAI Realtime error:",
        openAIResponse.status,
        data
      );

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Could not create realtime voice session.",
        },
        {
          status: openAIResponse.status,
        }
      );
    }

    const clientSecret =
      data?.value ||
      data?.client_secret?.value ||
      data?.client_secret;

    if (!clientSecret) {
      console.error(
        "OpenAI response did not contain a client secret:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Realtime client secret was not returned.",
        },
        { status: 500 }
      );
    }

    console.log(
      "Realtime client secret created successfully."
    );

    return NextResponse.json({
      client_secret: clientSecret,
    });
  } catch (error: any) {
    console.error(
      "Realtime route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not create realtime voice session.",
      },
      { status: 500 }
    );
  }
}