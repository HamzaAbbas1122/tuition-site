import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requestReschedule } from "./actions";

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

  // Calculate statistics for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return (
    <div className="space-y-10">
      <div className="border-b border-blue-100/80 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Student <span className="blue-glow-text">Dashboard</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">Welcome back, <span className="text-slate-900 font-bold">{session.user.name}</span>.</p>
      </div>

      {tuitions.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center">
          <p className="text-slate-500 text-sm font-medium">You don't have any active classes assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tuitions.map(t => {
            const monthlySessions = t.sessions.filter(s => new Date(s.date) >= startOfMonth && new Date(s.date) <= endOfMonth);
            const attended = monthlySessions.filter(s => s.status === "COMPLETED").length;
            const missed = monthlySessions.filter(s => s.status === "MISSED").length;
            const pending = monthlySessions.filter(s => s.status === "SCHEDULED" || s.status === "PENDING" || s.status === "RESCHEDULED").length;

            return (
              <div key={t.id} className="glass-card glass-card-hover p-4 sm:p-7 rounded-2xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-wide inline-flex items-center gap-2.5">
                      {t.subject}
                      {(t as any).grade && <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{(t as any).grade}</span>}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">Instructor: <span className="text-blue-600 font-bold">{t.teacher.name}</span></p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="text-center px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="block font-bold text-emerald-700 text-xl">{attended}</span>
                      <span className="text-emerald-600 font-medium">Attended</span>
                    </div>
                    <div className="text-center px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                      <span className="block font-bold text-red-700 text-xl">{missed}</span>
                      <span className="text-red-600 font-medium">Missed</span>
                    </div>
                    <div className="text-center px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="block font-bold text-blue-700 text-xl">{pending}</span>
                      <span className="text-blue-600 font-medium">Upcoming</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Class Schedule */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Your Classes
                    </h3>
                    {t.sessions.length === 0 ? <p className="text-sm text-slate-500">No classes scheduled.</p> : (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {t.sessions.map(s => (
                          <li key={s.id} className="p-4 border border-slate-200/80 rounded-xl bg-white/90 shadow-xs flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{new Date(s.date).toLocaleString()}</p>
                                <div className="mt-2">
                                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'MISSED' ? 'bg-red-50 text-red-700 border-red-200' : s.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{s.status}</span>
                                </div>
                              </div>
                              {s.classLink && s.status !== "COMPLETED" && s.status !== "MISSED" && (
                                <a href={s.classLink} target="_blank" rel="noreferrer" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/20 block text-center">
                                  Join Class
                                </a>
                              )}
                            </div>
                            {s.status === "SCHEDULED" && (
                              s.rescheduleStatus === 'PENDING' ? (
                                <div className="mt-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-right">
                                  <p className="text-xs text-amber-900 font-semibold">Reschedule requested: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''} - {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                                  <p className="text-xs text-amber-700 mt-0.5">Pending admin approval.</p>
                                </div>
                              ) : (
                                <div className="mt-2 text-right border-t border-slate-100 pt-3">
                                  <p className="text-xs font-bold mb-2 text-slate-500">Request Reschedule (Same Day)</p>
                                  <form action={requestReschedule.bind(null, s.id)} className="flex flex-col gap-2 items-end">
                                    <div className="flex gap-1.5 items-center max-w-[260px] w-full">
                                      <input type="time" name="startTime" required className="glass-input rounded-lg px-2.5 py-1 text-xs w-full" title="Start Time" />
                                      <span className="text-slate-400 text-xs">to</span>
                                      <input type="time" name="endTime" required className="glass-input rounded-lg px-2.5 py-1 text-xs w-full" title="End Time" />
                                    </div>
                                    <input type="text" name="reason" placeholder="Reason (optional)" className="glass-input rounded-lg px-2.5 py-1 text-xs w-full max-w-[260px]" />
                                    <button className="bg-amber-100 border border-amber-200 text-amber-800 hover:bg-amber-200 px-3.5 py-1 rounded-lg text-xs font-semibold transition-all">Submit Request</button>
                                  </form>
                                </div>
                              )
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Payments */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      Payments Overview
                    </h3>
                    {t.payments.length === 0 ? <p className="text-sm text-slate-500">No payment records found.</p> : (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {t.payments.map(p => (
                          <li key={p.id} className="p-4 border border-slate-200/80 rounded-xl bg-white/90 shadow-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 text-base">${p.amount}</p>
                              <p className="text-xs text-slate-500 mt-0.5">Due Date: {new Date(p.dueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-lg font-semibold border ${p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {p.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


