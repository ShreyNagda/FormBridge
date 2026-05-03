import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailConfig {
  to: string;
  subject?: string;
}

export interface WebhookPayload {
  formName: string;
  data: Record<string, string>;
  submissionId: string;
  timestamp: Date;
}

export async function sendEmail(
  config: EmailConfig,
  payload: WebhookPayload,
): Promise<{ success: boolean; httpStatus?: number; responseBody?: string }> {
  try {
    const subject = config.subject || `New submission on ${payload.formName}`;

    let htmlContent = `<h2>New submission for ${payload.formName}</h2>`;
    htmlContent += `<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 600px;">`;
    htmlContent += `<thead><tr><th style="text-align: left; background: #f4f4f5;">Field</th><th style="text-align: left; background: #f4f4f5;">Value</th></tr></thead><tbody>`;

    for (const [key, value] of Object.entries(payload.data)) {
      htmlContent += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
    }

    htmlContent += `</tbody></table>`;
    htmlContent += `<p style="color: #71717a; font-size: 12px; margin-top: 20px;">Submission ID: ${payload.submissionId} | Timestamp: ${payload.timestamp.toISOString()}</p>`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"StaticSend" <staticsend.web@gmail.com>',
      to: config.to,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      httpStatus: 200,
      responseBody: JSON.stringify(info),
    };
  } catch (error: any) {
    return {
      success: false,
      httpStatus: 500,
      responseBody: error?.message || String(error),
    };
  }
}

/**
 * Resolve recipient emails for a form submission based on fallback chain:
 * 1. Form's notificationEmails (if not empty)
 * 2. User's primary email
 *
 * Returns array of recipient emails, or empty array if no emails found.
 */
export function resolveRecipientEmails(
  formEmailNotifications: boolean,
  formNotificationEmails: string[],
  userEmail: string,
): string[] {
  if (!formEmailNotifications) {
    return [];
  }

  if (formNotificationEmails.length > 0) {
    return formNotificationEmails;
  }

  return userEmail ? [userEmail] : [];
}
