import { Request, Response } from "express";
import { authSignupService } from "../services/authSignupService";
import { generateEmailVerificationToken } from "../services/emailVerificationToken";
import { sendEmail } from "../services/emailService";

/**
 * POST /auth/signup
 *
 * Body:
 * {
 *   "email": string,
 *   "password": string
 * }
 *
 * Response:
 * { "status": "ok" }
 */
export async function authSignupController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Create user
    const { userId } = await authSignupService({ email, password });

    // Generate verification token
    const token = generateEmailVerificationToken({ userId, email });

    // Frontend URL must exist
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
    if (!frontendUrl) {
      throw new Error("FRONTEND_URL must be set in environment");
    }

    const verificationLink = `${frontendUrl}/verify-email?token=${encodeURIComponent(
      token,
    )}`;

    /**
     * Send verification email in background
     * IMPORTANT: Do NOT await this, otherwise signup hangs if SMTP is slow.
     */
    sendEmail({
      to: email,
      subject: "Verify your email address",
      verificationLink,
    }).catch((emailError) => {
      console.error("Failed to send verification email:", emailError);
    });

    // Debug log
    console.info(
      `[email-verification] Magic link for ${email}: ${verificationLink}`,
    );

    // Respond immediately
    res.status(201).json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";

    // Explicit safe errors
    if (message === "Email already registered") {
      res.status(409).json({ error: message });
      return;
    }

    if (
      message === "Invalid email format" ||
      message === "Email and password are required" ||
      message === "Password must be at least 8 characters long"
    ) {
      res.status(400).json({ error: message });
      return;
    }

    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
