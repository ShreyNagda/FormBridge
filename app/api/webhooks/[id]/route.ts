import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Webhook } from "@/lib/db/models";

async function verifyWebhookOwnership(id: string, userId: string) {
    await connectDB();
    const webhook = await Webhook.findById(id).lean();
    if (!webhook) return null;

    const form = await Form.findOne({
        _id: webhook.formId,
        userId,
    }).lean();

    if (!form) return null;
    return webhook;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const webhook = await verifyWebhookOwnership(id, session.user.id);
        if (!webhook) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();

        const updatedWebhook = await Webhook.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(body.config !== undefined ? { config: body.config } : {}),
                    ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
                },
            },
            { new: true },
        ).lean();

        if (!updatedWebhook) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const { _id, ...rest } = updatedWebhook;
        return NextResponse.json({ ...rest, id: _id });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const webhook = await verifyWebhookOwnership(id, session.user.id);
        if (!webhook) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        await Webhook.deleteOne({ _id: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
