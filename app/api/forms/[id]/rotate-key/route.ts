import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form } from "@/lib/db/models";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
        const existingForm = await Form.findOne({
            _id: id,
            userId: session.user.id,
        }).lean();

        if (!existingForm) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const rawApiKey = crypto.randomBytes(32).toString("hex");
        const apiKey = await bcrypt.hash(rawApiKey, 12);
        const apiKeyPreview = `${rawApiKey.slice(0, 7)}...${rawApiKey.slice(-4)}`;

        const updatedForm = await Form.findOneAndUpdate(
            { _id: id },
            { $set: { apiKey, apiKeyPreview } },
            { new: true },
        ).lean();

        if (!updatedForm) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const { apiKey: _apiKey, _id, ...safeForm } = updatedForm;
        
        return NextResponse.json({
            ...safeForm,
            id: _id,
            rawApiKey,
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
