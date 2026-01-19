import React, { useState } from "react";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Account created:", { email });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create an account</h1>
          <p className="text-neutral-400 text-sm">
            Join the <span className="text-cyan-400">CyberLens</span> platform
          </p>
        </div>

        <div className="border border-neutral-800 bg-neutral-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-neutral-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="analyst@company.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-neutral-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-neutral-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-cyan-500 text-neutral-950 font-semibold hover:bg-cyan-400 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Already have an account?{" "}
              <a href="/login" className="text-cyan-400 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-neutral-500">
          CyberLens can be used without an account
        </p>
      </div>
    </div>
  );
};

export default Signup;
