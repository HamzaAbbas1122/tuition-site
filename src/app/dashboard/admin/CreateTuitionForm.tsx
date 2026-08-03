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
    <form action={createTuitionClass} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
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

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Subjects</label>
        <select name="subjects" multiple className="glass-input w-full rounded-xl p-2.5 text-sm bg-white font-medium text-slate-800 min-h-[80px]" required>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <p className="text-[10px] text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Monthly Fee (Rs/Mo)</label>
        <input type="number" name="fee" min="0" defaultValue="0" className="glass-input w-full rounded-xl p-2.5 text-sm bg-white font-medium text-slate-800" required />
      </div>

      <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:col-span-2">
        Create Class
      </button>
    </form>
  );
}
