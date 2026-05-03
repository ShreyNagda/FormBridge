import { WebhookPayload } from "./email";

export interface SlackConfig {
    webhookUrl: string;
    channel?: string;
}

export async function sendSlack(
    config: SlackConfig,
    payload: WebhookPayload
): Promise<{ success: boolean; httpStatus?: number; responseBody?: string }> {
    try {
        const fields = Object.entries(payload.data).map(([name, value]) => ({
            type: "mrkdwn",
            text: `*${name}*\n${value || "_Empty_"}`,
        }));

        const body: any = {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `New submission: ${payload.formName}`,
                        emoji: true,
                    },
                },
                {
                    type: "section",
                    fields: fields.slice(0, 10), // Slack limits fields
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "plain_text",
                            text: `ID: ${payload.submissionId} | ${payload.timestamp.toISOString()}`,
                        },
                    ],
                },
            ],
        };

        if (config.channel) {
            body.channel = config.channel;
        }

        const response = await fetch(config.webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const responseBody = await response.text();

        return {
            success: response.ok,
            httpStatus: response.status,
            responseBody,
        };
    } catch (error: any) {
        return {
            success: false,
            httpStatus: 500,
            responseBody: error?.message || String(error),
        };
    }
}
