import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 120;
const SUBSCRIBE_WINDOW_MS = 10 * 60_000;
const MAX_SUBSCRIBE_PER_WINDOW = 3;

const subscribeIpLog = new Map<string, number[]>();

function isSubscribeRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (subscribeIpLog.get(ip) ?? []).filter((t) => now - t < SUBSCRIBE_WINDOW_MS);
    if (recent.length >= MAX_SUBSCRIBE_PER_WINDOW) {
        subscribeIpLog.set(ip, recent);
        return true;
    }
    recent.push(now);
    subscribeIpLog.set(ip, recent);
    return false;
}

function escapeHtml(input: string): string {
    return input.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case '"':
                return "&quot;";
            case "'":
                return "&#39;";
            default:
                return char;
        }
    });
}

export async function POST(request: Request) {
    try {
        const forwardedFor = request.headers.get("x-forwarded-for");
        const clientIp = forwardedFor?.split(",")[0]?.trim() || "anonymous";

        if (isSubscribeRateLimited(clientIp)) {
            return NextResponse.json(
                { error: "محاولات كثيرة متتالية، يرجى المحاولة لاحقاً." },
                { status: 429 }
            );
        }

        const body: { email?: unknown } = await request.json();
        const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";

        if (
            !rawEmail ||
            rawEmail.length > MAX_EMAIL_LENGTH ||
            !EMAIL_REGEX.test(rawEmail) ||
            /[<>"'\s]/.test(rawEmail)
        ) {
            return NextResponse.json({ error: "البريد الإلكتروني غير صالح." }, { status: 400 });
        }

        const safeEmail = escapeHtml(rawEmail);
        const safeMailto = encodeURIComponent(rawEmail);

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "لم يتم تهيئة RESEND_API_KEY في ملف .env.local" },
                { status: 500 }
            );
        }

        // We send a POST request to Resend API using standard fetch
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: "Portfolio Newsletter <onboarding@resend.dev>",
                to: "ali.haggag2005@gmail.com",
                subject: "New Newsletter Subscriber! 🎉",
                html: `
                    <div dir="rtl" style="font-family: sans-serif; padding: 20px; border: 1px solid #3b82f6; border-radius: 12px; background-color: #0f172a; color: #f8fafc; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3b82f6; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-top: 0;">مشترك جديد في النشرة البريدية! 📬</h2>
                        <p style="font-size: 16px; line-height: 1.6;">يا بشمهندس علي، فيه حد لسه مشترك في النشرة البريدية بتاعتك من البورتفوليو.</p>
                        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <span style="color: #94a3b8; font-size: 14px; display: block; margin-bottom: 4px;">البريد الإلكتروني للمشترك:</span>
                            <a href="mailto:${safeMailto}" style="color: #3b82f6; font-size: 18px; font-weight: bold; text-decoration: none;">${safeEmail}</a>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 25px 0;" />
                        <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">تم إرسال هذا التنبيه تلقائياً من البورتفوليو الخاص بك.</p>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const errorData: { message?: string } = await response.json();
            return NextResponse.json(
                { error: errorData.message || "فشل إرسال البريد الإلكتروني." },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "حدث خطأ داخلي في الخادم.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

