import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { Form, Webhook, WebhookDelivery } from "@/lib/db/models";
import { updateWebhookSchema } from "@/lib/validation/webhook";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; webhookId: string }> },
) {
  const { id, webhookId } = await params;
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateWebhookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    await connectDB();
    const form = await Form.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const webhook = await Webhook.findOneAndUpdate(
      { _id: webhookId, formId: id },
      { $set: parsed.data },
      { new: true },
    ).lean();

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error("Failed to update webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const webhook = await Webhook.findOneAndDelete({
      _id: webhookId,
      formId: id,
    }).lean();

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    // Clean up deliveries for this webhook
    await WebhookDelivery.deleteMany({ webhookId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
