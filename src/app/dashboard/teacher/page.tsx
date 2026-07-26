import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requestReschedule, markClassStatus, updateClassLink } from "./actions";

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
                  <a 
                    href={`https://wa.me/${t.student.phone?.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-all"
                  >
                    WhatsApp
                  </a>
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
          ) : tuitions.map(t => (
            <div key={t.id} className="border border-slate-200/80 rounded-2xl p-6 bg-white/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.student.name} <span className="text-blue-600 font-bold ml-1.5">• {t.subject}</span>
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {t.sessions.length} Session{t.sessions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {t.sessions.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No sessions scheduled for this student.</p>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {t.sessions.map(s => (
                    <div key={s.id} className="w-[300px] sm:w-[320px] shrink-0 snap-start border border-slate-200/80 bg-slate-50/70 p-4.5 rounded-xl flex flex-col justify-between gap-3 relative shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{new Date(s.date).toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Until {new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'MISSED' ? 'bg-red-50 text-red-700 border-red-200' : s.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {s.status}
                        </span>
                      </div>
                      
                      {s.rescheduleStatus === 'PENDING' ? (
                        <div className="mt-1 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                          <p className="text-xs text-amber-900 font-semibold">Reschedule requested: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''} - {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                          <p className="text-xs text-amber-700 mt-0.5">Pending admin approval.</p>
                        </div>
                      ) : (
                        <details className="group border-t border-slate-200/60 pt-2 mt-1 text-right">
                          <summary className="cursor-pointer text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1.5 select-none bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 hover:bg-amber-100 transition-all">
                            <span>Request Reschedule</span>
                            <svg className="w-3 h-3 transition-transform group-open:rotate-180 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <form action={requestReschedule.bind(null, s.id)} className="flex flex-col gap-2 items-end mt-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                            <div className="flex gap-1.5 items-center max-w-[250px] w-full">
                              <input type="time" name="startTime" required className="glass-input rounded-lg px-2 py-1 text-xs w-full" title="Start Time" />
                              <span className="text-slate-400 text-xs font-medium">to</span>
                              <input type="time" name="endTime" required className="glass-input rounded-lg px-2 py-1 text-xs w-full" title="End Time" />
                            </div>
                            <input type="text" name="reason" placeholder="Reason (optional)" className="glass-input rounded-lg px-2 py-1 text-xs w-full max-w-[250px]" />
                            <button className="bg-amber-600 text-white hover:bg-amber-700 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs">Submit Request</button>
                          </form>
                        </details>
                      )}

                      <div className="mt-1">
                        <label className="block text-xs font-bold text-slate-600 mb-1">Class Link</label>
                        <form action={async (formData) => { "use server"; await updateClassLink(s.id, formData.get("link") as string) }} className="flex gap-2">
                          <input type="url" name="link" defaultValue={s.classLink || ""} placeholder="https://meet.google.com/..." className="flex-1 glass-input rounded-lg px-2.5 py-1 text-xs" />
                          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold shadow-xs">Save</button>
                        </form>
                      </div>

                      {s.classLink && (
                        <a href={s.classLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-semibold inline-flex items-center gap-1 mt-0.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          Join Meeting
                        </a>
                      )}

                      <div className="flex gap-2 mt-2 pt-2.5 border-t border-slate-200/80">
                        <form action={markClassStatus.bind(null, s.id, "COMPLETED")} className="flex-1">
                          <button className="w-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-emerald-100 transition-all">
                            Mark Completed
                          </button>
                        </form>
                        <form action={markClassStatus.bind(null, s.id, "MISSED")} className="flex-1">
                          <button className="w-full text-xs font-semibold bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-all">
                            Mark Missed
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

