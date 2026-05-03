import { WebhookPayload } from "./email";
import { sendDiscord, DiscordConfig } from "./discord";
import { sendSlack, SlackConfig } from "./slack";

// Mongoose stores configs as mixed objects, which resolve to any in our code.
export async function dispatchWebhook(
  webhook: { channel: string; config: any },
  submissionData: WebhookPayload,
): Promise<{ success: boolean; httpStatus?: number; responseBody?: string }> {
  switch (webhook.channel) {
    case "DISCORD":
      return await sendDiscord(webhook.config as DiscordConfig, submissionData);
    case "SLACK":
      return await sendSlack(webhook.config as SlackConfig, submissionData);
    default:
      return {
        success: false,
        httpStatus: 400,
        responseBody: `Unsupported channel type: ${webhook.channel}`,
      };
  }
}
