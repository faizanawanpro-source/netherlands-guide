import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Deadline = {
  date: string;
  description: string;
  importance: "high" | "medium" | "low";
  relativeDescription: string;
};

type Payment = {
  amount: string;
  currency: string;
  dueDate: string;
  recipient: string;
  paymentReference: string;
};

type Appointment = {
  organization: string;
  appointmentDate: string;
  description: string;
  officialUrl: string;
};

type ScanResult = {
  documentType: string;
  sender: string;
  subject: string;
  summary: string;
  whatYouNeedToDo: string[];
  deadlines: Deadline[];
  payments: Payment[];
  appointments: Appointment[];
  requiredDocuments: string[];
  consequences: string;
  importance: "high" | "medium" | "low";
  replyNeeded: boolean;
  appointmentNeeded: boolean;
  officialUrl: string;
  explanation: string;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanImportance(
  value: unknown
): "high" | "medium" | "low" {
  if (
    value === "high" ||
    value === "medium" ||
    value === "low"
  ) {
    return value;
  }

  return "medium";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const file =
      formData.get("file") ||
      formData.get("image");

    const language = String(
      formData.get("language") || "English"
    ).trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a letter.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Please upload a photo or image of the letter.",
        },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "The image is too large. Please upload an image smaller than 20 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");

    const mimeType = file.type || "image/jpeg";

    const imageUrl =
      `data:${mimeType};base64,${base64}`;

    const groq = new OpenAI({
      apiKey,
      baseURL:
        "https://api.groq.com/openai/v1",
    });

    /*
     * IMPORTANT:
     *
     * The AI first understands the Dutch document.
     * It then explains everything in the user's selected
     * profile language.
     *
     * Keep this prompt reasonably short because the Groq
     * model has a TPM limit.
     */

    const prompt = `
You are Netherlands Guide AI.

The user's selected profile language is:
${language}

Read the uploaded Dutch official letter carefully.

CRITICAL LANGUAGE RULE:
ALL USER-FACING EXPLANATIONS MUST BE WRITTEN IN ${language}.

The following fields must be written in ${language}:
- documentType
- subject
- summary
- whatYouNeedToDo
- deadline descriptions
- payment explanations where applicable
- appointment descriptions
- requiredDocuments
- consequences
- explanation

Do NOT write explanations or instructions in English unless the selected language is English.

The original names of official organizations, people and companies may remain in their official form.

Only use information visible in the document.
Never invent information.

Extract:
- what the letter is
- who sent it
- subject
- meaning
- actions
- deadlines
- payments
- appointments
- required documents
- consequences
- whether a reply is required

DEADLINES:

If there is an exact calendar date:
- put it in "date" as YYYY-MM-DD
- put the explanation in "description"

If the document contains a relative deadline such as:
"within 15 days after receiving this letter"
"within 14 days"
"binnen 15 dagen na ontvangst"

then:
- "date" must be ""
- "relativeDescription" must contain the relative deadline
- "description" must explain it clearly in ${language}
- do not calculate an exact date unless it can be safely calculated from information in the document

The date printed on the letter is NOT automatically the date the user received it.

PAYMENTS:

Only include payments actually requested or described.

Extract:
- amount
- currency
- dueDate
- recipient
- paymentReference

If there is no exact payment date, leave dueDate empty.

APPOINTMENTS:

Only include an appointment when the document clearly requires,
requests or instructs the user to attend or make one.

Never invent an official URL.

REPLY:

Set replyNeeded to true only when the letter clearly requires or requests a reply.

IMPORTANCE:

high = serious financial, legal, immigration, benefits, healthcare or similarly important consequences

medium = important but not immediately critical

low = mainly informational

WHAT YOU NEED TO DO:

Give practical actions supported by the document.
Write them in ${language}.

CONSEQUENCES:

Only state consequences actually supported by the document.
Write them in ${language}.

EXPLANATION:

Write a clear, simple explanation for the user in ${language}.

Explain:
1. What is this letter?
2. Who sent it?
3. What does it mean?
4. What does the user need to do?
5. Is there a deadline?
6. Is there money to pay?
7. Is an appointment needed?
8. Are documents needed?
9. What happens if the user does nothing?

Do not merely translate the letter.
Make it understandable to someone who may not understand Dutch official letters.

Return ONLY valid JSON.

Use exactly this structure:

{
  "documentType": "",
  "sender": "",
  "subject": "",
  "summary": "",
  "whatYouNeedToDo": [],
  "deadlines": [
    {
      "date": "",
      "description": "",
      "importance": "medium",
      "relativeDescription": ""
    }
  ],
  "payments": [
    {
      "amount": "",
      "currency": "",
      "dueDate": "",
      "recipient": "",
      "paymentReference": ""
    }
  ],
  "appointments": [
    {
      "organization": "",
      "appointmentDate": "",
      "description": "",
      "officialUrl": ""
    }
  ],
  "requiredDocuments": [],
  "consequences": "",
  "importance": "medium",
  "replyNeeded": false,
  "appointmentNeeded": false,
  "officialUrl": "",
  "explanation": ""
}
`;

    console.log(
      `Scanning letter for profile language: ${language}`
    );

    const response =
      await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",

        messages: [
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

        response_format: {
          type: "json_object",
        },

        temperature: 0.1,

        /*
         * Lower than before to reduce the chance of
         * hitting Groq's TPM limit.
         */
        max_completion_tokens: 2200,

        reasoning_effort: "none",

        stream: false,
      });

    const rawText =
      response.choices?.[0]?.message?.content?.trim();

    if (!rawText) {
      console.error(
        "Groq returned an empty response."
      );

      return NextResponse.json(
        {
          error:
            "The AI could not analyse the document. Please try again.",
        },
        { status: 500 }
      );
    }

    let parsed: any;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error(
        "Groq returned invalid JSON:",
        rawText
      );

      return NextResponse.json(
        {
          error:
            "The AI read the document, but the analysis format was invalid. Please try again.",
        },
        { status: 500 }
      );
    }

    const result: ScanResult = {
      documentType:
        cleanString(parsed.documentType),

      sender:
        cleanString(parsed.sender),

      subject:
        cleanString(parsed.subject),

      summary:
        cleanString(parsed.summary),

      whatYouNeedToDo:
        cleanStringArray(
          parsed.whatYouNeedToDo
        ),

      deadlines:
        Array.isArray(parsed.deadlines)
          ? parsed.deadlines.map(
              (deadline: any) => ({
                date:
                  cleanString(
                    deadline?.date
                  ),

                description:
                  cleanString(
                    deadline?.description
                  ),

                importance:
                  cleanImportance(
                    deadline?.importance
                  ),

                relativeDescription:
                  cleanString(
                    deadline?.relativeDescription
                  ),
              })
            )
          : [],

      payments:
        Array.isArray(parsed.payments)
          ? parsed.payments.map(
              (payment: any) => ({
                amount:
                  typeof payment?.amount ===
                  "number"
                    ? String(
                        payment.amount
                      )
                    : cleanString(
                        payment?.amount
                      ),

                currency:
                  cleanString(
                    payment?.currency
                  ),

                dueDate:
                  cleanString(
                    payment?.dueDate
                  ),

                recipient:
                  cleanString(
                    payment?.recipient
                  ),

                paymentReference:
                  cleanString(
                    payment?.paymentReference
                  ),
              })
            )
          : [],

      appointments:
        Array.isArray(
          parsed.appointments
        )
          ? parsed.appointments.map(
              (appointment: any) => ({
                organization:
                  cleanString(
                    appointment?.organization
                  ),

                appointmentDate:
                  cleanString(
                    appointment?.appointmentDate
                  ),

                description:
                  cleanString(
                    appointment?.description
                  ),

                officialUrl:
                  cleanString(
                    appointment?.officialUrl
                  ),
              })
            )
          : [],

      requiredDocuments:
        cleanStringArray(
          parsed.requiredDocuments
        ),

      consequences:
        cleanString(
          parsed.consequences
        ),

      importance:
        cleanImportance(
          parsed.importance
        ),

      replyNeeded:
        Boolean(
          parsed.replyNeeded
        ),

      appointmentNeeded:
        Boolean(
          parsed.appointmentNeeded
        ),

      officialUrl:
        cleanString(
          parsed.officialUrl
        ),

      explanation:
        cleanString(
          parsed.explanation
        ),
    };

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error(
      "Letter scanning error:",
      error
    );

    const message =
      error?.message ||
      error?.error?.message ||
      "";

    const lowerMessage =
      message.toLowerCase();

    if (
      lowerMessage.includes(
        "rate limit"
      ) ||
      lowerMessage.includes(
        "too many requests"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The AI service is temporarily busy. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    if (
      lowerMessage.includes(
        "authentication"
      ) ||
      lowerMessage.includes(
        "api key"
      ) ||
      lowerMessage.includes(
        "unauthorized"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The Groq API key could not be authenticated. Please check your GROQ_API_KEY.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          message ||
          "Could not analyse the letter. Please try again.",
      },
      { status: 500 }
    );
  }
}