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

    const image = formData.get("image");
    const language = String(
      formData.get("language") || "English"
    );

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload an image.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(
      bytes
    ).toString("base64");

    const mimeType =
      image.type || "image/jpeg";

    const imageUrl = `data:${mimeType};base64,${base64}`;

    const openai = new OpenAI({
      apiKey,
    });

    const response =
      await openai.responses.create({
        model: "gpt-4.1-mini",

        input: [
          {
            role: "user",

            content: [
              {
                type: "input_text",

                text: `You are Netherlands Guide AI.

The user uploaded a letter.

Explain this letter in ${language}.

Use simple and easy language.

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

Do not invent information.

If the image or text is unclear, say exactly what is unclear.`,

              },

              {
                type: "input_image",

                image_url: imageUrl,

                detail: "high",
              },
            ],
          },
        ],
      });

    return NextResponse.json({
      success: true,

      reply: response.output_text,
    });

  } catch (error) {

    console.error(
      "Letter scanning error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not analyse the letter.",
      },
      {
        status: 500,
      }
    );
  }
}