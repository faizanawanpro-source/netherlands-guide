import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_TTS_MODEL = "gemini-3.1-flash-tts-preview";

const GEMINI_TTS_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent`;

async function generateSpeech(
  apiKey: string,
  text: string,
  language: string
) {
  const prompt = `
Read the following information aloud in ${language}.

Use a warm, natural, attractive and reassuring voice.
Speak clearly and slightly slowly.
Do not translate, explain, summarize, add information, or change the meaning.
Read only the text provided below.
Pause naturally between sections.
Pronounce dates, amounts and numbers clearly.

TEXT:
${text}
`.trim();

  const response = await fetch(
    `${GEMINI_TTS_URL}?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Kore",
              },
            },
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini TTS error:", {
      status: response.status,
      error:
        data?.error?.message ||
        data?.error ||
        "Unknown Gemini TTS error",
    });

    throw new Error(
      data?.error?.message ||
        "Gemini TTS could not generate speech."
    );
  }

  const audioPart =
    data?.candidates?.[0]?.content?.parts?.find(
      (part: any) =>
        part?.inlineData?.data
    );

  const audioBase64 =
    audioPart?.inlineData?.data;

  if (!audioBase64) {
    console.error(
      "Gemini TTS returned no audio data."
    );

    throw new Error(
      "Gemini TTS returned no audio data."
    );
  }

  return audioBase64;
}

export async function POST(
  request: Request
) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const body =
      await request.json();

    const text =
      typeof body?.text === "string"
        ? body.text.trim()
        : "";

    const language =
      typeof body?.language === "string" &&
      body.language.trim()
        ? body.language.trim()
        : "English";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "There is no text to speak.",
        },
        { status: 400 }
      );
    }

    // Keep TTS requests reasonably sized.
    if (text.length > 8000) {
      return NextResponse.json(
        {
          error:
            "The text to speak is too long.",
        },
        { status: 400 }
      );
    }

    console.log(
      `Generating Gemini TTS in ${language}...`
    );

    const audioBase64 =
      await generateSpeech(
        apiKey,
        text,
        language
      );

    return NextResponse.json({
      success: true,
      audioBase64,
      mimeType:
        "audio/pcm;rate=24000",
      sampleRate: 24000,
      channels: 1,
      bitsPerSample: 16,
    });
  } catch (error: any) {
    console.error(
      "Gemini TTS route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not generate speech.",
      },
      { status: 500 }
    );
  }
}