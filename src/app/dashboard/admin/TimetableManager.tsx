"use client";

import { useState } from "react";
import { generateMonthSchedule, handleRescheduleRequest, deleteSession, deleteTuition, deleteUser } from "./actions";

type Session = {
  id: string;
  date: Date;
  endTime: Date;
  status: string;
  classLink: string | null;
  rescheduleStatus: string | null;
  rescheduleProposedTime: Date | null;
  rescheduleProposedEndTime?: Date | null;
  rescheduleReason: string | null;
  rescheduleRequestedBy: string | null;
};

type Tuition = {
  id: string;
  subject: string;
  student: { name: string, grade?: string | null };
  sessions: Session[];
};

type Teacher = {
  id: string;
  name: string;
  teacherProfile?: { subjects?: string | null } | null;
  teacherClasses: Tuition[];
};

export default function TimetableManager({ teachers }: { teachers: Teacher[] }) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedTuitionId, setSelectedTuitionId] = useState<string | null>(null);

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
  const selectedTuition = selectedTeacher?.teacherClasses.find(t => t.id === selectedTuitionId);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="flex flex-col md:flex-row gap-6 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden min-h-[500px]">
      {/* Left Sidebar: Teachers */}
      <div className="w-full md:w-1/4 bg-gray-50/50 border-r border-gray-100 p-5 overflow-y-auto">
        <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-4 pb-2 border-b border-gray-200">Instructors</h3>
        <ul className="space-y-1.5">
          {teachers.map((teacher, idx) => (
            <li key={teacher.id} className="relative group">
              <button 
                onClick={() => {
                  setSelectedTeacherId(teacher.id);
                  setSelectedTuitionId(null);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${selectedTeacherId === teacher.id ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'hover:bg-gray-100 text-gray-600 pr-8'}`}
              >
                {teacher.name}
              </button>
              <form action={deleteUser.bind(null, teacher.id)} onSubmit={(e) => { if(!confirm("Are you sure you want to delete this teacher? All their classes and sessions will be deleted permanently.")) e.preventDefault(); }} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="submit" className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50" title="Delete Teacher">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Area: Timetable details */}
      <div className="w-full md:w-3/4 p-8 overflow-y-auto bg-white">
        {!selectedTeacher ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p className="text-sm">Select an instructor to manage their timetable</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-baseline gap-3 mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTeacher.name}
              </h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {selectedTeacher.teacherProfile?.subjects || "General"}
              </span>
            </div>
            
            {/* Class selection for this teacher */}
            <div className="mb-8 flex flex-wrap gap-2">
              {selectedTeacher.teacherClasses.map((tuition) => (
                <div key={tuition.id} className="relative group inline-block">
                  <button
                    onClick={() => setSelectedTuitionId(tuition.id)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all pr-8 ${selectedTuitionId === tuition.id ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
                  >
                    {tuition.student.name} <span className="opacity-60 font-normal ml-1">• {tuition.subject}</span>
                  </button>
                  <form action={deleteTuition.bind(null, tuition.id)} onSubmit={(e) => { if(!confirm("Are you sure you want to delete this class? All sessions and payments will be deleted permanently.")) e.preventDefault(); }} className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="submit" className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50" title="Delete Class">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </form>
                </div>
              ))}
            </div>

            {selectedTuition && (
              <div className="animate-in slide-in-from-bottom-2 duration-300">

                {/* Generate Schedule Form */}
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mb-8">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      Generate Monthly Schedule
                    </label>
                    <form action={async (formData) => {
                      const startDate = formData.get("startDate") as string;
                      const startTime = formData.get("startTime") as string;
                      const endTime = formData.get("endTime") as string;
                      const selectedDays = formData.getAll("days").map(Number);
                      if (selectedDays.length === 0) {
                        alert("Please select at least one day of the week.");
                        return;
                      }
                      await generateMonthSchedule(selectedTuition.id, startDate, startTime, endTime, selectedDays);
                    }} className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-3 items-center">
                        <input type="date" name="startDate" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-600" defaultValue={new Date().toISOString().split('T')[0]} />
                        <div className="flex items-center gap-1">
                          <input type="time" name="startTime" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-600" title="Start Time" />
                          <span className="text-gray-400 text-sm">to</span>
                          <input type="time" name="endTime" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-600" title="End Time" />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                          Schedule Month
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {daysOfWeek.map((d, i) => (
                          <label key={i} className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50/50 has-[:checked]:text-indigo-800">
                            <input type="checkbox" name="days" value={i} defaultChecked={i === 1 || i === 3 || i === 5} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" /> 
                            <span className="font-medium">{d.substring(0,3)}</span>
                          </label>
                        ))}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Reschedule Requests */}
                {selectedTuition.sessions.some(s => s.rescheduleStatus === 'PENDING') && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h4 className="font-bold text-yellow-800 mb-3">Pending Reschedule Requests</h4>
                    <div className="space-y-3">
                      {selectedTuition.sessions.filter(s => s.rescheduleStatus === 'PENDING').map(session => (
                        <div key={session.id} className="bg-white p-3 rounded border border-yellow-100 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-sm font-medium">Original: {new Date(session.date).toLocaleString()}</p>
                            <p className="text-sm text-indigo-600 font-bold">Proposed: {session.rescheduleProposedTime ? new Date(session.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'} - {session.rescheduleProposedEndTime ? new Date(session.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                            <p className="text-xs text-gray-500 mt-1">Requested by: {session.rescheduleRequestedBy} | Reason: {session.rescheduleReason || "None"}</p>
                          </div>
                          <div className="flex gap-2">
                            <form action={handleRescheduleRequest.bind(null, session.id, 'APPROVE')}><button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm font-medium">Approve</button></form>
                            <form action={handleRescheduleRequest.bind(null, session.id, 'REJECT')}><button className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium">Reject</button></form>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timetable Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Day</th>
                        <th className="py-3 px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Date & Time</th>
                        <th className="py-3 px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Status & Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTuition.sessions.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-sm text-gray-500">No classes scheduled.</td></tr>
                      ) : (
                        selectedTuition.sessions.map((session, index) => (
                          <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4 text-sm font-semibold text-gray-700">{daysOfWeek[new Date(session.date).getDay()].substring(0,3)}</td>
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-between gap-4">
                                {session.classLink ? (
                                  <a href={session.classLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm truncate max-w-[150px] inline-flex items-center gap-1 font-medium"><svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> Class Link</a>
                                ) : <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Not set</span>}
                                
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide ${session.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : session.status === 'MISSED' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' : session.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' : 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-500/20'}`}>{session.status}</span>
                                  <form action={deleteSession.bind(null, session.id)} onSubmit={(e) => { if(!confirm("Are you sure you want to delete this scheduled day?")) e.preventDefault(); }}>
                                    <button type="submit" className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors" title="Delete Session">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
