import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { acceptStudentApp, rejectStudentApp, acceptTeacherApp, rejectTeacherApp, createTuitionClass, togglePaymentStatus, rescheduleClass, deleteUser, handleRescheduleRequest } from "./actions";
import TimetableManager from "./TimetableManager";
import DeleteButton from "./DeleteButton";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const studentApps = await prisma.studentApplication.findMany({ where: { status: "PENDING" } });
  const teacherApps = await prisma.teacherApplication.findMany({ where: { status: "PENDING" } });
  
  const teachers = await prisma.user.findMany({ where: { role: "TEACHER" } });
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  
  const pendingReschedules = await prisma.classSession.findMany({
    where: { rescheduleStatus: "PENDING" },
    include: {
      tuition: {
        include: {
          teacher: true,
          student: true
        }
      }
    },
    orderBy: { date: 'asc' }
  });
  
  const tuitions = await prisma.tuitionClass.findMany({
    include: {
      teacher: true,
      student: true,
      sessions: true,
      payments: true,
    },
  });

  const teachersWithClasses = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: {
      teacherProfile: true,
      teacherClasses: {
        include: {
          student: true,
          sessions: {
            orderBy: { date: 'asc' }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage applications, classes, and payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Applications */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Student Apps</h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{studentApps.length}</span>
          </div>
          {studentApps.length === 0 ? <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">No pending student applications</div> : (
            <div className="space-y-4">
              {studentApps.map(app => (
                <div key={app.id} className="border border-gray-100 p-5 rounded-xl flex flex-col gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{app.studentName}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-500">Parent:</span> {app.parentName}</p>
                      <p><span className="font-medium text-gray-500">Subject:</span> {app.subject}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center pt-2 border-t border-gray-100/60">
                    <a href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-medium bg-green-50 text-green-700 px-4 py-1.5 rounded-lg hover:bg-green-100 transition-colors">WhatsApp</a>
                    <form action={acceptStudentApp.bind(null, app.id)} className="flex-1"><button className="w-full text-xs font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Accept</button></form>
                    <form action={rejectStudentApp.bind(null, app.id)} className="flex-1"><button className="w-full text-xs font-medium bg-white border border-gray-200 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors">Reject</button></form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Teacher Applications */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Teacher Apps</h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{teacherApps.length}</span>
          </div>
          {teacherApps.length === 0 ? <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">No pending teacher applications</div> : (
            <div className="space-y-4">
              {teacherApps.map(app => (
                <div key={app.id} className="border border-gray-100 p-5 rounded-xl flex flex-col gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{app.name}</p>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2 text-sm text-gray-600">
                      <p className="col-span-2"><span className="font-medium text-gray-500">Subjects:</span> {app.subjects}</p>
                      <p className="col-span-2"><span className="font-medium text-gray-500">Email:</span> {app.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center pt-2 border-t border-gray-100/60">
                    <a href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-medium bg-green-50 text-green-700 px-4 py-1.5 rounded-lg hover:bg-green-100 transition-colors">WhatsApp</a>
                    <form action={acceptTeacherApp.bind(null, app.id)} className="flex-1"><button className="w-full text-xs font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Accept</button></form>
                    <form action={rejectTeacherApp.bind(null, app.id)} className="flex-1"><button className="w-full text-xs font-medium bg-white border border-gray-200 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors">Reject</button></form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Pending Reschedules */}
      {pendingReschedules.length > 0 && (
        <section className="bg-yellow-50/50 p-8 rounded-2xl shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-yellow-900">Pending Reschedule Requests</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{pendingReschedules.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingReschedules.map(session => (
              <div key={session.id} className="bg-white border border-yellow-200 p-5 rounded-xl flex flex-col gap-4 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{session.tuition.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">Teacher: <span className="font-medium">{session.tuition.teacher.name}</span></p>
                  <p className="text-sm text-gray-600">Student: <span className="font-medium">{session.tuition.student.name}</span></p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1.5">
                  <p className="text-xs text-gray-500">Original Time: <span className="font-medium text-gray-800">{new Date(session.date).toLocaleString()}</span></p>
                  <p className="text-xs text-indigo-600 font-bold">Proposed Time: {session.rescheduleProposedTime ? new Date(session.rescheduleProposedTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'} - {session.rescheduleProposedEndTime ? new Date(session.rescheduleProposedEndTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}</p>
                  <p className="text-xs text-gray-500">Reason: {session.rescheduleReason || "None provided"}</p>
                  <p className="text-xs text-gray-500">Requested by: <span className="capitalize">{session.rescheduleRequestedBy?.toLowerCase()}</span></p>
                </div>
                <div className="flex gap-2 items-center pt-2 border-t border-gray-100">
                  <form action={handleRescheduleRequest.bind(null, session.id, 'APPROVE')} className="flex-1"><button className="w-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Approve</button></form>
                  <form action={handleRescheduleRequest.bind(null, session.id, 'REJECT')} className="flex-1"><button className="w-full text-xs font-medium bg-white border border-gray-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors">Reject</button></form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {/* Teacher Timetables & Scheduling */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Teacher Timetables & Scheduling</h2>
        <TimetableManager teachers={teachersWithClasses} />
      </section>

      {/* Active Tuitions & Payments */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Overview</h2>
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">Subject</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">Student</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">Payments</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wider text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tuitions.length === 0 ? (
                <tr><td colSpan={4} className="py-8 px-6 text-center text-sm text-gray-500">No tuitions created yet.</td></tr>
              ) : tuitions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{t.subject}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium">{t.student.name}</td>
                  <td className="py-4 px-6">
                    {t.payments.length === 0 ? <span className="text-gray-400 text-xs tracking-wider uppercase font-medium">No payments</span> : (
                      <div className="flex flex-col gap-2 text-sm">
                        {t.payments.map(p => (
                          <div key={p.id} className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-md font-semibold tracking-wide text-xs ${p.status === "PAID" ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}>
                              ${p.amount} • {p.status}
                            </span>
                            <form action={togglePaymentStatus.bind(null, p.id, p.status)}>
                              <button className="text-xs font-medium text-gray-500 hover:text-indigo-600 hover:underline transition-colors">Toggle</button>
                            </form>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DeleteButton 
                      action={deleteUser.bind(null, t.student.id)} 
                      confirmMessage="Are you sure you want to delete this student? All their classes and payments will be deleted permanently."
                    >
                      Delete Student
                    </DeleteButton>
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
