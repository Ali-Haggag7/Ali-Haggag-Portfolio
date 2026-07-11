import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "البريد الإلكتروني غير صالح." }, { status: 400 });
        }

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
                            <a href="mailto:${email}" style="color: #3b82f6; font-size: 18px; font-weight: bold; text-decoration: none;">${email}</a>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 25px 0;" />
                        <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">تم إرسال هذا التنبيه تلقائياً من البورتفوليو الخاص بك.</p>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || "فشل إرسال البريد الإلكتروني." },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ داخلي في الخادم." },
            { status: 500 }
        );
    }
}
