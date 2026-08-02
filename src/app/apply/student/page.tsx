"use client";

import { useState } from "react";
import { submitStudentApplication } from "../actions";
import { SUBJECTS, GRADES } from "@/lib/constants";

export default function StudentApplicationPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;
  const passwordStrong = password.length === 0 || password.length >= 8;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await submitStudentApplication(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

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

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-md w-full space-y-8 glass-card glass-card-hover p-10 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
            <span className="text-white font-extrabold text-xl">🎓</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Apply as a Student</h2>
          <p className="mt-2 text-sm text-slate-600">Join our premium tuition sessions at Tuitionss.com.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-center font-bold">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Student Name</label>
              <input id="studentName" name="studentName" type="text" required minLength={2} maxLength={50} placeholder="John Doe" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="parentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Parent Name</label>
              <input id="parentName" name="parentName" type="text" required minLength={2} maxLength={50} placeholder="Jane Doe" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">WhatsApp Number</label>
              <input id="phone" name="phone" type="tel" required pattern="^\+?[0-9\s\-\(\)]{7,20}$" title="Please enter a valid phone number, e.g., +1 234 567 890" placeholder="+92 300 1234567" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
              <p className="text-xs text-slate-400 mt-1">Include country code, e.g. +92 300 1234567</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address</label>
              <input id="email" name="email" type="email" required maxLength={100} placeholder="student@example.com" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="grade" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Class / Grade</label>
              <select id="grade" name="grade" required className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-800">
                {GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Select Subject Needed</label>
              <select id="subject" name="subject" required className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-800">
                <option value="">Select a Subject</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Password section */}
            <div className="pt-2 border-t border-slate-200/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Set Your Portal Password</p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="student-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="student-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className={`glass-input block w-full rounded-xl px-4 py-2.5 text-sm pr-10 transition-colors ${!passwordStrong ? "border-red-300 bg-red-50/30" : ""}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password">
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                  {!passwordStrong && (
                    <p className="text-red-500 text-xs mt-1">Must be at least 8 characters</p>
                  )}
                </div>

                <div>
                  <label htmlFor="student-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="student-confirm-password"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className={`glass-input block w-full rounded-xl px-4 py-2.5 text-sm pr-10 transition-colors ${!passwordsMatch ? "border-red-300 bg-red-50/30" : confirmPassword.length > 0 ? "border-emerald-300 bg-emerald-50/20" : ""}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle confirm password">
                      <EyeIcon show={showConfirm} />
                    </button>
                  </div>
                  {!passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                  {passwordsMatch && confirmPassword.length > 0 && (
                    <p className="text-emerald-600 text-xs mt-1">✓ Passwords match</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              id="student-apply-submit"
              disabled={isLoading || !passwordsMatch || !passwordStrong}
              className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
