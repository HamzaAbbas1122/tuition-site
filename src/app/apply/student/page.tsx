"use client";

import { useState } from "react";
import { submitStudentApplication } from "../actions";
import { SUBJECTS, GRADES } from "@/lib/constants";

export default function StudentApplicationPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-md w-full space-y-8 glass-card glass-card-hover p-10 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
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
          </div>

          {/* Password info note */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
            <span className="text-blue-500 text-base shrink-0 mt-0.5">✉️</span>
            <p className="text-xs text-blue-800 leading-relaxed">
              Once your application is reviewed, you&apos;ll receive an email with a link to set your dashboard password.
            </p>
          </div>

          <div>
            <button
              type="submit"
              id="student-apply-submit"
              disabled={isLoading}
              className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
