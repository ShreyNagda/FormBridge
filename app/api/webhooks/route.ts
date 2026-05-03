import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Webhook } from "@/lib/db/models";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    if (!formId) {
        return NextResponse.json({ error: "formId is required" }, { status: 400 });
    }

    try {
        await connectDB();
        const form = await Form.findOne({
            _id: formId,
            userId: session.user.id,
        }).lean();

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        const webhooks = await Webhook.find({ formId })
            .sort({ createdAt: -1 })
            .lean();

        const data = webhooks.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id,
        }));

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        
        if (!body.formId || !body.channel || !body.config) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        const form = await Form.findOne({
            _id: body.formId,
            userId: session.user.id,
        }).lean();

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        const webhook = await Webhook.create({
            formId: body.formId,
            channel: body.channel,
            config: body.config,
            enabled: body.enabled ?? true,
        });

        const { _id, ...rest } = webhook.toObject();
        return NextResponse.json({ ...rest, id: _id });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
