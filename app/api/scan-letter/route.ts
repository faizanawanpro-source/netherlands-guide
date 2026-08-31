import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // ============================================================
    // CHECK GROQ API KEY
    // ============================================================

    if (!process.env.GROQ_API_KEY) {
      console.error(
        "GROQ_API_KEY is missing from .env.local"
      );

      return NextResponse.json(
        {
          error:
            "GROQ_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // READ FORM DATA
    // ============================================================

    const formData = await request.formData();

    const image = formData.get("image");

    const language = String(
      formData.get("language") || "English"
    );

    // ============================================================
    // VALIDATE IMAGE
    // ============================================================

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error:
            'No image received. Please upload an image using the field "image".',
        },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Please upload an image such as JPG, JPEG, PNG, or HEIC.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // CONVERT IMAGE TO BASE64
    // ============================================================

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");

    const mimeType = image.type || "image/jpeg";

    const imageUrl =
      `data:${mimeType};base64,${base64}`;

    // ============================================================
    // AI INSTRUCTIONS
    // ============================================================

    const prompt = `
You are Netherlands Guide AI.

The user uploaded an official Dutch letter.

Read the letter carefully and explain it in ${language}
using very simple and clear language.

Explain:

1. Who sent the letter
2. What the letter is about
3. What the user needs to do
4. Important deadlines
5. Payments or amounts
6. Appointments
7. Documents needed
8. What happens if the user does nothing
9. A short simple summary

IMPORTANT RULES:

- Only use information that is actually visible in the letter.
- Do not invent missing information.
- Do not guess dates.
- Do not guess amounts.
- Keep dates and amounts accurate.
- If something cannot be read clearly, say that it is unclear.
- If part of the letter is unreadable, tell the user.
- Do not give legal advice.
- Do not claim something is required unless the letter says so.
- Explain Dutch government terminology in simple language.
- If the letter contains an important deadline, make it very clear.
- If the letter contains contact information, explain who the user should contact.
- Keep the explanation practical and easy for someone who may not speak Dutch fluently.

The user wants to understand the letter, not receive a complicated translation.

Answer in ${language}.
`;

    // ============================================================
    // CALL GROQ VISION MODEL
    // ============================================================

    const response =
      await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",

        temperature: 0.2,

        max_completion_tokens: 1500,

        messages: [
          {
            role: "system",
            content:
              "You are a careful document-reading assistant specializing in Dutch letters and everyday life in the Netherlands.",
          },

          {
            role: "user",

            content: [
              {
                type: "text",
                text: prompt,
              },

              {
                type: "image_url",

                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

    // ============================================================
    // GET RESPONSE
    // ============================================================

    const reply =
      response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error(
        "Groq returned an empty scanner response."
      );

      return NextResponse.json(
        {
          error:
            "The AI returned no explanation.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // DEBUG
    // ============================================================

    console.log(
      "========== GROQ SCANNER RESPONSE =========="
    );

    console.log(reply);

    console.log(
      "==========================================="
    );

    // ============================================================
    // RETURN
    // ============================================================

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error(
      "========== GROQ SCANNER ERROR =========="
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not analyse the letter.",
      },
      { status: 500 }
    );
  }
}