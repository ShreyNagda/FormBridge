import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Form from "@/models/Form";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;

    // Parse body based on content type
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value;
      });
    }

    await connectDB();

    const form = await Form.findById(formId);
    if (!form || !form.isActive) {
      return NextResponse.json(
        { message: "Form not found or inactive" },
        { status: 404 }
      );
    }

    // Create submission
    await Submission.create({
      formId,
      data,
    });

    // Send email notification if enabled
    if (form.settings.emailNotifications) {
      const user = await User.findById(form.userId);
      if (user && user.email) {
        // Format data for email
        const dataHtml = Object.entries(data)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join("<br>");

        await sendEmail({
          to: user.email,
          subject: `New submission for ${form.name}`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Submission</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #000000;">
                          <div style="display: inline-flex; align-items: center; gap: 8px;">
                            <div style="width: 28px; height: 28px; background-color: #000000; border: 2px solid #ffffff; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center;">
                              <div style="width: 12px; height: 12px; background-color: #ffffff; border-radius: 2px;"></div>
                            </div>
                            <span style="color: #ffffff; font-size: 20px; font-weight: bold;">StaticSend</span>
                          </div>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #111827;">New Form Submission</h1>
                          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                            You have received a new submission for your form <strong>${
                              form.name
                            }</strong>.
                          </p>

                          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #e5e7eb;">
                            ${dataHtml}
                          </div>

                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="padding: 24px 0;">
                                <a href="${
                                  process.env.NEXTAUTH_URL
                                }/dashboard/forms/${formId}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
                                  View in Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 24px 40px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                            © ${new Date().getFullYear()} StaticSend. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
      }
    }

    return NextResponse.json(
      { message: "Submission received successfully" },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
