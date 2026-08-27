import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    // The frontend sends FormData.
    const formData = await request.formData();

    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "No audio file was received.",
        },
        { status: 400 }
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error: "The audio file is empty.",
        },
        { status: 400 }
      );
    }

    // Send the audio to OpenAI transcription.
    const openAIForm = new FormData();

    openAIForm.append("file", audio);
    openAIForm.append("model", "gpt-4o-mini-transcribe");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: openAIForm,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI transcription error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Could not transcribe your voice.",
        },
        {
          status: response.status,
        }
      );
    }

    const text =
      typeof data?.text === "string"
        ? data.text.trim()
        : "";

    if (!text) {
      return NextResponse.json(
        {
          error: "No speech was detected.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text,
    });
  } catch (error) {
    console.error("Transcription route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not transcribe your voice.",
      },
      { status: 500 }
    );
  }
}