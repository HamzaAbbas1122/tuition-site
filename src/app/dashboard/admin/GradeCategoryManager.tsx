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
      id: string;
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
      id: string;
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
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const handleTeacherClick = (teacherId: string) => {
    window.dispatchEvent(new CustomEvent('select-teacher-timetable', { detail: { teacherId } }));
    const timetableSection = document.getElementById('timetable-section');
    if (timetableSection) {
      timetableSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStudentClick = (studentId: string, studentGrade?: string | null) => {
    setActiveTab("students");
    setSelectedGrade(studentGrade || "All Classes");
    setExpandedStudentId(studentId);
  };

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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Grade Selector Vertical List */}
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 flex-nowrap md:flex-wrap gap-2 min-w-full md:min-w-[240px]">
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
              className={`flex-none px-4 py-2 md:py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between gap-3 md:gap-0 shadow-xs hover:-translate-y-0.5 w-auto md:w-full ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-md shadow-blue-500/20 border border-blue-500/30"
                  : "bg-white/90 border border-slate-200/80 text-slate-700 hover:bg-blue-50/60 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              <span className="whitespace-nowrap">{g}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 space-y-6">
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
        <div className="flex flex-col gap-4">
          {filteredStudents.length === 0 ? (
            <div className="w-full py-16 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-3xl bg-white/60">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold border border-blue-200">
                👨‍🎓
              </div>
              <p className="font-bold text-slate-800">No students found in {selectedGrade}</p>
              <p className="text-xs text-slate-500 mt-1">Accept student applications or assign students to this class grade.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredStudents.map((s) => (
                <div key={s.id} className="rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-300">
                  {/* Collapsed Header (Click to expand) */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 flex items-center justify-between"
                    onClick={() => setExpandedStudentId(expandedStudentId === s.id ? null : s.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs shrink-0">
                        {s.name.substring(0, 1).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base">{s.name}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-xs hidden sm:block">
                        {s.studentProfile?.grade || "Class 9"}
                      </span>
                      <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedStudentId === s.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedStudentId === s.id && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-start justify-between">
                        
                        {/* 1. Basic Info */}
                        <div className="min-w-[220px]">
                          <p className="text-xs font-medium text-slate-500 mb-1">Contact</p>
                          <p className="text-sm font-semibold text-slate-800">{s.email}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 sm:hidden">
                            <span className="font-semibold text-slate-500">Class:</span>
                            <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{s.studentProfile?.grade || "Class 9"}</span>
                          </div>
                        </div>

                        {/* 2. Tuitions List Summary */}
                        <div className="flex-1 w-full xl:w-auto xl:border-l xl:border-slate-100 xl:pl-6 py-2 xl:py-0 border-y xl:border-y-0 border-slate-100 my-2 xl:my-0">
                          <div className="space-y-3">
                            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                              Enrolled Tuitions ({s.studentClasses.length})
                            </p>
                            {s.studentClasses.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No active classes assigned</p>
                            ) : (
                              <ul className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                {s.studentClasses.map((c) => (
                                  <li key={c.id} className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                      <span className="font-bold text-blue-700 block mb-0.5">{c.subject}</span>
                                      <span className="text-slate-500">Subject</span>
                                    </div>
                                    <div className="sm:text-right">
                                      <button 
                                        type="button"
                                        onClick={() => handleTeacherClick(c.teacher.id)}
                                        className="font-bold text-indigo-700 hover:text-indigo-800 hover:underline flex items-center gap-1 sm:justify-end"
                                      >
                                        👨‍🏫 {c.teacher.name}
                                      </button>
                                      <span className="text-slate-500">Instructor</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        {/* 3. Edit Class Toggle Control */}
                        <div className="w-full xl:w-auto xl:border-l xl:border-slate-100 xl:pl-6 shrink-0 mt-2 xl:mt-0">
                          {editingStudentId === s.id ? (
                            <form action={async (formData) => {
                              const grade = formData.get("grade") as string;
                              await updateUserGrade(s.id, grade);
                              setEditingStudentId(null);
                            }} className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                              <span className="text-xs font-bold text-slate-600">Assign Class:</span>
                              <div className="flex items-center gap-1.5 w-full">
                                <select name="grade" defaultValue={s.studentProfile?.grade || "Class 9"} className="glass-input text-xs rounded-xl px-2.5 py-2 bg-slate-50 font-medium border border-slate-200 flex-1">
                                  {GRADES.filter(g => g !== "All Classes").map(g => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex gap-2 w-full mt-1">
                                <button type="submit" className="flex-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl shadow-xs transition-all">
                                  Save
                                </button>
                                <button type="button" onClick={() => setEditingStudentId(null)} className="flex-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-2 rounded-xl transition-all">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex justify-end">
                              <button 
                                type="button"
                                onClick={() => setEditingStudentId(s.id)}
                                className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Class
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTeachers.length === 0 ? (
            <div className="w-full py-16 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-3xl bg-white/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold border border-indigo-200">
                👨‍🏫
              </div>
              <p className="font-bold text-slate-800">No instructors found in {selectedGrade}</p>
              <p className="text-xs text-slate-500 mt-1">Accept teacher applications or assign grades to existing instructors.</p>
            </div>
          ) : (
            filteredTeachers.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between">
                
                {/* 1. Basic Info */}
                <div className="flex items-center space-x-4 min-w-[220px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 text-white font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
                    {t.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{t.email}</p>
                  </div>
                </div>

                {/* 2. Specialization & Students Summary */}
                <div className="flex-1 w-full xl:w-auto xl:border-l xl:border-slate-100 xl:pl-6 py-2 xl:py-0 border-y xl:border-y-0 border-slate-100 my-2 xl:my-0 flex flex-col sm:flex-row gap-4 xl:gap-8">
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Specialization</p>
                    <p className="font-extrabold text-slate-900 text-sm">{t.teacherProfile?.subjects || "General"}</p>
                    <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1 self-start border border-indigo-100 truncate max-w-[150px]">
                      {t.teacherProfile?.grades || "Class 2 to A Levels"}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2 sm:border-l sm:border-slate-100 sm:pl-4">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between xl:justify-start xl:gap-3">
                      <span>Assigned Students</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{t.teacherClasses.length} Student{t.teacherClasses.length !== 1 ? "s" : ""}</span>
                    </p>
                    {t.teacherClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">No assigned students</p>
                    ) : (
                      <ul className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                        {t.teacherClasses.map((c) => (
                          <li key={c.id} className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-indigo-700 block mb-0.5">{c.subject}</span>
                              <span className="text-slate-500">Subject</span>
                            </div>
                            <div className="sm:text-right">
                              <button 
                                type="button"
                                onClick={() => handleStudentClick(c.student.id, c.grade)}
                                className="font-bold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 sm:justify-end w-full sm:w-auto"
                              >
                                🎓 {c.student.name}
                              </button>
                              <span className="text-slate-500">Student <span className="font-bold text-slate-700 text-[10px] ml-1 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">{c.grade || "Unassigned"}</span></span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* 3. Edit Grades Toggle Control */}
                <div className="w-full xl:w-auto xl:border-l xl:border-slate-100 xl:pl-6 shrink-0">
                  {editingTeacherId === t.id ? (
                    <form action={async (formData) => {
                      const grade = formData.get("grade") as string;
                      await updateUserGrade(t.id, grade);
                      setEditingTeacherId(null);
                    }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-600 xl:hidden">Update Grades:</span>
                      <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <input type="text" name="grade" defaultValue={t.teacherProfile?.grades || "Class 2 to A Levels"} placeholder="Class 9, O Levels" className="glass-input text-xs rounded-xl px-2.5 py-2 bg-white font-medium border border-slate-200 flex-1 sm:flex-none min-w-[120px]" />
                        <button type="submit" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl shadow-xs transition-all shrink-0">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingTeacherId(null)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-2 rounded-xl transition-all shrink-0" title="Cancel">
                          ✕
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 xl:hidden">
                        <span className="font-semibold text-slate-500">Instructor</span>
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
              </div>
            ))
          )}
        </div>
      )}
      </div>
    </div>
  );
}
