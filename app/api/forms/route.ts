import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Submission, Webhook, User } from "@/lib/db/models";
import { createFormSchema } from "@/lib/validation/form";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const forms = await Form.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const formIds = forms.map((form) => form._id);

    const submissionCounts = await Submission.aggregate([
      { $match: { formId: { $in: formIds } } },
      { $group: { _id: "$formId", count: { $sum: 1 } } },
    ]);

    const webhookCounts = await Webhook.aggregate([
      { $match: { formId: { $in: formIds } } },
      { $group: { _id: "$formId", count: { $sum: 1 } } },
    ]);

    const submissionsMap = new Map(
      submissionCounts.map((item) => [
        item._id as string,
        item.count as number,
      ]),
    );
    const webhooksMap = new Map(
      webhookCounts.map((item) => [item._id as string, item.count as number]),
    );

    const data = forms.map((form) => {
      const { _id, apiKey: _apiKey, ...rest } = form;
      return {
        ...rest,
        id: _id,
        _count: {
          submissions: submissionsMap.get(String(_id)) ?? 0,
          webhooks: webhooksMap.get(String(_id)) ?? 0,
        },
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const rawApiKey = crypto.randomBytes(32).toString("hex");
    const apiKey = await bcrypt.hash(rawApiKey, 12);
    const apiKeyPreview = `${rawApiKey.slice(0, 7)}...${rawApiKey.slice(-4)}`;

    await connectDB();

    // If notificationEmails is empty, populate with user's global notification emails
    let notificationEmails = parsed.data.notificationEmails;
    if (notificationEmails.length === 0 && parsed.data.emailNotifications) {
      const user = await User.findById(session.user.id).lean();
      if (user && "email" in user) {
        notificationEmails = [user.email];
      }
    }

    const form = await Form.create({
      userId: session.user.id,
      name: parsed.data.name,
      allowedOrigins: parsed.data.allowedOrigins || [],
      redirectSuccess: parsed.data.redirectSuccess || undefined,
      honeypotField: parsed.data.honeypotField,
      hcaptchaSecret: parsed.data.hcaptchaSecret,
      rateLimit: parsed.data.rateLimit,
      emailNotifications: parsed.data.emailNotifications,
      notificationEmails,
      apiKey,
      apiKeyPreview,
    });

    // We return the raw key only once upon creation
    const { apiKey: _apiKey, _id, ...formWithoutHash } = form.toObject();

    return NextResponse.json({
      ...formWithoutHash,
      id: _id,
      rawApiKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
