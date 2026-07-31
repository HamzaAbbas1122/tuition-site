import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requestReschedule } from "./actions";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STUDENT") {
    redirect("/");
  }

  const tuitions = await prisma.tuitionClass.findMany({
    where: { studentId: session.user.id },
    include: {
      teacher: true,
      sessions: {
        orderBy: { date: 'asc' }
      },
      payments: true,
    }
  });

  const easypaisaName = process.env.EASYPAISA_NAME || "";
  const easypaisaNumber = process.env.EASYPAISA_NUMBER || "";

  const allSessions = tuitions.flatMap(t => t.sessions);
  const totalAttended = allSessions.filter(s => s.status === "COMPLETED").length;
  const totalMissed = allSessions.filter(s => s.status === "MISSED").length;
  const totalUpcoming = allSessions.filter(s => s.status === "SCHEDULED" || s.status === "RESCHEDULED" || s.status === "PENDING").length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {session.user.name}'s <span className="blue-glow-text">Dashboard</span>
          </h1>
        </div>
        {/* Global Stats */}
        <div className="flex gap-2 flex-wrap">
          <div className="text-center px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-emerald-700 text-xl">{totalAttended}</span>
            <span className="text-emerald-600 font-medium text-xs">Attended</span>
          </div>
          <div className="text-center px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-red-700 text-xl">{totalMissed}</span>
            <span className="text-red-600 font-medium text-xs">Missed</span>
          </div>
          <div className="text-center px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-blue-700 text-xl">{totalUpcoming}</span>
            <span className="text-blue-600 font-medium text-xs">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Easypaisa Payment Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4 max-w-2xl">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-sm border border-emerald-200 flex items-center justify-center shrink-0">
            <img src="/easypaisa.png" alt="Easypaisa Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              Pay via Easypaisa
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">Official</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Send your tuition fees directly via the Easypaisa App</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs sm:text-right shrink-0">
          {easypaisaName && (
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-slate-500 font-medium">Account:</span>
              <span className="font-extrabold text-slate-900">{easypaisaName}</span>
            </div>
          )}
          {easypaisaNumber && (
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-slate-500 font-medium">Number:</span>
              <span className="font-black text-emerald-700 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-mono select-all text-sm">
                {easypaisaNumber}
              </span>
            </div>
          )}
          {!easypaisaName && !easypaisaNumber && (
            <p className="text-emerald-700 font-medium">Contact admin for payment details.</p>
          )}
        </div>
      </div>

      {/* Classes */}
      {tuitions.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-500 text-sm font-medium">You don't have any active classes assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tuitions.map(t => {
            const attended = t.sessions.filter(s => s.status === "COMPLETED").length;
            const missed = t.sessions.filter(s => s.status === "MISSED").length;
            const upcoming = t.sessions.filter(s => s.status === "SCHEDULED" || s.status === "RESCHEDULED" || s.status === "PENDING").length;

            return (
              <section key={t.id} className="glass-card rounded-2xl overflow-hidden shadow-xs">
                {/* Class Header */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 bg-white/60">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                      {t.subject}
                      {(t as any).grade && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{(t as any).grade}</span>}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Instructor: <span className="text-blue-600 font-bold">{t.teacher.name}</span></p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">{attended} Attended</span>
                    <span className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">{missed} Missed</span>
                    <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700">{upcoming} Upcoming</span>
                  </div>
                </div>

                {/* Schedule Table */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Pending Reschedule Requests Widget */}
                  {(() => {
                    const pendingReschedules = t.sessions.filter(s => s.rescheduleStatus === 'PENDING');
                    if (pendingReschedules.length === 0) return null;
                    return (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
                        <div className="px-4 py-3 border-b border-amber-200/80 flex items-center gap-2">
                          <span className="text-base">⏳</span>
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Reschedule Requests</h4>
                          <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">{pendingReschedules.length}</span>
                        </div>
                        <ul className="divide-y divide-amber-100">
                          {pendingReschedules.map(s => (
                            <li key={s.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  Original: {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                                  Proposed: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''} · {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} – {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-1 rounded-lg shrink-0">Awaiting Admin</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {/* Schedule Table */}
                  {t.sessions.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No classes scheduled yet.</p>
                  ) : (
                    <div className="border border-slate-200/80 rounded-xl overflow-auto bg-white/90 shadow-xs max-h-96">
                      <table className="w-full text-left border-collapse min-w-[400px]">
                        <thead className="bg-slate-50/90 border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            <th className="py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Day & Date</th>
                            <th className="py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Status</th>
                            <th className="py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {t.sessions.map(s => {
                            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            return (
                              <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-3.5 px-4 align-top">
                                  <div className="font-bold text-slate-900 text-sm">
                                    {daysOfWeek[new Date(s.date).getDay()].substring(0, 3)}, {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>

                                  {s.status === "SCHEDULED" && (
                                    s.rescheduleStatus === 'PENDING' ? (
                                      <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200 w-fit">
                                        <p className="text-[10px] text-amber-900 font-semibold">Reschedule pending: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} – {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                                        <p className="text-[10px] text-amber-600 mt-0.5">Awaiting admin approval.</p>
                                      </div>
                                    ) : (
                                      <details className="group mt-2">
                                        <summary className="cursor-pointer text-[11px] font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 select-none transition-colors">
                                          <span>Request Reschedule</span>
                                          <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </summary>
                                        <form action={requestReschedule.bind(null, s.id)} className="flex flex-col gap-1.5 mt-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 w-fit">
                                          <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">New Date (same month)</label>
                                            <input
                                              type="date"
                                              name="date"
                                              required
                                              min={new Date(s.date).toISOString().slice(0, 8) + '01'}
                                              max={new Date(new Date(s.date).getFullYear(), new Date(s.date).getMonth() + 1, 0).toISOString().slice(0, 10)}
                                              className="glass-input rounded-md px-2 py-1 text-[10px] w-full"
                                            />
                                          </div>
                                          <div className="flex gap-1.5 items-center">
                                            <input type="time" name="startTime" required className="glass-input rounded-md px-2 py-1 text-[10px] w-[85px]" title="Start Time" />
                                            <span className="text-slate-400 text-[10px]">to</span>
                                            <input type="time" name="endTime" required className="glass-input rounded-md px-2 py-1 text-[10px] w-[85px]" title="End Time" />
                                          </div>
                                          <input type="text" name="reason" placeholder="Reason (optional)" className="glass-input rounded-md px-2 py-1 text-[10px] w-full" />
                                          <button className="bg-amber-600 text-white hover:bg-amber-700 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all self-end">Submit</button>
                                        </form>
                                      </details>
                                    )
                                  )}
                                </td>
                                <td className="py-3.5 px-4 align-top">
                                  <span className={`text-[11px] px-2.5 py-1 rounded-md font-bold border ${s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'MISSED' ? 'bg-red-50 text-red-700 border-red-200' : s.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                    {s.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 align-top">
                                  {s.classLink && s.status !== "COMPLETED" && s.status !== "MISSED" ? (
                                    <a href={s.classLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                      Join Class
                                    </a>
                                  ) : s.status === "SCHEDULED" && !s.classLink ? (
                                    <span className="text-[11px] text-slate-400 italic">Link pending</span>
                                  ) : null}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}
