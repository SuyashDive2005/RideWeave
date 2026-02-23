import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthInput } from "@/app.components/auth/auth-input";
import type { AuthFormProps } from "@/app.components/auth/auth.types";

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onModeChange,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  message,
  onLogin,
  onSignUp,
  onGoogleLogin,
}) => {
  const isSignUp = mode === "signup";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignUp) {
      onSignUp();
      return;
    }
    onLogin();
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-semibold text-(--auth-text)">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-(--auth-muted)">
          {isSignUp
            ? "Set up your profile and start riding in minutes."
            : "Sign in to your account."}
        </p>
      </div>

      <div className="rounded-3xl border border-(--auth-border) bg-(--auth-surface) shadow-(--auth-shadow) p-8 space-y-6">
        <button
          onClick={onGoogleLogin}
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-(--auth-border) bg-(--auth-surface-muted) text-sm font-semibold hover:bg-(--auth-surface-strong) transition disabled:opacity-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-(--auth-border) bg-white/90 shadow-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
            >
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.2-1.5 3.6-5.4 3.6a6 6 0 110-12c1.7 0 2.9.7 3.6 1.4l2.4-2.4C16.6 3.3 14.5 2.3 12 2.3a9.7 9.7 0 000 19.4c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1-.2-1.5H12z"
              />
              <path
                fill="#34A853"
                d="M3.5 7.1l3.2 2.3a6 6 0 018.8-2.7l2.4-2.4C16.6 3.3 14.5 2.3 12 2.3 8.2 2.3 5 4.5 3.5 7.1z"
              />
              <path
                fill="#FBBC05"
                d="M12 21.7c2.4 0 4.4-.8 5.9-2.1l-2.8-2.2c-.8.6-1.9 1.1-3.1 1.1a6 6 0 01-5.7-4.1l-3.2 2.5c1.5 3.6 5 4.8 8.9 4.8z"
              />
              <path
                fill="#4285F4"
                d="M21.1 12.3c0-.6-.1-1-.2-1.5H12v3.9h5.4c-.3 1.5-1.8 3.1-5.4 3.1a6 6 0 01-5.7-4.1l-3.2 2.5c1.5 3.6 5 4.8 8.9 4.8 5.1 0 9.1-3.6 9.1-8.7z"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-(--auth-muted)">
          <div className="h-px flex-1 bg-(--auth-border)" />
          or
          <div className="h-px flex-1 bg-(--auth-border)" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {isSignUp && (
              <motion.div
                key="name"
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                  layout: { duration: 0.15, ease: "easeOut" },
                }}
              >
                <AuthInput
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Aarav Sharma"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div layout transition={{ duration: 0.15, ease: "easeOut" }}>
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </motion.div>
          <motion.div layout transition={{ duration: 0.15, ease: "easeOut" }}>
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </motion.div>

          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                message.includes("successful") ||
                message.includes("Check your email")
                  ? "bg-(--auth-success-bg) text-(--auth-success-text)"
                  : "bg-(--auth-error-bg) text-(--auth-error-text)"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-(--brand-2) text-white font-semibold hover:bg-(--brand-1) transition disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Create account" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => onModeChange(isSignUp ? "signin" : "signup")}
              disabled={loading}
              className="h-11 rounded-xl border border-(--auth-border) text-(--auth-text) font-semibold hover:bg-(--auth-surface-muted) transition"
            >
              {isSignUp ? "Back to sign in" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
