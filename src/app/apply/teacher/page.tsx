"use client";

import { useState } from "react";
import { submitTeacherApplication } from "../actions";
import { SUBJECTS, GRADES } from "@/lib/constants";

export default function TeacherApplicationPage() {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([
    "Class 9",
    "O Levels",
    "A Levels",
  ]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Mathematics",
    "Physics",
  ]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleGrade = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter((g) => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const selectAllGrades = () => {
    if (selectedGrades.length === GRADES.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades([...GRADES]);
    }
  };

  const toggleSubject = (subject: string) => {
    if (!subject) return;
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await submitTeacherApplication(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  const hiringSteps = [
    {
      num: "01",
      icon: "📝",
      title: "Free Application",
      desc: "Apply here — no fee. The FAQ already states the screening and paid training structure upfront, so nothing about pricing is a surprise later.",
      tag: null,
    },
    {
      num: "02",
      icon: "📞",
      title: "Subject Screening Call (5–10 min)",
      desc: "A short call to check subject depth and grade-level fit only. No mention of training or fees — it's purely a pass/fail competency check.",
      tag: null,
    },
    {
      num: "03",
      icon: "🎓",
      title: "Training Invitation (Transparent)",
      desc: "Candidates who pass are invited to the 7-Day Professional Teacher Training, led by a named trainer with 3 years of online teaching experience.",
      tag: "Rs. 3,000",
    },
    {
      num: "04",
      icon: "🏫",
      title: "Graded Demo Class",
      desc: "Training ends with an observed mock class evaluated by the trainer. This is what earns \"Verified\" status — not merely completing 7 days.",
      tag: null,
    },
    {
      num: "05",
      icon: "✅",
      title: "Verified Badge + Roster Placement",
      desc: "Successful candidates receive the Verified Teacher badge, a certificate, and reusable materials. You're added to the roster and matched as student demand arrives — typically within a few weeks.",
      tag: null,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">

      {/* ── 5-Step Process Banner ── */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            How Our Teacher Hiring Works
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Join as a <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Verified Teacher</span>
          </h1>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">
            We keep the process transparent from start to finish. Here&apos;s exactly what to expect after you submit your application.
          </p>
        </div>

        {/* Steps — vertical on mobile, 5-col grid on xl */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden xl:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 relative z-10">
            {hiringSteps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
              >
                {/* Number badge */}
                <div className="relative mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <span className="text-white text-xs font-extrabold">{step.num}</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{step.title}</h3>

                {/* Training fee tag */}
                {step.tag && (
                  <span className="inline-block mb-2 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-amber-50 border border-amber-300 text-amber-800">
                    {step.tag} fee
                  </span>
                )}

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency note */}
        <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <span className="text-amber-500 text-lg shrink-0">💡</span>
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Full transparency:</strong> The 7-Day Training (Rs. 3,000) is mentioned in the FAQ before you apply — so you already know what to expect. There are no hidden fees at any stage.
          </p>
        </div>
      </div>

      {/* ── Application Form ── */}
      <div className="max-w-xl mx-auto">
      <div className="w-full space-y-8 glass-card glass-card-hover p-8 sm:p-10 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
            <span className="text-white font-extrabold text-xl">👨‍🏫</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Become a Teacher</h2>
          <p className="mt-2 text-sm text-slate-600">Join our team of premium educators at Tuitionss.com.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-center font-bold">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={50}
                placeholder="Dr. Alex Smith"
                className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={100}
                  placeholder="alex@tuitionss.com"
                  className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="^\+?[0-9\s\-\(\)]{7,20}$"
                  title="Please enter a valid phone number, e.g., +1 234 567 890"
                  placeholder="+92 300 1234567"
                  className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Include country code, e.g. +92 300 1234567</p>
              </div>
            </div>

            {/* Qualification */}
            <div>
              <label htmlFor="qualification" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Highest Qualification
              </label>
              <input
                id="qualification"
                name="qualification"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. BS Mathematics, MSc Physics, B.Ed"
                className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            {/* Select Subjects Dropdown & Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subjects You Can Teach
              </label>
              
              <div className="space-y-2">
                <select
                  onChange={(e) => {
                    toggleSubject(e.target.value);
                    e.target.value = "";
                  }}
                  className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-800"
                >
                  <option value="">-- Choose Subject to Add --</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {selectedSubjects.includes(s) ? `✓ ${s} (Selected)` : s}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 p-3 bg-white/80 border border-slate-200/80 rounded-2xl min-h-[52px]">
                  {SUBJECTS.map((s) => {
                    const isSelected = selectedSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSubject(s)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500/30 shadow-md shadow-blue-500/20"
                            : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <span>{isSelected ? "✓" : "+"}</span>
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pass joined subjects string or multiple fields */}
              <input type="hidden" name="subjects" value={selectedSubjects.join(", ")} />
            </div>

            {/* Select Grades Taught (Class 2 to A Levels) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Classes / Grades You Can Teach <span className="text-blue-600 font-extrabold">(Class 2 to A Levels)</span>
                </label>
                <button
                  type="button"
                  onClick={selectAllGrades}
                  className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {selectedGrades.length === GRADES.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-white/80 border border-slate-200/80 rounded-2xl">
                {GRADES.map((g) => {
                  const isSelected = selectedGrades.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGrade(g)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500/30 shadow-md shadow-blue-500/20"
                          : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <span>{isSelected ? "✓" : "+"}</span>
                      <span>{g}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hidden inputs to pass selected grades to FormData */}
              {selectedGrades.map((g) => (
                <input key={g} type="hidden" name="grades" value={g} />
              ))}
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
              id="teacher-apply-submit"
              disabled={isLoading}
              className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Teacher Application"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
