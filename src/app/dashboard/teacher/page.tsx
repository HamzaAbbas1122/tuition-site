import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requestReschedule, markClassStatus, updateClassLink } from "./actions";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "TEACHER") {
    redirect("/");
  }

  // Auto-miss classes that have passed their end time
  await prisma.classSession.updateMany({
    where: {
      endTime: { lt: new Date() },
      status: "SCHEDULED",
    },
    data: { status: "MISSED" },
  });

  const tuitions = await prisma.tuitionClass.findMany({
    where: { teacherId: session.user.id },
    include: {
      student: true,
      sessions: {
        orderBy: { date: 'asc' }
      }
    }
  });

  return (
    <div className="space-y-10">
      <div className="border-b border-blue-100/80 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Teacher <span className="blue-glow-text">Dashboard</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Welcome back, <span className="text-slate-900 font-bold">{session.user.name}</span>. Here is your teaching schedule and student manager.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* My Students */}
        <section className="glass-card glass-card-hover p-4 sm:p-7 rounded-2xl">
          <div className="flex items-center space-x-3 mb-6 border-b border-slate-200/70 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 font-bold text-sm shadow-xs">
              👨‍🎓
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">My Students</h2>
          </div>
          {tuitions.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">You have no assigned students yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tuitions.map(t => (
                <li key={t.id} className="p-4 border border-slate-200/80 rounded-xl flex justify-between items-center bg-white/90 shadow-xs hover:border-blue-300 transition-all">
                  <div>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {t.student.name}
                      {(t as any).grade && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{(t as any).grade}</span>}
                    </p>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{t.subject}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Class Schedule & Status Management */}
      <section className="glass-card p-4 sm:p-7 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-200/70 pb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-xs">
            📅
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-wide">Your Classes & Schedule</h2>
        </div>

        <div className="space-y-6">
          {tuitions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No active classes found.</p>
          ) : tuitions.map(t => {
            const attended = t.sessions.filter(s => s.status === "COMPLETED").length;
            const missed = t.sessions.filter(s => s.status === "MISSED").length;
            const upcoming = t.sessions.filter(s => s.status === "SCHEDULED" || s.status === "RESCHEDULED" || s.status === "PENDING").length;

            return (
              <div key={t.id} className="border border-slate-200/80 rounded-2xl p-6 bg-white/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      {t.student.name}
                      {(t as any).grade && <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{(t as any).grade}</span>}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">{t.subject}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-1.5">
                      <span className="font-extrabold text-emerald-700 text-sm">{attended}</span>
                      <span className="text-emerald-600 font-medium">Completed</span>
                    </div>
                    <div className="px-3 py-1.5 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-1.5">
                      <span className="font-extrabold text-red-700 text-sm">{missed}</span>
                      <span className="text-red-600 font-medium">Missed</span>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl flex items-center gap-1.5">
                      <span className="font-extrabold text-blue-700 text-sm">{upcoming}</span>
                      <span className="text-blue-600 font-medium">Upcoming</span>
                    </div>
                  </div>
                </div>

              {t.sessions.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No sessions scheduled for this student.</p>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-auto bg-white/80 shadow-xs max-h-[550px]">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50/90 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Day</th>
                        <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Date & Time</th>
                        <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Status & Link</th>
                        <th className="py-3.5 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {t.sessions.map(s => {
                        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        return (
                          <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-3.5 px-4 text-xs font-bold text-blue-600 align-top pt-5">{daysOfWeek[new Date(s.date).getDay()].substring(0,3)}</td>
                            <td className="py-3.5 px-4 align-top pt-5">
                              <div className="text-sm font-semibold text-slate-900">
                                {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              
                              {/* Reschedule Details */}
                              {s.rescheduleStatus === 'PENDING' ? (
                                <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 inline-block w-fit">
                                  <p className="text-xs text-amber-900 font-semibold">Reschedule requested: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''} - {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                                  <p className="text-xs text-amber-700 mt-0.5">Pending admin approval.</p>
                                </div>
                              ) : (
                                <details className="group mt-3">
                                  <summary className="cursor-pointer text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1.5 select-none transition-colors">
                                    <span>Request Reschedule</span>
                                    <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </summary>
                                  <form action={requestReschedule.bind(null, s.id)} className="flex flex-col gap-2 mt-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 w-fit">
                                    <div className="flex gap-1.5 items-center">
                                      <input type="time" name="startTime" required className="glass-input rounded-lg px-2 py-1 text-xs w-[100px]" title="Start Time" />
                                      <span className="text-slate-400 text-xs font-medium">to</span>
                                      <input type="time" name="endTime" required className="glass-input rounded-lg px-2 py-1 text-xs w-[100px]" title="End Time" />
                                    </div>
                                    <input type="text" name="reason" placeholder="Reason (optional)" className="glass-input rounded-lg px-2 py-1 text-xs w-full" />
                                    <button className="bg-amber-600 text-white hover:bg-amber-700 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs self-end">Submit Request</button>
                                  </form>
                                </details>
                              )}
                            </td>
                            <td className="py-3.5 px-4 align-top pt-5">
                              <div className="flex flex-col items-start gap-2.5">
                                <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'MISSED' ? 'bg-red-50 text-red-700 border-red-200' : s.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                  {s.status}
                                </span>
                                <div className="mt-1 w-full max-w-[180px]">
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Class Link</label>
                                  <form action={async (formData) => { "use server"; await updateClassLink(s.id, formData.get("link") as string) }} className="flex gap-1">
                                    <input type="url" name="link" defaultValue={s.classLink || ""} placeholder="Link..." className="flex-1 glass-input rounded-md px-2 py-1 text-[11px]" />
                                    <button className="bg-slate-800 text-white hover:bg-slate-700 px-2 py-1 rounded-md text-[11px] font-semibold">Save</button>
                                  </form>
                                </div>
                                {s.classLink && (
                                  <a href={s.classLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-semibold inline-flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    Join Class
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 align-top pt-5">
                              <div className="flex flex-col gap-1.5 w-[120px]">
                                <form action={markClassStatus.bind(null, s.id, "COMPLETED")}>
                                  <button className="w-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-emerald-100 transition-all">
                                    Mark Completed
                                  </button>
                                </form>
                                <form action={markClassStatus.bind(null, s.id, "MISSED")}>
                                  <button className="w-full text-xs font-semibold bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-all">
                                    Mark Missed
                                  </button>
                                </form>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </section>

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}

