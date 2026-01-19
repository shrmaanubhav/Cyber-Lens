import React, { useState } from "react";

const VerifyEmail: React.FC = () => {
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      console.log("Verification email resent");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <svg
              className="w-8 h-8 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">Check your email</h1>
          <p className="text-neutral-400 text-sm">
            We've sent a verification link to your inbox
          </p>
        </div>

        <div className="border border-neutral-800 bg-neutral-900 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-neutral-300 mb-4">
                Click the link in the email to verify your account and complete
                your registration.
              </p>
              <p className="text-xs text-neutral-500">
                The link will expire in 24 hours
              </p>
            </div>

            <div className="border-t border-neutral-800 pt-6">
              <p className="text-sm text-neutral-400 text-center mb-4">
                Didn't receive the email?
              </p>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 font-medium hover:bg-neutral-700 transition-colors disabled:bg-neutral-800 disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/login"
            className="text-sm text-cyan-400 hover:underline inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
