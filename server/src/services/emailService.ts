import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  verificationLink: string;
  emailType?: "registration" | "passwordReset";
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  verificationLink,
  emailType = "registration",
}: SendEmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing, skipping email send.");
    return;
  }

  const isPasswordReset = emailType === "passwordReset";

  const html = isPasswordReset
    ? `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
        <h2>Reset your Cyber Lens password</h2>

        <p>You requested a password reset. Click below:</p>

        <p>
          <a href="${verificationLink}">
            Reset Password
          </a>
        </p>

        <p><strong>Note:</strong> This link expires in 1 hour.</p>

        <p>If you did not request this, ignore this email.</p>

        <p>- Cyber Lens Team</p>
      </div>
    `
    : `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
        <h2>Welcome to Cyber Lens</h2>

        <p>Please verify your email address:</p>

        <p>
          <a href="${verificationLink}">
            Verify Email
          </a>
        </p>

        <p>If you did not sign up, ignore this email.</p>

        <p>- Cyber Lens Team</p>
      </div>
    `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Cyber Lens <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("[email] Sent successfully:", result.id);
  } catch (error) {
    console.error("[email] Resend send failed:", error);
  }
}
