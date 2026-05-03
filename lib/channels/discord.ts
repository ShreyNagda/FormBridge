import { WebhookPayload } from "./email";

export interface DiscordConfig {
    webhookUrl: string;
    username?: string;
    avatarUrl?: string;
}

export async function sendDiscord(
    config: DiscordConfig,
    payload: WebhookPayload
): Promise<{ success: boolean; httpStatus?: number; responseBody?: string }> {
    try {
        const fields = Object.entries(payload.data).map(([name, value]) => ({
            name: name,
            value: value || "*Empty*",
            inline: true,
        }));

        const body = {
            username: config.username || "StaticSend",
            avatar_url: config.avatarUrl,
            embeds: [
                {
                    title: `New submission on ${payload.formName}`,
                    color: 0x6366f1, // Indigo
                    fields: fields.slice(0, 25), // Discord allows max 25 fields
                    footer: {
                        text: `ID: ${payload.submissionId}`,
                    },
                    timestamp: payload.timestamp.toISOString(),
                },
            ],
        };

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
