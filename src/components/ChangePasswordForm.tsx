"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/password";

const EyeIcon = ({ show }: { show: boolean }) =>
  show ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

export default function ChangePasswordForm() {
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordStrong = newPassword.length === 0 || newPassword.length >= 8;
  const passwordsMatch = confirmPassword === "" || newPassword === confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ error: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ error: "New password must be at least 8 characters." });
      return;
    }
    setIsLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);
    setStatus(result);
    setIsLoading(false);
    if (result.success) {
      (e.target as HTMLFormElement).reset();
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <details className="group glass-card rounded-2xl overflow-hidden">
      <summary className="flex items-center gap-3 p-5 sm:p-6 cursor-pointer select-none hover:bg-slate-50/60 transition-colors list-none">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
          <p className="text-xs text-slate-500 mt-0.5">Update your account password</p>
        </div>
        <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mt-4">
          {status?.success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold text-center">
              ✅ {status.success}
            </div>
          )}
          {status?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">
              ❌ {status.error}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label htmlFor="cp-current" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                id="cp-current"
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                required
                minLength={1}
                placeholder="Your current password"
                className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Toggle visibility">
                <EyeIcon show={showCurrent} />
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="cp-new" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="cp-new"
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={`glass-input block w-full rounded-xl px-4 py-2.5 text-sm pr-10 transition-colors ${!passwordStrong ? "border-red-300 bg-red-50/30" : ""}`}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Toggle visibility">
                <EyeIcon show={showNew} />
              </button>
            </div>
            {!passwordStrong && <p className="text-red-500 text-xs mt-1">Must be at least 8 characters</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="cp-confirm" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="cp-confirm"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={8}
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`glass-input block w-full rounded-xl px-4 py-2.5 text-sm pr-10 transition-colors ${!passwordsMatch ? "border-red-300 bg-red-50/30" : confirmPassword.length > 0 ? "border-emerald-300 bg-emerald-50/20" : ""}`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Toggle visibility">
                <EyeIcon show={showConfirm} />
              </button>
            </div>
            {!passwordsMatch && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
            {passwordsMatch && confirmPassword.length > 0 && <p className="text-emerald-600 text-xs mt-1">✓ Passwords match</p>}
          </div>

          <button
            type="submit"
            id="change-password-submit"
            disabled={isLoading || !passwordsMatch || !passwordStrong}
            className="w-full flex justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 border border-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </details>
  );
}
