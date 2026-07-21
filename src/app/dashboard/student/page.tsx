import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {session.user.name}.</p>
      </div>

      {tuitions.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">You don't have any active classes yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tuitions.map(t => {
            const monthlySessions = t.sessions.filter(s => new Date(s.date) >= startOfMonth && new Date(s.date) <= endOfMonth);
            const attended = monthlySessions.filter(s => s.status === "COMPLETED").length;
            const missed = monthlySessions.filter(s => s.status === "MISSED").length;
            const pending = monthlySessions.filter(s => s.status === "SCHEDULED" || s.status === "PENDING" || s.status === "RESCHEDULED").length;

            return (
              <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.subject}</h2>
                    <p className="text-gray-600">Teacher: {t.teacher.name}</p>
                  </div>
                  <div className="flex gap-4 mt-4 md:mt-0 text-sm">
                    <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                      <span className="block font-bold text-green-700 text-xl">{attended}</span>
                      <span className="text-green-600">Attended</span>
                    </div>
                    <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                      <span className="block font-bold text-red-700 text-xl">{missed}</span>
                      <span className="text-red-600">Missed</span>
                    </div>
                    <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                      <span className="block font-bold text-blue-700 text-xl">{pending}</span>
                      <span className="text-blue-600">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Class Schedule */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Your Classes</h3>
                    {t.sessions.length === 0 ? <p className="text-sm text-gray-500">No classes scheduled.</p> : (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {t.sessions.map(s => (
                          <li key={s.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{new Date(s.date).toLocaleString()}</p>
                              {s.rescheduledTo && <p className="text-xs font-semibold text-indigo-600 mt-1">Rescheduled: {new Date(s.rescheduledTo).toLocaleString()}</p>}
                              <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : s.status === 'MISSED' ? 'bg-red-100 text-red-700' : s.status === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{s.status}</span>
                              </div>
                            </div>
                            {s.classLink && s.status !== "COMPLETED" && s.status !== "MISSED" && (
                              <a href={s.classLink} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                Join Class
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Payments */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Payments</h3>
                    {t.payments.length === 0 ? <p className="text-sm text-gray-500">No payment records found.</p> : (
                      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {t.payments.map(p => (
                          <li key={p.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">${p.amount}</p>
                              <p className="text-sm text-gray-500">Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
