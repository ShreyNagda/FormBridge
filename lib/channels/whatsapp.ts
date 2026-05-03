import { WebhookPayload } from "./email";

export interface WhatsAppConfig {
    to: string;
    provider: "twilio" | "meta";
    // Twilio
    accountSid?: string;
    authToken?: string;
    from?: string;
    // Meta
    accessToken?: string;
    phoneNumberId?: string;
}

export async function sendWhatsApp(
    config: WhatsAppConfig,
    payload: WebhookPayload
): Promise<{ success: boolean; httpStatus?: number; responseBody?: string }> {
    try {
        let messageText = `*New submission on ${payload.formName}*\n\n`;
        for (const [key, value] of Object.entries(payload.data)) {
            messageText += `*${key}*: ${value}\n`;
        }

        if (config.provider === "twilio") {
            if (!config.accountSid || !config.authToken || !config.from) {
                throw new Error("Missing Twilio credentials");
            }

            const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
            const params = new URLSearchParams({
                To: `whatsapp:${config.to}`,
                From: `whatsapp:${config.from}`,
                Body: messageText,
            });

            const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params,
            });

            const responseBody = await response.text();
            return {
                success: response.ok,
                httpStatus: response.status,
                responseBody,
            };
        } else if (config.provider === "meta") {
            if (!config.accessToken || !config.phoneNumberId) {
                throw new Error("Missing Meta credentials");
            }

            const url = `https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`;
            const body = {
                messaging_product: "whatsapp",
                to: config.to.replace(/\D/g, ""),
                type: "text",
                text: {
                    body: messageText,
                },
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${config.accessToken}`,
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
        } else {
            throw new Error(`Unsupported WhatsApp provider: ${config.provider}`);
        }
    } catch (error: any) {
        return {
            success: false,
            httpStatus: 500,
            responseBody: error?.message || String(error),
        };
    }
}
