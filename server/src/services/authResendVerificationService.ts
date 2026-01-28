import pool from "../db";
import { generateEmailVerificationToken } from "./emailVerificationToken";
import { sendEmail } from "./emailService";

export async function authResendVerificationService(email: string): Promise<void> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id, email_verified, last_verification_sent_at
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email],
    );

    if (!result.rowCount) return;

    const user = result.rows[0] as {
      id: string;
      email_verified: boolean;
      last_verification_sent_at: Date | null;
    };

    if (user.email_verified) return;

    const now = new Date();

    if (
      user.last_verification_sent_at &&
      now.getTime() - new Date(user.last_verification_sent_at).getTime() < 60_000
    ) {
      return;
    }

    await client.query(
      `
      UPDATE users
      SET last_verification_sent_at = NOW()
      WHERE id = $1
      `,
      [user.id],
    );

    const token = generateEmailVerificationToken({
      userId: user.id,
      email,
    });

    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
    if (!frontendUrl) throw new Error("FRONTEND_URL not configured");

    const verificationLink = `${frontendUrl}/verify-email?token=${encodeURIComponent(
      token,
    )}`;

    await sendEmail({
      to: email,
      subject: "Verify your email address",
      verificationLink,
    });

    console.info(`[email-verification] Resent magic link for ${email}: ${verificationLink}`);
  } finally {
    client.release();
  }
}
