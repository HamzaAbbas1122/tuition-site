"use client";

import { useState } from "react";
import { createTuitionClass } from "./actions";
import { SUBJECTS, GRADES } from "@/lib/constants";

interface StudentOption {
  id: string;
  name: string;
  studentProfile?: {
    grade?: string | null;
  } | null;
}

interface TeacherOption {
  id: string;
  name: string;
}

interface Props {
  teachers: TeacherOption[];
  students: StudentOption[];
}

export default function CreateTuitionForm({ teachers, students }: Props) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("Class 9");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    if (!subject) return;
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);

    // Auto-detect and set grade of selected student
    const student = students.find(s => s.id === studentId);
    if (student?.studentProfile?.grade) {
      setSelectedGrade(student.studentProfile.grade);
    }
  };

  return (
    <form action={createTuitionClass} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Teacher</label>
          <select name="teacherId" className="glass-input w-full rounded-xl p-2.5 text-sm bg-white" required>
            <option value="">Select Teacher</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Student</label>
          <select
            name="studentId"
            value={selectedStudentId}
            onChange={handleStudentChange}
            className="glass-input w-full rounded-xl p-2.5 text-sm bg-white"
            required
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} {s.studentProfile?.grade ? `(${s.studentProfile.grade})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center justify-between">
            <span>Class / Grade</span>
            {selectedStudentId && (
              <span className="text-[10px] text-blue-600 font-extrabold lowercase">(auto)</span>
            )}
          </label>
          <select
            name="grade"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="glass-input w-full rounded-xl p-2.5 text-sm bg-white font-semibold text-blue-700"
            required
          >
            {GRADES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Subjects</label>
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
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs flex items-center gap-1.5 ${isSelected
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

        {/* Hidden inputs to pass selected subjects to FormData */}
        {selectedSubjects.map((s) => (
          <input key={s} type="hidden" name="subjects" value={s} />
        ))}
        {/* Fallback to make the form validation work if no subjects selected */}
        {selectedSubjects.length === 0 && (
          <input type="text" name="subjects" required className="opacity-0 w-0 h-0 p-0 m-0 absolute" tabIndex={-1} />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Student Fee (Rs/Mo)</label>
          <input type="number" name="fee" min="0" defaultValue="0" className="glass-input w-full rounded-xl p-2.5 text-sm bg-white font-medium text-slate-800" required />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Teacher Fee</label>
          <input type="number" name="teacherFee" min="0" defaultValue="0" className="glass-input w-full rounded-xl p-2.5 text-sm bg-white font-medium text-slate-800" required />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Create Class
        </button>
      </div>
    </form>
  );
}
