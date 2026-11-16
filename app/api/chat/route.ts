import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_MESSAGES_CONTEXT = 12;
const MAX_USER_TEXT_LENGTH = 1500;

const ipRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequestLog.set(ip, recent);

  // Periodic cleanup to keep map bounded
  if (ipRequestLog.size > 500) {
    for (const [key, list] of ipRequestLog.entries()) {
      if (list.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestLog.delete(key);
      }
    }
  }

  return false;
}

function extractMessageText(message: UIMessage): string {
  const record = message as unknown as {
    content?: unknown;
    text?: unknown;
    parts?: Array<{ type?: string; text?: string }>;
  };

  if (typeof record.content === "string" && record.content.trim()) {
    return record.content;
  }
  if (Array.isArray(record.parts)) {
    const joined = record.parts
      .map((p) => (typeof p?.text === "string" ? p.text : ""))
      .join("")
      .trim();
    if (joined) return joined;
  }
  if (typeof record.text === "string" && record.text.trim()) {
    return record.text;
  }
  return "";
}

export async function POST(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || "anonymous";

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before sending another message." },
      { status: 429 }
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const rawMessages = body?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
  }

  const boundedMessages = rawMessages.slice(-MAX_MESSAGES_CONTEXT);

  let userText = "مش لاقي النص";
  const lastMessage = boundedMessages[boundedMessages.length - 1];
  if (lastMessage && lastMessage.role === "user") {
    const extracted = extractMessageText(lastMessage);
    if (extracted.length > MAX_USER_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds maximum length of ${MAX_USER_TEXT_LENGTH} characters.` },
        { status: 400 }
      );
    }
    userText = extracted || "مش لاقي النص";
  }

  // Robust server-side language detection fallback
  const isArabic = /[\u0600-\u06FF]/.test(userText);
  const languageOverride = isArabic
    ? "\n\nCRITICAL LANGUAGE MATCHING RULE: The user is speaking Arabic. You MUST respond in friendly Egyptian Arabic (عامية مصرية روشة ومحترمة) with emojis."
    : "\n\nCRITICAL LANGUAGE MATCHING RULE: The user is speaking English. You MUST respond ONLY in clean, professional, and precise English. DO NOT speak Arabic.";

  const systemPrompt =
    process.env.SYSTEM_PROMPT || process.env.NEXT_PUBLIC_SYSTEM_PROMPT || "";

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(boundedMessages),
    system: systemPrompt + languageOverride,
    maxOutputTokens: 700,
  });
  return result.toUIMessageStreamResponse();
}
