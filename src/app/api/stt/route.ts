import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key-id") || req.headers.get("X-API-Key-ID");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gnani API Key (X-API-Key-ID header)", code: "MISSING_KEY" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // Test connection mode (simple test check)
    if (contentType.includes("application/json")) {
      const json = await req.json();
      if (json.isTest) {
        // Gnani test: send request to Gnani endpoint
        const testRes = await fetch("https://api.vachana.ai/stt/v3", {
          method: "POST",
          headers: {
            "X-API-Key-ID": apiKey,
          },
        });
        // 400 with EMPTY_AUDIO means the key was authenticated! 401/403 means bad key.
        if (testRes.status === 401 || testRes.status === 403) {
          return NextResponse.json(
            { error: "Invalid Gnani API Key", code: "INVALID_KEY" },
            { status: 401 }
          );
        }
        return NextResponse.json({ success: true, message: "Gnani API key valid" });
      }
    }

    // Forward multipart form data to Gnani API
    const formData = await req.formData();
    const audioFile = formData.get("audio_file");

    if (!audioFile) {
      return NextResponse.json(
        { error: "audio_file is required in form-data", code: "EMPTY_AUDIO" },
        { status: 400 }
      );
    }

    const gnaniFormData = new FormData();
    gnaniFormData.append("audio_file", audioFile);
    gnaniFormData.append("language_code", (formData.get("language_code") as string) || "indic-auto");
    gnaniFormData.append("model", (formData.get("model") as string) || "prisma-v3.0");
    gnaniFormData.append("format", (formData.get("format") as string) || "codemix");

    if (formData.get("topic")) {
      gnaniFormData.append("topic", formData.get("topic") as string);
    }
    if (formData.get("keyterms")) {
      gnaniFormData.append("keyterms", formData.get("keyterms") as string);
    }

    const upstreamRes = await fetch("https://api.vachana.ai/stt/v3", {
      method: "POST",
      headers: {
        "X-API-Key-ID": apiKey,
      },
      body: gnaniFormData,
    });

    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          error: data.message || data.detail || "Gnani transcription failed",
          status: upstreamRes.status,
        },
        { status: upstreamRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal STT Proxy Error" },
      { status: 500 }
    );
  }
}

