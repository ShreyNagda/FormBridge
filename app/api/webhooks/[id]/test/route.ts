import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Webhook } from "@/lib/db/models";
import { dispatchWebhook } from "@/lib/channels/dispatcher";
import { WebhookPayload } from "@/lib/channels/email";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const webhook = await Webhook.findById(id).lean();
        if (!webhook) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const form = await Form.findById(webhook.formId).lean();
        if (!form || String(form.userId) !== session.user.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const testPayload: WebhookPayload = {
            formName: form.name,
            data: {
                name: "Test User",
                email: "test@example.com",
                message: "This is a test submission sent from the StaticSend dashboard.",
            },
            submissionId: "test_" + Date.now().toString(),
            timestamp: new Date(),
        };

        const result = await dispatchWebhook(
            { channel: webhook.channel, config: webhook.config },
            testPayload,
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Webhook test error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
