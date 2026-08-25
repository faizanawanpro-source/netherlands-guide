import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing.");

      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "Audio file is required.",
        },
        { status: 400 }
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error: "The audio recording is empty.",
        },
        { status: 400 }
      );
    }

    console.log("========== VOICE TRANSCRIPTION ==========");
    console.log("File:", audio.name);
    console.log("Type:", audio.type);
    console.log("Size:", audio.size);
    console.log("==========================================");

    const transcription =
      await openai.audio.transcriptions.create({
        file: audio,
        model: "gpt-4o-mini-transcribe",
      });

    const text =
      transcription.text?.trim() || "";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "I couldn't understand what you said. Please try speaking again.",
        },
        { status: 400 }
      );
    }

    console.log("Transcription:", text);

    return NextResponse.json({
      text,
    });
  } catch (error: any) {
    console.error(
      "========== TRANSCRIPTION ERROR =========="
    );
    console.error(error);
    console.error(
      "=========================================="
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not transcribe the audio.",
      },
      { status: 500 }
    );
  }
}