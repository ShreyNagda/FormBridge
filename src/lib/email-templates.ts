export function getVerificationEmailTemplate(
  name: string,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #111827;">Verify your email address</h1>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                Hi ${name},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                Thanks for signing up for StaticSend! To complete your registration and start collecting form submissions, please verify your email address by clicking the button below.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 20px; color: #3b82f6; word-break: break-all;">
                ${verificationUrl}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #9ca3af;">
                  This verification link will expire in 24 hours. If you didn't create an account with StaticSend, you can safely ignore this email.
                </p>
              </div>
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
  `.trim();
}

export function getWelcomeEmailTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to StaticSend</title>
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
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #111827;">Welcome to StaticSend! 🎉</h1>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                Hi ${name},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                Your email has been successfully verified! You're all set to start using StaticSend to collect form submissions from your static sites.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="${
                      process.env.NEXTAUTH_URL
                    }/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 32px; padding: 24px; background-color: #f9fafb; border-radius: 6px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">Quick Start Guide:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 24px;">
                  <li>Create your first form in the dashboard</li>
                  <li>Copy the API endpoint URL</li>
                  <li>Add it to your static site's form action</li>
                  <li>Start receiving submissions via email!</li>
                </ol>
              </div>
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
  `.trim();
}
