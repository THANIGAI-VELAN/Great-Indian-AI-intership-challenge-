import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS, sanitizeModel } from "@/lib/providers";

const EXTRACTION_SYSTEM_PROMPT = `You are Solli's extraction engine. You extract structured tasks, deadlines, subjects, and resources from classroom announcements, voice notes, and WhatsApp messages in Tamil, Tanglish, Hindi, Hinglish, and English.

Output JSON only matching this schema:
{
  "items": [
    {
      "title": "string",
      "subject": "string or null",
      "type": "assignment" | "exam" | "submission" | "reading" | "reminder" | "other",
      "due": {
        "raw": "string or null (exact words spoken for the date, e.g. 'Friday-kulla', 'tomorrow')",
        "expr": {
          "kind": "absolute" | "weekday" | "relative" | "unknown",
          "days": number (if relative, e.g. tomorrow = 1, today = 0),
          "weekday": number (0-6 where 0=Sunday, 1=Monday... if weekday),
          "modifier": "none" | "this" | "next",
          "day": number (if absolute),
          "month": number (if absolute),
          "year": number (optional, if absolute)
        },
        "time": "HH:mm or null (24h format)"
      },
      "resources": [
        {
          "label": "string",
          "kind": "chapter" | "book" | "link" | "video" | "other",
          "detail": "string or null"
        }
      ],
      "notes": "string or null",
      "sourceQuote": "string (exact excerpt from user input)"
    }
  ],
  "spokenSummary": "string",
  "warnings": ["string"]
}

Rules:
1. Do not hallucinate or invent resources, links, or facts that were not spoken or typed.
2. If no tasks are found, return items: [].
3. For Tanglish / Tamil, recognize:
   - "naalaiku" / "நாளை" = tomorrow (relative days 1)
   - "innaiku" / "இன்று" = today (relative days 0)
   - "naalaikku marunaal" = day after tomorrow (relative days 2)
   - "Friday-kulla" / "Friday submit pannanum" = weekday 5
4. Return ONLY valid JSON. No markdown ticks, no preamble.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider = "gemini", apiKey, model, text, isTest = false, todayISO } = body;

    const trimmedKey = apiKey ? apiKey.trim() : (req.headers.get("x-api-key-id") || "").trim();

    if (!trimmedKey) {
      return NextResponse.json(
        { error: "Missing API Key. Please provide your key in Settings.", code: "MISSING_KEY" },
        { status: 400 }
      );
    }

    const providerConfig = PROVIDERS[provider] || PROVIDERS.gemini;
    let targetModel = sanitizeModel(provider, model);
    const endpoint = providerConfig.endpoint;

    // Helper to send test ping
    const makeTestCall = async (modelToUse: string) => {
      return await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trimmedKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [{ role: "user", content: "Reply with 'ok'" }],
          max_tokens: 5,
        }),
      });
    };

    // Test ping handler
    if (isTest) {
      let testRes = await makeTestCall(targetModel);

      // Auto-recovery if 404 model not found / deprecated
      if (testRes.status === 404) {
        const errText = await testRes.text();

        // Check if upstream suggested an updated model (e.g., Google suggesting gemini-3.8-flash)
        const match = errText.match(/models\/([a-zA-Z0-9.-]+)/);
        const suggested = match ? match[1] : providerConfig.defaultModel;

        if (suggested && suggested !== targetModel) {
          targetModel = suggested;
          testRes = await makeTestCall(targetModel);
        } else if (targetModel !== providerConfig.defaultModel) {
          targetModel = providerConfig.defaultModel;
          testRes = await makeTestCall(targetModel);
        }

        if (!testRes.ok) {
          const finalErr = await testRes.text();
          return NextResponse.json(
            {
              error: `Provider returned status ${testRes.status}: ${finalErr}`,
              suggestedModel: providerConfig.defaultModel,
            },
            { status: testRes.status }
          );
        }
      }

      if (!testRes.ok) {
        const errText = await testRes.text();
        return NextResponse.json(
          {
            error: `Provider returned status ${testRes.status}: ${errText}`,
            suggestedModel: providerConfig.defaultModel,
          },
          { status: testRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Connection verified with ${providerConfig.name} (${targetModel})`,
        model: targetModel,
      });
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text payload is required" },
        { status: 400 }
      );
    }

    const referenceDate = todayISO || new Date().toISOString().split("T")[0];

    // Helper to send extraction call
    const makeExtractionCall = async (modelToUse: string) => {
      return await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trimmedKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Today's Reference Date: ${referenceDate}\n\nUser Input to extract:\n\"\"\"${text}\"\"\"`,
            },
          ],
          temperature: 0.1,
        }),
      });
    };

    let response = await makeExtractionCall(targetModel);

    // Auto-fallback if the model returned 404 / deprecated
    if (response.status === 404) {
      const errText = await response.text();
      const match = errText.match(/models\/([a-zA-Z0-9.-]+)/);
      const suggested = match ? match[1] : providerConfig.defaultModel;
      if (suggested && suggested !== targetModel) {
        targetModel = suggested;
        response = await makeExtractionCall(targetModel);
      } else if (targetModel !== providerConfig.defaultModel) {
        targetModel = providerConfig.defaultModel;
        response = await makeExtractionCall(targetModel);
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `LLM API Error (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty completion received from model" },
        { status: 502 }
      );
    }

    // Parse JSON
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
