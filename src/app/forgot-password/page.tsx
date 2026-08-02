"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/password";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);
    setStatus(result);
    setIsLoading(false);
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
      <div className="max-w-md w-full space-y-8 glass-card glass-card-hover p-10 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your account email and we will send you a reset link.
          </p>
        </div>

        {status?.success ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm text-center font-medium">
              ✅ {status.success}
            </div>
            <p className="text-xs text-slate-500 text-center">
              Check your inbox (and spam folder). The link expires in <strong>1 hour</strong>.
            </p>
            <Link
              href="/login"
              className="block text-center text-sm text-blue-600 font-semibold hover:underline mt-2"
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {status?.error && (
              <div className="text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-center font-bold">
                {status.error}
              </div>
            )}
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              id="forgot-password-submit"
              disabled={isLoading}
              className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700 font-medium">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
