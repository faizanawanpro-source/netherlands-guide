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
        { status: 500 }
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
          error: 'No image received. Please upload an image using the field "image".',
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

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");

    const mimeType = image.type || "image/jpeg";

    const imageUrl =
      `data:${mimeType};base64,${base64}`;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text:
                    `You are Netherlands Guide AI.

The user uploaded an official Dutch letter.

Read the letter carefully and explain it in ${language} using very simple language.

Explain:

1. Who sent the letter
2. What the letter is about
3. What the user needs to do
4. Important deadlines
5. Payments or amounts
6. Appointments
7. Documents needed
8. What happens if the user does nothing
9. A short summary

IMPORTANT:
- Do not invent information.
- Only use information visible in the letter.
- Keep dates and amounts accurate.
- If something cannot be read, say that it is unclear.
- Do not give legal advice.`,
                },
                {
                  type: "input_image",
                  image_url: imageUrl,
                },
              ],
            },
          ],
        }),
      }
    );

    const responseText =
      await openAIResponse.text();

    if (!openAIResponse.ok) {
      console.error(
        "OpenAI API error:",
        responseText
      );

      return NextResponse.json(
        {
          error:
            "OpenAI error: " + responseText,
        },
        {
          status: openAIResponse.status,
        }
      );
    }

    const data = JSON.parse(responseText);

    let reply = "";

    if (
      typeof data.output_text === "string"
    ) {
      reply = data.output_text;
    }

    if (
      !reply &&
      Array.isArray(data.output)
    ) {
      for (const item of data.output) {
        if (
          Array.isArray(item.content)
        ) {
          for (const content of item.content) {
            if (
              typeof content.text === "string"
            ) {
              reply += content.text;
            }
          }
        }
      }
    }

    if (!reply) {
      console.error(
        "No text returned by OpenAI:",
        data
      );

      return NextResponse.json(
        {
          error:
            "AI returned no explanation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "SCAN LETTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not analyse the letter.",
      },
      { status: 500 }
    );
  }
}