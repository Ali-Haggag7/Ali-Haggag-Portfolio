import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === 'user') {
    const msg: any = lastMessage;

    const userText = msg.content || (msg.parts && msg.parts[0]?.text) || msg.text || "مش لاقي النص";

    console.log(`[🎯 NEW QUESTION FOR ALI]: ${userText}`);

    if (userText === "مش لاقي النص") {
      console.log("🚨 شكل الأوبجيكت اللي جاي من المتصفح:", JSON.stringify(msg, null, 2));
    }
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: process.env.NEXT_PUBLIC_SYSTEM_PROMPT,
  });
  return result.toUIMessageStreamResponse();
}