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
    );

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

    const base64 =
      Buffer.from(bytes).toString("base64");

    const mimeType =
      file.type || "image/jpeg";

    const imageUrl =
      `data:${mimeType};base64,${base64}`;

    const groq = new OpenAI({
      apiKey,
      baseURL:
        "https://api.groq.com/openai/v1",
    });

    const prompt = `
You are Netherlands Guide AI.

Read the uploaded Dutch official letter carefully and explain it to the
user in ${language}.

Do not invent information. Only use information visible in the document.

Extract important actions, deadlines, payments, appointments, required
documents and consequences.

DEADLINES:

There are two types.

EXACT:
If the document gives an exact calendar date, put it in "date" using
YYYY-MM-DD.

RELATIVE:
If it says things such as "within 15 days after receiving this letter",
"within 14 days", "binnen 15 dagen na ontvangst", or similar:

- "date" must be ""
- "relativeDescription" must contain the relative deadline
- "description" must clearly explain the deadline
- Never calculate an exact date unless the document provides enough
  information to do so safely.

The date printed on a letter is NOT automatically the date the user
received it.

PAYMENTS:

Only include payments that the document actually requests or describes.

Extract:
- amount
- currency
- dueDate
- recipient
- paymentReference

If the payment deadline is relative and there is no exact date, leave
"dueDate" empty.

Never invent payment information.

APPOINTMENTS:

Only include an appointment when the document clearly requires,
requests or instructs the user to make or attend one.

Extract:
- organization
- appointmentDate
- description
- officialUrl

Never invent a URL.

REPLY:

Set replyNeeded to true only when the document clearly requires or
requests a reply.

IMPORTANCE:

high = serious financial, legal, benefits, immigration, healthcare or
other important consequences.

medium = important but not immediately critical.

low = mainly informational.

WHAT YOU NEED TO DO:

Give practical actions supported by the document. Do not merely translate
the letter.

CONSEQUENCES:

Only state consequences that are actually supported by the document.

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
      "importance": "high",
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

The explanation should clearly answer:

1. What is this letter?
2. Who sent it?
3. What does it mean?
4. What does the user need to do?
5. Is there a deadline?
6. Is there money to pay?
7. Is an appointment needed?
8. Are documents needed?
9. What happens if the user does nothing?

Use simple language.

Do not invent missing information.
`;

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

        max_completion_tokens: 3500,

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

    let parsed: ScanResult;

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
        typeof parsed.documentType === "string"
          ? parsed.documentType
          : "",

      sender:
        typeof parsed.sender === "string"
          ? parsed.sender
          : "",

      subject:
        typeof parsed.subject === "string"
          ? parsed.subject
          : "",

      summary:
        typeof parsed.summary === "string"
          ? parsed.summary
          : "",

      whatYouNeedToDo:
        Array.isArray(parsed.whatYouNeedToDo)
          ? parsed.whatYouNeedToDo.filter(
              (item): item is string =>
                typeof item === "string"
            )
          : [],

      deadlines:
        Array.isArray(parsed.deadlines)
          ? parsed.deadlines.map(
              (deadline: any) => ({
                date:
                  typeof deadline?.date ===
                  "string"
                    ? deadline.date
                    : "",

                description:
                  typeof deadline?.description ===
                  "string"
                    ? deadline.description
                    : "",

                importance:
                  deadline?.importance ===
                    "high" ||
                  deadline?.importance ===
                    "medium" ||
                  deadline?.importance ===
                    "low"
                    ? deadline.importance
                    : "medium",

                relativeDescription:
                  typeof deadline?.relativeDescription ===
                  "string"
                    ? deadline.relativeDescription
                    : "",
              })
            )
          : [],

      payments:
        Array.isArray(parsed.payments)
          ? parsed.payments.map(
              (payment: any) => ({
                amount:
                  typeof payment?.amount ===
                  "string"
                    ? payment.amount
                    : String(
                        payment?.amount ?? ""
                      ),

                currency:
                  typeof payment?.currency ===
                  "string"
                    ? payment.currency
                    : "",

                dueDate:
                  typeof payment?.dueDate ===
                  "string"
                    ? payment.dueDate
                    : "",

                recipient:
                  typeof payment?.recipient ===
                  "string"
                    ? payment.recipient
                    : "",

                paymentReference:
                  typeof payment?.paymentReference ===
                  "string"
                    ? payment.paymentReference
                    : "",
              })
            )
          : [],

      appointments:
        Array.isArray(parsed.appointments)
          ? parsed.appointments.map(
              (appointment: any) => ({
                organization:
                  typeof appointment?.organization ===
                  "string"
                    ? appointment.organization
                    : "",

                appointmentDate:
                  typeof appointment?.appointmentDate ===
                  "string"
                    ? appointment.appointmentDate
                    : "",

                description:
                  typeof appointment?.description ===
                  "string"
                    ? appointment.description
                    : "",

                officialUrl:
                  typeof appointment?.officialUrl ===
                  "string"
                    ? appointment.officialUrl
                    : "",
              })
            )
          : [],

      requiredDocuments:
        Array.isArray(parsed.requiredDocuments)
          ? parsed.requiredDocuments.filter(
              (item): item is string =>
                typeof item === "string"
            )
          : [],

      consequences:
        typeof parsed.consequences === "string"
          ? parsed.consequences
          : "",

      importance:
        parsed.importance === "high" ||
        parsed.importance === "medium" ||
        parsed.importance === "low"
          ? parsed.importance
          : "medium",

      replyNeeded:
        Boolean(parsed.replyNeeded),

      appointmentNeeded:
        Boolean(parsed.appointmentNeeded),

      officialUrl:
        typeof parsed.officialUrl === "string"
          ? parsed.officialUrl
          : "",

      explanation:
        typeof parsed.explanation === "string"
          ? parsed.explanation
          : "",
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

    if (
      message
        .toLowerCase()
        .includes("rate limit")
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
      message
        .toLowerCase()
        .includes("authentication") ||
      message
        .toLowerCase()
        .includes("api key") ||
      message
        .toLowerCase()
        .includes("unauthorized")
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