import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { Form, Webhook } from "@/lib/db/models";
import { dispatchWebhook } from "@/lib/channels/dispatcher";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; webhookId: string }> },
) {
  const { id, webhookId } = await params;
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const form = await Form.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const webhook = await Webhook.findOne({
      _id: webhookId,
      formId: id,
    }).lean();

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    // Dummy payload for testing
    const testPayload = {
      formName: form.name,
      data: {
        test: "This is a test submission",
        email: session.user.email || "test@example.com",
        message: "Hello from StaticSend!",
      },
      submissionId: "test-submission-id",
      timestamp: new Date(),
    };

    const result = await dispatchWebhook(
      { channel: webhook.channel, config: webhook.config },
      testPayload,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to test webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
