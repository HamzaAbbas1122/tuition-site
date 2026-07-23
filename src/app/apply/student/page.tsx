"use client";

import { submitStudentApplication } from "../actions";
import { SUBJECTS, GRADES } from "@/lib/constants";

export default function StudentApplicationPage() {
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
        <form action={submitStudentApplication} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Student Name</label>
              <input id="studentName" name="studentName" type="text" required placeholder="John Doe" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="parentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Parent Name</label>
              <input id="parentName" name="parentName" type="text" required placeholder="Jane Doe" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">WhatsApp Number</label>
              <input id="phone" name="phone" type="tel" required placeholder="+1 234 567 890" className="glass-input block w-full rounded-xl px-4 py-2.5 text-sm" />
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
          <div>
            <button type="submit" className="w-full flex justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
