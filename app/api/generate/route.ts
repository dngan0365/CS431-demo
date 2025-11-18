// app/api/refinePrompt/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + apiKey;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Refine or enhance this image generation prompt. Output only the improved text:\n\n${prompt}`
          }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  });
  const data = await res.json();

  const refined = data.candidates?.[0]?.content?.parts?.[0]?.text || prompt;

  return NextResponse.json({ refinedPrompt: refined });
}
