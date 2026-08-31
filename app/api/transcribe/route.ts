import Groq from "groq-sdk";
import { NextResponse } from "next/server";

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

    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "No audio file was received.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // CHECK AUDIO
    // ============================================================

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error: "The audio file is empty.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // SEND AUDIO TO GROQ WHISPER
    // ============================================================

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
      response_format: "json",
    });

    // ============================================================
    // GET TRANSCRIPTION
    // ============================================================

    const text =
      typeof transcription.text === "string"
        ? transcription.text.trim()
        : "";

    if (!text) {
      return NextResponse.json(
        {
          error: "No speech was detected.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // DEBUG
    // ============================================================

    console.log(
      "========== GROQ TRANSCRIPTION =========="
    );

    console.log(text);

    console.log(
      "========================================="
    );

    // ============================================================
    // RETURN TEXT
    // ============================================================

    return NextResponse.json({
      text,
    });
  } catch (error) {
    // ============================================================
    // ERROR HANDLING
    // ============================================================

    console.error(
      "========== GROQ TRANSCRIPTION ERROR =========="
    );

    console.error(error);

    console.error(
      "==============================================="
    );

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