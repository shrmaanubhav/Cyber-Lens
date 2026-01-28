import nodemailer from "nodemailer";
import transporter from "../utils/emailTransport";

interface SendEmailOptions {
  to: string;
  subject: string;
  verificationLink: string;
  emailType?: 'registration' | 'passwordReset';
}

export async function sendEmail({
  to,
  subject,
  verificationLink,
  emailType = 'registration',
}: SendEmailOptions): Promise<void> {
  try {
    const isPasswordReset = emailType === 'passwordReset';
    
    const emailContent = isPasswordReset ? {
      text: `
        Reset your Cyber Lens password

        You requested to reset your password. Click the link below to set a new password:
        ${verificationLink}

        This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.
        `,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 12px;">Reset your Cyber Lens password</h2>

          <p>
            You requested to reset your password. Click the link below to set a new password:
          </p>

          <p>
            <a
              href="${verificationLink}"
              style="
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
              "
            >
              Click here to reset your password
            </a>
          </p>

          <p style="margin-top: 16px; color: #666;">
            <strong>Note:</strong> This link will expire in 1 hour for security reasons.
          </p>

          <p style="margin-top: 16px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>

          <p style="margin-top: 24px; color: #555;">
            - Cyber Lens Team
          </p>
        </div>
      `
    } : {
      text: `
        Welcome to Cyber Lens!

        Please verify your email address by visiting the link below:
        ${verificationLink}

        If you did not sign up, you can safely ignore this email.
        `,

      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 12px;">Welcome to Cyber Lens</h2>

          <p>
            Please verify your email address by clicking the link below:
          </p>

          <p>
            <a
              href="${verificationLink}"
              style="
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
              "
            >
              Click here to verify your email
            </a>
          </p>

          <p style="margin-top: 16px;">
            If you did not sign up, you can safely ignore this email.
          </p>

          <p style="margin-top: 24px; color: #555;">
            - Cyber Lens Team
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    // Ethereal/stream preview URL (for testing)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.info("[email] Preview URL:", previewUrl);
    } else if ((info as any).message) {
      console.info("[email] Message (stream):\n", (info as any).message.toString());
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}