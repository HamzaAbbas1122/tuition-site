import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { acceptStudentApp, rejectStudentApp, acceptTeacherApp, rejectTeacherApp, createTuitionClass, togglePaymentStatus, rescheduleClass } from "./actions";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const studentApps = await prisma.studentApplication.findMany({ where: { status: "PENDING" } });
  const teacherApps = await prisma.teacherApplication.findMany({ where: { status: "PENDING" } });
  
  const teachers = await prisma.user.findMany({ where: { role: "TEACHER" } });
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  
  const tuitions = await prisma.tuitionClass.findMany({
    include: {
      teacher: true,
      student: true,
      sessions: true,
      payments: true,
    },
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage applications, classes, and payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Applications */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Student Apps</h2>
          {studentApps.length === 0 ? <p className="text-sm text-gray-500">No pending student applications.</p> : (
            <div className="space-y-4">
              {studentApps.map(app => (
                <div key={app.id} className="border border-gray-100 p-4 rounded-xl flex flex-col gap-3 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{app.studentName} <span className="text-sm text-gray-500">(Parent: {app.parentName})</span></p>
                    <p className="text-sm text-gray-600">Subject: {app.subject}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <a href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100">WhatsApp</a>
                    <form action={acceptStudentApp.bind(null, app.id)}><button className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100">Accept</button></form>
                    <form action={rejectStudentApp.bind(null, app.id)}><button className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full hover:bg-red-100">Reject</button></form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Teacher Applications */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Teacher Apps</h2>
          {teacherApps.length === 0 ? <p className="text-sm text-gray-500">No pending teacher applications.</p> : (
            <div className="space-y-4">
              {teacherApps.map(app => (
                <div key={app.id} className="border border-gray-100 p-4 rounded-xl flex flex-col gap-3 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-600">Subjects: {app.subjects}</p>
                    <p className="text-sm text-gray-600">Email: {app.email}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <a href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100">WhatsApp</a>
                    <form action={acceptTeacherApp.bind(null, app.id)}><button className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100">Accept</button></form>
                    <form action={rejectTeacherApp.bind(null, app.id)}><button className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full hover:bg-red-100">Reject</button></form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Assign Tuitions */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Tuition Class</h2>
        <form action={createTuitionClass} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select name="teacherId" className="w-full border-gray-300 rounded-md p-2 border" required>
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select name="studentId" className="w-full border-gray-300 rounded-md p-2 border" required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" name="subject" className="w-full border-gray-300 rounded-md p-2 border" required />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium">Create</button>
        </form>
      </section>

      {/* Active Tuitions */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Tuitions & Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">Subject</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Teacher</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Student</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Payments</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Classes</th>
              </tr>
            </thead>
            <tbody>
              {tuitions.length === 0 ? (
                <tr><td colSpan={5} className="py-4 px-4 text-center text-gray-500">No tuitions created yet.</td></tr>
              ) : tuitions.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{t.subject}</td>
                  <td className="py-3 px-4 text-gray-600">{t.teacher.name}</td>
                  <td className="py-3 px-4 text-gray-600">{t.student.name}</td>
                  <td className="py-3 px-4">
                    {t.payments.length === 0 ? <span className="text-gray-400 text-sm">No payments</span> : (
                      <div className="flex flex-col gap-1 text-sm">
                        {t.payments.map(p => (
                          <div key={p.id} className="flex items-center gap-2">
                            <span className={p.status === "PAID" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>${p.amount} - {p.status}</span>
                            <form action={togglePaymentStatus.bind(null, p.id, p.status)}>
                              <button className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded">Toggle</button>
                            </form>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                     {t.sessions.length === 0 ? <span className="text-gray-400 text-sm">No classes</span> : (
                      <div className="flex flex-col gap-2 text-sm max-h-40 overflow-y-auto">
                        {t.sessions.map(s => (
                          <div key={s.id} className="border border-gray-200 p-2 rounded">
                            <span className="font-semibold block">{new Date(s.date).toLocaleDateString()} - {s.status}</span>
                            {s.status === "MISSED" && (
                              <form action={async (formData) => {
                                "use server";
                                const newDate = formData.get("newDate") as string;
                                await rescheduleClass(s.id, newDate);
                              }} className="flex gap-2 mt-1">
                                <input type="datetime-local" name="newDate" required className="border border-gray-300 rounded px-1 py-0.5 text-xs" />
                                <button type="submit" className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded hover:bg-indigo-200 text-xs">Reschedule</button>
                              </form>
                            )}
                            {s.rescheduledTo && <div className="text-indigo-600 mt-1">Rescheduled to: {new Date(s.rescheduledTo).toLocaleString()}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
