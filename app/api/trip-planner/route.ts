import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      city,
      days,
      budget,
      interests,
    } = body;

    if (!city || !days || !budget || !interests) {
      return NextResponse.json(
        {
          error:
            "Please provide city, days, budget and interests.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are the AI travel planner for Netherlands Guide.

Create a practical travel itinerary for a visitor in the Netherlands.

City: ${city}
Number of days: ${days}
Budget: €${budget}
Interests: ${interests}

Requirements:

- Create a realistic day-by-day itinerary.
- Consider the user's budget.
- Include attractions and experiences.
- Include food suggestions.
- Include transport suggestions.
- Do not put too many activities into one day.
- Give approximate costs where useful.
- Mention when reservations may be needed.
- Do not invent exact opening hours.
- Clearly separate each day.
- Give an estimated total budget at the end.

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

TRANSPORT
...

FOOD
...

ESTIMATED BUDGET
...

TIPS
...
`;

    const response = await openai.responses.create({
      model: "gpt-5.6",
      input: prompt,
    });

    return NextResponse.json({
      itinerary: response.output_text,
    });
  } catch (error) {
    console.error("Trip planner error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating your trip.",
      },
      { status: 500 }
    );
  }
}