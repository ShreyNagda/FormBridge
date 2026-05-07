import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { Form, Submission, WebhookDelivery, Webhook } from "@/lib/db/models";
import { updateFormSchema } from "@/lib/validation/form";
import bcrypt from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // 1. Block requests from browsers (direct navigation or client-side fetch)
  const userAgent = request.headers.get("user-agent") || "";
  const secFetchMode = request.headers.get("sec-fetch-mode");
  const isBrowser = /Mozilla/i.test(userAgent) || !!secFetchMode;

  if (isBrowser) {
    return NextResponse.json(
      {
        error:
          "GET requests are disabled from the browser and allowed only from the server side.",
      },
      { status: 403 },
    );
  }

  // 2. Authentication (Support both API Key for servers and Session for non-browser internal calls)
  const authHeader =
    request.headers.get("authorization") || request.headers.get("x-api-key");
  let session = null;

  if (!authHeader) {
    session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    await connectDB();
    let form;

    if (authHeader) {
      // API Key Auth
      const apiKey = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
      form = await Form.findById(id).lean();

      if (!form || !form.apiKey) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const isKeyValid = await bcrypt.compare(apiKey, form.apiKey);
      if (!isKeyValid) {
        return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
      }
    } else {
      // Session Auth
      form = await Form.findOne({
        _id: id,
        userId: session?.user.id,
      }).lean();
    }

    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [submissionsCount, webhooksCount] = await Promise.all([
      Submission.countDocuments({ formId: id }),
      Webhook.countDocuments({ formId: id }),
    ]);

    const { apiKey: _apiKey, _id, ...safeForm } = form;
    return NextResponse.json({
      ...safeForm,
      id: _id,
      _count: {
        submissions: submissionsCount,
        webhooks: webhooksCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
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
    const body = await request.json();
    const parsed = updateFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    await connectDB();
    const existingForm = await Form.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!existingForm) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    if ("name" in parsed.data && parsed.data.name !== undefined) {
      updates.name = parsed.data.name;
    }
    if (
      "allowedOrigins" in parsed.data &&
      parsed.data.allowedOrigins !== undefined
    ) {
      updates.allowedOrigins = parsed.data.allowedOrigins;
    }
    if (
      "redirectSuccess" in parsed.data &&
      parsed.data.redirectSuccess !== undefined
    ) {
      updates.redirectSuccess = parsed.data.redirectSuccess;
    }
    if (
      "redirectFailure" in parsed.data &&
      parsed.data.redirectFailure !== undefined
    ) {
      updates.redirectFailure = parsed.data.redirectFailure;
    }
    if (
      "honeypotField" in parsed.data &&
      parsed.data.honeypotField !== undefined
    ) {
      updates.honeypotField = parsed.data.honeypotField;
    }
    if (
      "hcaptchaSecret" in parsed.data &&
      parsed.data.hcaptchaSecret !== undefined
    ) {
      updates.hcaptchaSecret = parsed.data.hcaptchaSecret;
    }
    if (
      "emailNotifications" in parsed.data &&
      parsed.data.emailNotifications !== undefined
    ) {
      updates.emailNotifications = parsed.data.emailNotifications;
    }
    if (
      "notificationEmails" in parsed.data &&
      parsed.data.notificationEmails !== undefined
    ) {
      updates.notificationEmails = parsed.data.notificationEmails;
    }

    if ("rateLimit" in parsed.data) {
      const value = parsed.data.rateLimit;
      if (value === null) {
        updates.rateLimit = null;
      } else if (value !== undefined && Number.isFinite(value)) {
        updates.rateLimit = value;
      }
    }

    const updatedForm = await Form.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true },
    ).lean();

    if (!updatedForm) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { apiKey: _apiKey, _id, ...safeForm } = updatedForm;
    return NextResponse.json({ ...safeForm, id: _id });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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
    await connectDB();
    const existingForm = await Form.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!existingForm) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [submissionIds, webhookIds] = await Promise.all([
      Submission.find({ formId: id }).select({ _id: 1 }).lean(),
      Webhook.find({ formId: id }).select({ _id: 1 }).lean(),
    ]);

    const submissionIdList = submissionIds.map((item) => item._id);
    const webhookIdList = webhookIds.map((item) => item._id);

    await WebhookDelivery.deleteMany({
      $or: [
        { submissionId: { $in: submissionIdList } },
        { webhookId: { $in: webhookIdList } },
      ],
    });

    await Promise.all([
      Submission.deleteMany({ formId: id }),
      Webhook.deleteMany({ formId: id }),
      Form.deleteOne({ _id: id }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
