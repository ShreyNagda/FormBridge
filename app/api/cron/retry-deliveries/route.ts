import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
    Form,
    Submission,
    WebhookDelivery,
    Webhook,
} from "@/lib/db/models";
import { dispatchWebhook } from "@/lib/channels/dispatcher";
import { WebhookPayload } from "@/lib/channels/email";

export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const now = new Date();

        const deliveriesToRetry = await WebhookDelivery.find({
            status: "RETRYING",
            nextRetryAt: { $lte: now },
        })
            .limit(50)
            .lean();

        if (deliveriesToRetry.length === 0) {
            return NextResponse.json({ message: "No deliveries to retry" });
        }

        const submissionIds = Array.from(
            new Set(deliveriesToRetry.map((delivery) => delivery.submissionId)),
        );
        const webhookIds = Array.from(
            new Set(deliveriesToRetry.map((delivery) => delivery.webhookId)),
        );

        const submissions = await Submission.find({
            _id: { $in: submissionIds },
        }).lean();
        const webhooks = await Webhook.find({
            _id: { $in: webhookIds },
        }).lean();

        const formIds = Array.from(new Set(submissions.map((s) => s.formId)));
        const forms = await Form.find({ _id: { $in: formIds } }).lean();

        const submissionMap = new Map(submissions.map((item) => [String(item._id), item]));
        const webhookMap = new Map(webhooks.map((item) => [String(item._id), item]));
        const formMap = new Map(forms.map((item) => [String(item._id), item]));

        const results = await Promise.allSettled(
            deliveriesToRetry.map(async (delivery) => {
                const submission = submissionMap.get(String(delivery.submissionId));
                const webhook = webhookMap.get(String(delivery.webhookId));
                const form = submission ? formMap.get(String(submission.formId)) : null;

                if (!submission || !webhook || !form) {
                    await WebhookDelivery.updateOne(
                        { _id: delivery._id },
                        { $set: { status: "FAILED", completedAt: new Date() } },
                    );
                    return;
                }

                const payload: WebhookPayload = {
                    formName: form.name,
                    data: (submission.data ?? {}) as Record<string, string>,
                    submissionId: String(submission._id),
                    timestamp: submission.createdAt,
                };

                const result = await dispatchWebhook(
                    { channel: webhook.channel, config: webhook.config },
                    payload,
                );

                const nextAttempt = delivery.attempt + 1;

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
                } else if (nextAttempt >= 3) {
                    await WebhookDelivery.updateOne(
                        { _id: delivery._id },
                        {
                            $set: {
                                status: "FAILED",
                                httpStatus: result.httpStatus,
                                responseBody: result.responseBody,
                                completedAt: new Date(),
                                attempt: nextAttempt,
                            },
                        },
                    );
                } else {
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

        return NextResponse.json({
            success: true,
            processedCount: deliveriesToRetry.length,
            results,
        });
    } catch (error: any) {
        console.error("Cron retry error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
