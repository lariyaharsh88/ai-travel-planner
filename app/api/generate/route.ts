import { NextResponse } from "next/server";
import { TravelPlanResponse } from "@/lib/travel-plan";

type GenerateRequestBody = {
  destination: string;
  budget: number;
  days: number;
  style: string;
  interests: string[];
};

function isValidBody(body: unknown): body is GenerateRequestBody {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Partial<GenerateRequestBody>;
  return (
    typeof candidate.destination === "string" &&
    candidate.destination.trim().length > 0 &&
    typeof candidate.budget === "number" &&
    Number.isFinite(candidate.budget) &&
    candidate.budget >= 0 &&
    typeof candidate.days === "number" &&
    Number.isFinite(candidate.days) &&
    candidate.days > 0 &&
    typeof candidate.style === "string" &&
    candidate.style.trim().length > 0 &&
    Array.isArray(candidate.interests) &&
    candidate.interests.every((item) => typeof item === "string")
  );
}

function extractJson(rawText: string): string {
  const fenced = rawText.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return rawText.slice(firstBrace, lastBrace + 1);
  }

  return rawText;
}

function normalizeResponse(data: unknown): TravelPlanResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON from model");
  }

  const parsed = data as Partial<TravelPlanResponse>;
  if (
    !Array.isArray(parsed.dayWisePlan) ||
    !parsed.budgetBreakdown ||
    !Array.isArray(parsed.reelIdeas) ||
    !parsed.blogContent
  ) {
    throw new Error("Missing required response keys");
  }

  if (
    typeof parsed.budgetBreakdown.stay !== "string" ||
    typeof parsed.budgetBreakdown.food !== "string" ||
    typeof parsed.budgetBreakdown.transport !== "string" ||
    typeof parsed.blogContent.title !== "string" ||
    typeof parsed.blogContent.preview !== "string"
  ) {
    throw new Error("Invalid response format");
  }

  return parsed as TravelPlanResponse;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY in environment variables." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as unknown;
    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Expected destination, budget, days, style, and interests.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert travel planner.
Generate a practical travel plan for:
- Destination: ${body.destination}
- Budget: ${body.budget}
- Days: ${body.days}
- Style: ${body.style}
- Interests: ${body.interests.join(", ")}

Return ONLY valid JSON with this exact shape:
{
  "dayWisePlan": [
    {
      "day": 1,
      "title": "Arrival and local exploration",
      "activities": ["string", "string"],
      "places": ["string", "string"]
    }
  ],
  "budgetBreakdown": {
    "stay": "string",
    "food": "string",
    "transport": "string"
  },
  "reelIdeas": [
    {
      "hook": "string",
      "caption": "string",
      "hashtags": ["#one", "#two"]
    }
  ],
  "blogContent": {
    "title": "string",
    "preview": "string"
  }
}
`.trim();

    const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are an expert travel planner. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      if (groqResponse.status === 429) {
        return NextResponse.json(
          { error: "Groq quota exceeded. Please try again later.", details: errorText },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: "Groq request failed.", details: errorText },
        { status: 502 },
      );
    }

    const result = (await groqResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const rawText = result.choices?.[0]?.message?.content;
    if (!rawText) {
      return NextResponse.json(
        { error: "Groq returned an empty response." },
        { status: 502 },
      );
    }

    const parsed = normalizeResponse(JSON.parse(extractJson(rawText)));
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate travel plan.", details: message },
      { status: 500 },
    );
  }
}
