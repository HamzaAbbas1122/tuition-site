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

      {/* Global Easypaisa Payment Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 shadow-xs space-y-3.5 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-emerald-200 flex items-center justify-center shrink-0">
            <img src="/easypaisa.png" alt="Easypaisa Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              Easypaisa Payment
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">Official</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">Send all tuition fees directly via Easypaisa App</p>
          </div>
        </div>

        <div className="bg-white/90 p-4 rounded-xl border border-emerald-100 space-y-2.5 text-xs shadow-2xs">
          {easypaisaName && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Account Title:</span>
              <span className="font-extrabold text-slate-900 text-sm">{easypaisaName}</span>
            </div>
          )}
          {easypaisaNumber && (
            <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
              <span className="text-slate-500 font-medium">Easypaisa Number:</span>
              <span className="font-black text-emerald-700 text-sm tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-mono select-all">
                {easypaisaNumber}
              </span>
            </div>
          )}
          {!easypaisaName && !easypaisaNumber && (
            <p className="text-emerald-700 font-medium text-center py-2">
              Please contact admin for payment details.
            </p>
          )}
        </div>
      </div>

      {tuitions.length === 0 ? (
        <div className="glass-card p-6 sm:p-10 rounded-2xl text-center">
          <p className="text-slate-500 text-sm font-medium">You don't have any active classes assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tuitions.map(t => {
            const attended = t.sessions.filter(s => s.status === "COMPLETED").length;
            const missed = t.sessions.filter(s => s.status === "MISSED").length;
            const upcoming = t.sessions.filter(s => s.status === "SCHEDULED" || s.status === "RESCHEDULED" || s.status === "PENDING").length;

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
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 text-xs w-full sm:w-auto">
                    <div className="text-center px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="block font-bold text-emerald-700 text-xl">{attended}</span>
                      <span className="text-emerald-600 font-medium">Attended</span>
                    </div>
                    <div className="text-center px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                      <span className="block font-bold text-red-700 text-xl">{missed}</span>
                      <span className="text-red-600 font-medium">Missed</span>
                    </div>
                    <div className="text-center px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="block font-bold text-blue-700 text-xl">{upcoming}</span>
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
                      <div className="border border-slate-200/80 rounded-xl overflow-auto bg-white/90 shadow-xs max-h-96">
                        <table className="w-full text-left border-collapse min-w-[400px]">
                          <thead className="bg-slate-50/90 border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                              <th className="py-3 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Day & Time</th>
                              <th className="py-3 px-4 text-xs font-bold tracking-wider text-slate-600 uppercase">Status & Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {t.sessions.map(s => {
                              const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                              return (
                                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                                  <td className="py-3 px-4 align-top">
                                    <div className="font-bold text-slate-900 text-sm">
                                      {daysOfWeek[new Date(s.date).getDay()].substring(0,3)}, {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    
                                    {s.status === "SCHEDULED" && (
                                      s.rescheduleStatus === 'PENDING' ? (
                                        <div className="mt-2.5 p-2 bg-amber-50 rounded-md border border-amber-200 w-fit">
                                          <p className="text-[10px] text-amber-900 font-semibold">Reschedule requested: {s.rescheduleProposedTime ? new Date(s.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''} - {s.rescheduleProposedEndTime ? new Date(s.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                                          <p className="text-[10px] text-amber-700">Pending admin approval.</p>
                                        </div>
                                      ) : (
                                        <details className="group mt-2">
                                          <summary className="cursor-pointer text-[11px] font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1 select-none transition-colors">
                                            <span>Request Reschedule</span>
                                            <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                          </summary>
                                          <form action={requestReschedule.bind(null, s.id)} className="flex flex-col gap-1.5 mt-1.5 bg-amber-50/50 p-2 rounded-lg border border-amber-200/60 w-fit">
                                            <div className="flex gap-1 items-center">
                                              <input type="time" name="startTime" required className="glass-input rounded-md px-1.5 py-1 text-[10px] w-[80px]" title="Start Time" />
                                              <span className="text-slate-400 text-[10px] font-medium">to</span>
                                              <input type="time" name="endTime" required className="glass-input rounded-md px-1.5 py-1 text-[10px] w-[80px]" title="End Time" />
                                            </div>
                                            <input type="text" name="reason" placeholder="Reason (optional)" className="glass-input rounded-md px-1.5 py-1 text-[10px] w-full" />
                                            <button className="bg-amber-600 text-white hover:bg-amber-700 px-2 py-1 rounded-md text-[10px] font-semibold transition-all shadow-xs self-end">Submit</button>
                                          </form>
                                        </details>
                                      )
                                    )}
                                  </td>
                                  <td className="py-3 px-4 align-top">
                                    <div className="flex flex-col items-start gap-2">
                                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s.status === 'MISSED' ? 'bg-red-50 text-red-700 border-red-200' : s.status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {s.status}
                                      </span>
                                      {s.classLink && s.status !== "COMPLETED" && s.status !== "MISSED" && (
                                        <a href={s.classLink} target="_blank" rel="noreferrer" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm flex items-center gap-1.5">
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                          Join
                                        </a>
                                      )}
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

                  {/* Payments */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      Payments Overview
                    </h3>
                    {t.payments.length === 0 ? <p className="text-sm text-slate-500 mb-4">No active invoice records found.</p> : (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-5">
                        {t.payments.map(p => (
                          <li key={p.id} className="p-4 border border-slate-200/80 rounded-xl bg-white/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
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

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}


