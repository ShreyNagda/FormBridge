import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  Form,
  Submission,
  WebhookDelivery,
  Webhook,
  User,
} from "@/lib/db/models";
import { dispatchWebhook } from "@/lib/channels/dispatcher";
import {
  WebhookPayload,
  sendEmail,
  resolveRecipientEmails,
} from "@/lib/channels/email";

export const maxDuration = 300; // 5 minutes max duration for Vercel functions

export async function POST(request: Request) {
  try {
    const { submissionId, formId } = await request.json();

    if (!submissionId || !formId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();
    const submission = await Submission.findById(submissionId).lean();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const form = await Form.findById(submission.formId).lean();
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const payload: WebhookPayload = {
      formName: form.name,
      data: (submission.data ?? {}) as Record<string, string>,
      submissionId: String(submission._id),
      timestamp: submission.createdAt,
    };

    // Handle per-form email notifications
    if (form.emailNotifications) {
      const user = await User.findById(form.userId).lean();
      const recipientEmails = resolveRecipientEmails(
        form.emailNotifications,
        form.notificationEmails || [],
        user?.email || "",
      );

      if (recipientEmails.length > 0) {
        const emailResults = await Promise.allSettled(
          recipientEmails.map(async (email) => {
            const result = await sendEmail({ to: email }, payload);
            if (!result.success) {
              console.error(
                `Email delivery failed for ${email} on form ${form.name}:`,
                result.httpStatus,
                result.responseBody,
              );
            }
            return { email, result };
          }),
        );

        emailResults.forEach((outcome) => {
          if (outcome.status === "rejected") {
            console.error(
              `Email notification task crashed for form ${form.name}:`,
              outcome.reason,
            );
          }
        });
      } else {
        console.log(
          `Email notifications enabled for form ${form.name} but no recipients found`,
        );
      }
    } else {
      console.log(
        `Email notifications disabled for form ${form.name} (${submission.formId})`,
      );
    }

    // Handle webhooks
    const webhooks = await Webhook.find({
      formId,
      enabled: true,
    }).lean();

    if (webhooks.length > 0) {
      const deliveries = await WebhookDelivery.insertMany(
        webhooks.map((webhook) => ({
          submissionId,
          webhookId: webhook._id,
          status: "PENDING",
          attempt: 0,
        })),
      );

      await Promise.allSettled(
        webhooks.map(async (webhook, index) => {
          const delivery = deliveries[index];
          const result = await dispatchWebhook(
            { channel: webhook.channel, config: webhook.config },
            payload,
          );

          const nextAttempt = 1;

          if (result.success) {
            await WebhookDelivery.updateOne(
              { _id: delivery._id },
              {
                $set: {
                  status: "SUCCESS",
                  httpStatus: result.httpStatus,
                  responseBody: result.responseBody,
                  completedAt: new Date(),
                  attempt: nextAttempt,
                },
              },
            );
          } else {
            const now = new Date();
            const nextRetryAt = new Date(now.getTime() + nextAttempt * 30000);
            await WebhookDelivery.updateOne(
              { _id: delivery._id },
              {
                $set: {
                  status: "RETRYING",
                  httpStatus: result.httpStatus,
                  responseBody: result.responseBody,
                  attempt: nextAttempt,
                  nextRetryAt,
                },
              },
            );
          }
        }),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Dispatch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
