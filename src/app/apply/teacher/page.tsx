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

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-xl w-full space-y-8 glass-card glass-card-hover p-8 sm:p-10 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
            <span className="text-white font-extrabold text-xl">👨‍🏫</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Become a Teacher</h2>
          <p className="mt-2 text-sm text-slate-600">Join our team of premium educators at Tuitionss.com.</p>
        </div>

        <form action={submitTeacherApplication} className="mt-8 space-y-6">
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
                  placeholder="+1 234 567 890"
                  className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
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

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit Teacher Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
