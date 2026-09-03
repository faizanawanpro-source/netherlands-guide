import { NextResponse } from "next/server";

export const runtime =
  "nodejs";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      userMessage,
      documentType,
      sender,
      subject,
      summary,
      explanation,
      consequences,
    } = body;

    if (
      !userMessage ||
      typeof userMessage !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a message to reply with.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const prompt = `
You are Netherlands Guide AI.

A user received a Dutch letter.

Your job is to turn what the user says in ANY language into a professional, natural Dutch reply.

IMPORTANT RULES:

- Understand the user's original meaning.
- Do not invent information.
- Do not make promises the user did not make.
- Write professional Dutch.
- Keep the reply appropriate for an official Dutch organization.
- Use "Geachte heer/mevrouw," if no specific person is known.
- End professionally.
- Return ONLY the Dutch reply.
- Do not explain your answer.
- Do not translate literally if a natural Dutch sentence would be better.

LETTER INFORMATION:

Document type:
${documentType || "Unknown"}

Sender:
${sender || "Unknown"}

Subject:
${subject || "Unknown"}

Summary:
${summary || "Unknown"}

Explanation:
${explanation || "Unknown"}

Possible consequences:
${consequences || "Unknown"}

WHAT THE USER WANTS TO SAY:

${userMessage}
`;

    const response =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${apiKey}`,
          },

          body: JSON.stringify({
            model:
              "gpt-5-mini",

            messages: [
              {
                role: "system",

                content:
                  "You write professional Dutch replies for official organizations in the Netherlands.",
              },

              {
                role: "user",

                content:
                  prompt,
              },
            ],

            temperature:
              0.4,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "OpenAI reply error:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Could not generate the Dutch reply.",
        },
        {
          status: 500,
        }
      );
    }

    const reply =
      data.choices?.[0]?.message
        ?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "The AI did not generate a reply.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "Generate reply error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while generating the reply.",
      },
      {
        status: 500,
      }
    );
  }
}