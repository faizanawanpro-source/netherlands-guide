import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

    const formData = await request.formData();

    const file = formData.get("file");

    const language = String(
      formData.get("language") || "English"
    );

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");

    const mimeType =
      file.type || "image/jpeg";

    const fileData =
      `data:${mimeType};base64,${base64}`;

    const openai = new OpenAI({
      apiKey,
    });

    const prompt = `
You are Netherlands Guide AI.

The user uploaded a Dutch government or official letter.

Explain the letter in ${language}.

Use simple, easy-to-understand language.

Clearly explain:

1. Who sent the letter
2. What the letter is about
3. What the user needs to do
4. Any important deadline
5. Any payment or amount mentioned
6. Any appointment mentioned
7. Any documents needed
8. What may happen if the user does nothing
9. A short summary

Important rules:

- Do NOT invent information.
- Only use information actually visible in the document.
- If something is unclear or unreadable, say so.
- Preserve important dates, amounts, names and reference numbers accurately.
- Explain Dutch government terminology in simple English.
- If the document appears to be from a Dutch government organization, identify the organization if it is clearly visible.
`;

    let response;

    /*
     * IMAGE
     */

    if (mimeType.startsWith("image/")) {
      response = await openai.responses.create({
        model: "gpt-4.1-mini",

        input: [
          {
            role: "user",

            content: [
              {
                type: "input_text",
                text: prompt,
              },

              {
                type: "input_image",
                image_url: fileData,
                detail: "high",
              },
            ],
          },
        ],
      });
    }

    /*
     * PDF
     */

    else if (mimeType === "application/pdf") {
      response = await openai.responses.create({
        model: "gpt-4.1-mini",

        input: [
          {
            role: "user",

            content: [
              {
                type: "input_text",
                text: prompt,
              },

              {
                type: "input_file",
                filename: file.name,
                file_data: fileData,
              },
            ],
          },
        ],
      });
    }

    /*
     * UNSUPPORTED FILE
     */

    else {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload an image or PDF.",
        },
        {
          status: 400,
        }
      );
    }

    const reply = response.output_text;

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "AI returned an empty response.",
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
      "LETTER SCANNING ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown AI error.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}