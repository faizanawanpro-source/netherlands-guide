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

    // DEBUG: Check whether a file was actually received
    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "DEBUG: No valid File received.",
          receivedType: typeof image,
          receivedValue: image ? String(image) : null,
        },
        {
          status: 400,
        }
      );
    }

    // DEBUG: Check the uploaded file
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "DEBUG: File received but it is not recognized as an image.",
          fileType: image.type,
          fileName: image.name,
          fileSize: image.size,
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");

    const mimeType = image.type || "image/jpeg";

    const imageUrl =
      "data:" + mimeType + ";base64," + base64;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
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
                    "You are Netherlands Guide AI.\n\n" +
                    "The user uploaded an official Dutch letter.\n\n" +
                    "Read the letter carefully and explain it in " +
                    language +
                    " using very simple language.\n\n" +
                    "Explain:\n\n" +
                    "1. Who sent the letter\n" +
                    "2. What the letter is about\n" +
                    "3. What the user needs to do\n" +
                    "4. Important deadlines\n" +
                    "5. Payments or amounts\n" +
                    "6. Appointments\n" +
                    "7. Documents needed\n" +
                    "8. What happens if the user does nothing\n" +
                    "9. A short summary\n\n" +
                    "IMPORTANT:\n" +
                    "- Do not invent information.\n" +
                    "- Only use information visible in the letter.\n" +
                    "- Keep dates and amounts accurate.\n" +
                    "- If something cannot be read, say that it is unclear.\n" +
                    "- Do not give legal advice.",
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

    const responseText = await openAIResponse.text();

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

    if (typeof data.output_text === "string") {
      reply = data.output_text;
    }

    if (!reply && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (Array.isArray(item.content)) {
          for (const content of item.content) {
            if (typeof content.text === "string") {
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
          error: "AI returned no explanation.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      reply: reply,
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
      {
        status: 500,
      }
    );
  }
}
