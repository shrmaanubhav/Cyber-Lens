import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", { email, password });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Log in to <span className="text-cyan-400">CyberLens</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Access your threat intelligence dashboard
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
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-cyan-500 text-neutral-950 font-semibold hover:bg-cyan-400 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-cyan-400 hover:underline">
                Sign up
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

export default Login;
