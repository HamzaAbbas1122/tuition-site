"use client";

import { useState } from "react";
import { updateUserGrade } from "./actions";

const GRADES = [
  "All Classes",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "O Levels",
  "A Levels",
];

interface StudentItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  studentProfile?: {
    grade?: string | null;
  } | null;
  studentClasses: Array<{
    id: string;
    subject: string;
    grade?: string | null;
    teacher: {
      name: string;
    };
  }>;
}

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  teacherProfile?: {
    subjects?: string | null;
    grades?: string | null;
  } | null;
  teacherClasses: Array<{
    id: string;
    subject: string;
    grade?: string | null;
    student: {
      name: string;
    };
  }>;
}

interface Props {
  students: StudentItem[];
  teachers: TeacherItem[];
}

export default function GradeCategoryManager({ students, teachers }: Props) {
  const [selectedGrade, setSelectedGrade] = useState("All Classes");
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  // Filter students based on selected grade
  const filteredStudents = students.filter((s) => {
    if (selectedGrade === "All Classes") return true;
    const studentGrade = s.studentProfile?.grade || "";
    const classGrades = s.studentClasses.map(c => c.grade || "");
    return studentGrade.toLowerCase() === selectedGrade.toLowerCase() || classGrades.includes(selectedGrade);
  });

  // Filter teachers based on selected grade
  const filteredTeachers = teachers.filter((t) => {
    if (selectedGrade === "All Classes") return true;
    const teacherGrades = t.teacherProfile?.grades || "";
    const classGrades = t.teacherClasses.map(c => c.grade || "");
    return teacherGrades.toLowerCase().includes(selectedGrade.toLowerCase()) || classGrades.includes(selectedGrade);
  });

  return (
    <div className="space-y-6">
      {/* Grade Selector Pills */}
      <div className="flex overflow-x-auto pb-3 sm:pb-2 flex-nowrap sm:flex-wrap gap-2 sm:gap-2.5 max-w-full">
        {GRADES.map((g) => {
          const count = g === "All Classes" 
            ? (activeTab === "students" ? students.length : teachers.length)
            : (activeTab === "students"
                ? students.filter(s => (s.studentProfile?.grade || "") === g || s.studentClasses.some(c => c.grade === g)).length
                : teachers.filter(t => (t.teacherProfile?.grades || "").toLowerCase().includes(g.toLowerCase()) || t.teacherClasses.some(c => c.grade === g)).length
              );

          const isActive = selectedGrade === g;

          return (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center shadow-xs hover:-translate-y-0.5 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-md shadow-blue-500/20 border border-blue-500/30"
                  : "bg-white/90 border border-slate-200/80 text-slate-700 hover:bg-blue-50/60 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              <span>{g}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Directory Sub-Header & Segmented Control Switcher */}
      <div className="bg-gradient-to-r from-slate-50/90 via-white to-blue-50/40 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
              Directory Category: <span className="blue-glow-text font-black">{selectedGrade}</span>
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? "s" : ""} and <strong className="text-slate-800">{filteredTeachers.length}</strong> instructor{filteredTeachers.length !== 1 ? "s" : ""} registered in {selectedGrade}.
          </p>
        </div>

        {/* iOS-style Segmented Control */}
        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center space-x-1 border border-slate-300/40 shadow-inner">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === "students"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👨‍🎓 Students</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "students" ? "bg-blue-50 text-blue-700 font-bold" : "bg-slate-300/60 text-slate-700"}`}>
              {filteredStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === "teachers"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👨‍🏫 Instructors</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "teachers" ? "bg-indigo-50 text-indigo-700 font-bold" : "bg-slate-300/60 text-slate-700"}`}>
              {filteredTeachers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      {activeTab === "students" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-3xl bg-white/60">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold border border-blue-200">
                👨‍🎓
              </div>
              <p className="font-bold text-slate-800">No students found in {selectedGrade}</p>
              <p className="text-xs text-slate-500 mt-1">Accept student applications or assign students to this class grade.</p>
            </div>
          ) : (
            filteredStudents.map((s) => (
              <div key={s.id} className="p-6 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs">
                        {s.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{s.name}</h4>
                        <p className="text-xs font-medium text-slate-500">{s.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                      {s.studentProfile?.grade || "Class 9"}
                    </span>
                  </div>

                  {/* Tuitions List */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Enrolled Tuitions</span>
                      <span className="text-blue-600">{s.studentClasses.length} Class{s.studentClasses.length !== 1 ? "es" : ""}</span>
                    </p>
                    {s.studentClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">No active classes assigned</p>
                    ) : (
                      <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {s.studentClasses.map((c) => (
                          <li key={c.id} className="text-xs text-slate-800 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70 flex justify-between items-center shadow-xs">
                            <span className="font-bold text-blue-700">{c.subject}</span>
                            <span className="text-xs text-slate-500 font-medium">Instructor: <strong className="text-slate-800">{c.teacher.name}</strong></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Edit Class Toggle Control */}
                {editingStudentId === s.id ? (
                  <form action={async (formData) => {
                    const grade = formData.get("grade") as string;
                    await updateUserGrade(s.id, grade);
                    setEditingStudentId(null);
                  }} className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">Assign Class:</span>
                    <div className="flex items-center gap-1.5">
                      <select name="grade" defaultValue={s.studentProfile?.grade || "Class 9"} className="glass-input text-xs rounded-xl px-2.5 py-1.5 bg-white font-medium border border-slate-200">
                        {GRADES.filter(g => g !== "All Classes").map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <button type="submit" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingStudentId(null)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl transition-all" title="Cancel">
                        ✕
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Assigned Class:</span>
                      <span className="font-extrabold text-blue-700">{s.studentProfile?.grade || "Class 9"}</span>
                    </div>
                    <button 
                      onClick={() => setEditingStudentId(s.id)}
                      className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Class
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-3xl bg-white/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold border border-indigo-200">
                👨‍🏫
              </div>
              <p className="font-bold text-slate-800">No instructors found in {selectedGrade}</p>
              <p className="text-xs text-slate-500 mt-1">Accept teacher applications or assign grades to existing instructors.</p>
            </div>
          ) : (
            filteredTeachers.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs">
                        {t.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                        <p className="text-xs font-medium text-slate-500">{t.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
                      Instructor
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Specialization:</span>
                      <span className="font-extrabold text-slate-900">{t.teacherProfile?.subjects || "General"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/50">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Grades Taught:</span>
                      <span className="font-extrabold text-blue-700 truncate max-w-[140px] text-right">{t.teacherProfile?.grades || "Class 2 to A Levels"}</span>
                    </div>
                  </div>

                  {/* Assigned Students */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Assigned Students</span>
                      <span className="text-indigo-600">{t.teacherClasses.length} Student{t.teacherClasses.length !== 1 ? "s" : ""}</span>
                    </p>
                    {t.teacherClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">No assigned students</p>
                    ) : (
                      <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {t.teacherClasses.map((c) => (
                          <li key={c.id} className="text-xs text-slate-800 bg-white p-2 rounded-lg border border-slate-200/70 flex justify-between items-center shadow-xs">
                            <span className="font-bold text-slate-900">{c.student.name}</span>
                            <span className="text-blue-700 font-semibold text-[11px]">{c.subject} • {c.grade || "Class 9"}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Edit Grades Toggle Control */}
                {editingTeacherId === t.id ? (
                  <form action={async (formData) => {
                    const grade = formData.get("grade") as string;
                    await updateUserGrade(t.id, grade);
                    setEditingTeacherId(null);
                  }} className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">Update Grades:</span>
                    <div className="flex items-center gap-1.5">
                      <input type="text" name="grade" defaultValue={t.teacherProfile?.grades || "Class 2 to A Levels"} placeholder="Class 9, O Levels" className="glass-input text-xs rounded-xl px-2.5 py-1.5 bg-white max-w-[120px] font-medium border border-slate-200" />
                      <button type="submit" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingTeacherId(null)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl transition-all" title="Cancel">
                        ✕
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Grades Taught:</span>
                      <span className="font-extrabold text-blue-700 truncate max-w-[130px]">{t.teacherProfile?.grades || "Class 2 to A Levels"}</span>
                    </div>
                    <button 
                      onClick={() => setEditingTeacherId(t.id)}
                      className="text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Grades
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
