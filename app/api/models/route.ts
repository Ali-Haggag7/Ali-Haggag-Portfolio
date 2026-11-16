import { NextResponse } from "next/server";

interface GeminiModelEntry {
    name: string;
    supportedGenerationMethods?: string[];
}

export async function GET() {
    // Restrict debug route in production builds
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key is missing in .env.local" }, { status: 400 });
    }

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
            headers: {
                "x-goog-api-key": apiKey,
            },
        });
        const data: { models?: GeminiModelEntry[] } = await response.json();

        const availableModels = (data.models ?? [])
            .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
            .map((model) => model.name.replace("models/", ""));

        return NextResponse.json({
            message: "دي الموديلات المتاحة للمفتاح:",
            models: availableModels,
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
    }
}
