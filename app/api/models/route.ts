import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key is missing in .env.local" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        const availableModels = data.models
            .filter((model: any) => model.supportedGenerationMethods.includes("generateContent"))
            .map((model: any) => model.name.replace('models/', ''));

        return NextResponse.json({
            message: "دي الموديلات المتاحة للمفتاح:",
            models: availableModels
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
    }
}