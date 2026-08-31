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
    // READ REQUEST
    // ============================================================

    const body = await request.json();

    const {
      city,
      days,
      budget,
      interests,
    } = body;

    // ============================================================
    // VALIDATE INPUT
    // ============================================================

    if (!city || !days || !budget || !interests) {
      return NextResponse.json(
        {
          error:
            "Please provide city, days, budget and interests.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // CREATE PROMPT
    // ============================================================

    const prompt = `
You are the AI travel planner for Netherlands Guide.

Create a practical travel itinerary for a visitor in the Netherlands.

City: ${city}
Number of days: ${days}
Budget: €${budget}
Interests: ${interests}

Requirements:

- Create a realistic day-by-day itinerary.
- Consider the user's total budget.
- Include attractions and experiences appropriate for the city.
- Include food suggestions.
- Include transport suggestions.
- Do not put too many activities into one day.
- Give approximate costs where useful.
- Mention when reservations may be needed.
- Do not invent exact opening hours.
- Clearly separate each day.
- Keep the itinerary practical rather than excessively detailed.
- Make sure the activities are geographically sensible where possible.
- Consider travel time between activities.
- Distinguish between free activities and paid activities.
- Give an estimated total budget at the end.
- If the budget is low, prioritize affordable or free activities.
- If the budget is high, you may include some premium experiences.

Format:

DAY 1

Morning:
...

Afternoon:
...

Evening:
...

DAY 2

Morning:
...

Afternoon:
...

Evening:
...

Continue for all requested days.

TRANSPORT

...

FOOD

...

ESTIMATED BUDGET

...

TIPS

...
`;

    // ============================================================
    // CALL GROQ
    // ============================================================

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        temperature: 0.5,

        max_completion_tokens: 1500,

        messages: [
          {
            role: "system",
            content:
              "You are a practical and helpful travel planner specializing in the Netherlands.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    // ============================================================
    // GET ITINERARY
    // ============================================================

    const itinerary =
      response.choices?.[0]?.message?.content?.trim();

    if (!itinerary) {
      console.error(
        "Groq returned an empty itinerary."
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an empty itinerary.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // DEBUG
    // ============================================================

    console.log(
      "========== GROQ TRIP PLANNER =========="
    );

    console.log(itinerary);

    console.log(
      "========================================"
    );

    // ============================================================
    // RETURN
    // ============================================================

    return NextResponse.json({
      itinerary,
    });
  } catch (error: any) {
    console.error(
      "========== GROQ TRIP PLANNER ERROR =========="
    );

    console.error(error);

    console.error(
      "=============================================="
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Something went wrong while creating your trip.",
      },
      { status: 500 }
    );
  }
}