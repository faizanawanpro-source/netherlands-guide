import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DocumentData = {
  id: string;
  sender: string | null;
  subject: string | null;
  summary: string | null;
  explanation: string | null;
  consequences: string | null;
  reply_needed: boolean | null;
};

function extractGeminiText(data: any) {
  const candidates =
    data?.candidates;

  if (
    !Array.isArray(candidates)
  ) {
    return "";
  }

  for (const candidate of candidates) {
    const parts =
      candidate?.content?.parts;

    if (
      !Array.isArray(parts)
    ) {
      continue;
    }

    const text =
      parts
        .map(
          (part: any) =>
            typeof part?.text ===
            "string"
              ? part.text
              : ""
        )
        .join("")
        .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

export async function POST(
  request: NextRequest
) {
  try {
    const geminiApiKey =
      process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini is not configured on the server.",
        },
        {
          status: 500,
        }
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseKey
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase is not configured on the server.",
        },
        {
          status: 500,
        }
      );
    }

    const authorization =
      request.headers.get(
        "authorization"
      );

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Authentication is required.",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization.replace(
        "Bearer ",
        ""
      );

    const supabase =
      createClient(
        supabaseUrl,
        supabaseKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      );

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Your session is no longer valid. Please sign in again.",
        },
        {
          status: 401,
        }
      );
    }

    const formData =
      await request.formData();

    const audio =
      formData.get("audio");

    const documentId =
      formData.get(
        "documentId"
      );

    if (
      !audio ||
      !(audio instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "No voice recording was received.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof documentId !==
      "string" ||
      !documentId
    ) {
      return NextResponse.json(
        {
          error:
            "The document could not be identified.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      audio.size === 0
    ) {
      return NextResponse.json(
        {
          error:
            "The voice recording was empty.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Keep the recording reasonably small.
     * This also protects the API from accidental
     * extremely long recordings.
     */
    const maxAudioBytes =
      15 * 1024 * 1024;

    if (
      audio.size >
      maxAudioBytes
    ) {
      return NextResponse.json(
        {
          error:
            "The recording is too long. Please record a shorter reply.",
        },
        {
          status: 413,
        }
      );
    }

    const {
      data: document,
      error: documentError,
    } =
      await supabase
        .from("documents")
        .select(
          "id, sender, subject, summary, explanation, consequences, reply_needed"
        )
        .eq(
          "id",
          documentId
        )
        .eq(
          "user_id",
          user.id
        )
        .single();

    if (
      documentError ||
      !document
    ) {
      console.error(
        "Document lookup error:",
        documentError
      );

      return NextResponse.json(
        {
          error:
            "This saved letter could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const documentData =
      document as DocumentData;

    const audioBuffer =
      Buffer.from(
        await audio.arrayBuffer()
      );

    const base64Audio =
      audioBuffer.toString(
        "base64"
      );

    const mimeType =
      audio.type ||
      "audio/webm";

    const prompt = `
You are Netherlands Guide AI.

The user is replying to an official letter in the Netherlands.

The user has spoken their intended reply aloud in their own language.

Your job is to:
1. Understand what the user means.
2. Ignore the language the user spoke and understand the actual intention.
3. Create a professional, polite and natural Dutch reply.
4. Address the correct sender shown below.
5. Keep the user's intended meaning.
6. Do not invent facts.
7. Do not invent dates, reference numbers, names, payments or promises.
8. If the user did not provide enough information for a specific detail, leave that detail out rather than guessing.
9. The reply should sound like a real person communicating with a Dutch government organisation, municipality, company, landlord, school, insurer or other official organisation.
10. Do not explain your reasoning.
11. Return ONLY the Dutch reply that the user can edit and send.

LETTER INFORMATION

Sender:
${documentData.sender || "Unknown sender"}

Subject:
${documentData.subject || "Unknown subject"}

Summary:
${documentData.summary || "No summary available"}

What the letter means:
${documentData.explanation || "No explanation available"}

Possible consequences:
${documentData.consequences || "No consequences recorded"}

Reply needed:
${documentData.reply_needed ? "Yes" : "Not specifically identified"}

Now listen carefully to the user's voice recording and create the Dutch reply.
`;

    const geminiResponse =
      await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            "x-goog-api-key":
              geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                  {
                    inlineData: {
                      mimeType,
                      data: base64Audio,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1200,
            },
          }),
        }
      );

    if (
      !geminiResponse.ok
    ) {
      const errorText =
        await geminiResponse.text();

      console.error(
        "Gemini API error:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Gemini could not understand the voice recording. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    const geminiData =
      await geminiResponse.json();

    const reply =
      extractGeminiText(
        geminiData
      );

    if (!reply) {
      console.error(
        "Gemini returned no reply:",
        geminiData
      );

      return NextResponse.json(
        {
          error:
            "Gemini could not create a reply from your recording.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "Voice reply API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating your reply.",
      },
      {
        status: 500,
      }
    );
  }
}