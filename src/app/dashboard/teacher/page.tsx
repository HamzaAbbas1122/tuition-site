import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { addClassSession, markClassStatus, updateClassLink } from "./actions";

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
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {session.user.name}. Here is your schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule a new class */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Schedule a Class</h2>
          <form action={addClassSession} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Student/Tuition</label>
              <select name="tuitionId" className="w-full border-gray-300 rounded-md p-2 border" required>
                <option value="">Select...</option>
                {tuitions.map(t => <option key={t.id} value={t.id}>{t.student.name} ({t.subject})</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="date" required className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" required className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Link (Optional initially)</label>
              <input type="url" name="classLink" className="w-full border-gray-300 rounded-md p-2 border" placeholder="https://meet.google.com/..." />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium">Schedule</button>
          </form>
        </section>

        {/* My Students */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Students</h2>
          {tuitions.length === 0 ? <p className="text-sm text-gray-500">You have no assigned students yet.</p> : (
            <ul className="space-y-3">
              {tuitions.map(t => (
                <li key={t.id} className="p-3 border border-gray-100 rounded-lg flex justify-between items-center bg-gray-50">
                  <div>
                    <p className="font-semibold">{t.student.name}</p>
                    <p className="text-sm text-gray-600">{t.subject}</p>
                  </div>
                  <a href={`https://wa.me/${t.student.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100">Contact</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Class Schedule & Status Management */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Classes</h2>
        <div className="space-y-6">
          {tuitions.map(t => (
            <div key={t.id} className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-3">{t.student.name} - {t.subject}</h3>
              {t.sessions.length === 0 ? <p className="text-sm text-gray-500">No classes scheduled.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.sessions.map(s => (
                    <div key={s.id} className="border border-gray-100 bg-gray-50 p-4 rounded-lg flex flex-col gap-2 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{new Date(s.date).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Until {new Date(s.endTime).toLocaleTimeString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : s.status === 'MISSED' ? 'bg-red-100 text-red-700' : s.status === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{s.status}</span>
                      </div>
                      
                      {s.rescheduledTo && <p className="text-xs font-semibold text-indigo-600">Rescheduled to: {new Date(s.rescheduledTo).toLocaleString()}</p>}

                      <div className="mt-2">
                        <form action={async (formData) => { "use server"; await updateClassLink(s.id, formData.get("link") as string) }} className="flex gap-2">
                          <input type="url" name="link" defaultValue={s.classLink || ""} placeholder="Class link" className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" />
                          <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium">Save</button>
                        </form>
                      </div>

                      {s.classLink && <a href={s.classLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs block mt-1">Join Class</a>}

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                        <form action={markClassStatus.bind(null, s.id, "COMPLETED")} className="flex-1"><button className="w-full text-xs bg-green-50 text-green-700 px-2 py-1.5 rounded hover:bg-green-100">Mark Completed</button></form>
                        <form action={markClassStatus.bind(null, s.id, "MISSED")} className="flex-1"><button className="w-full text-xs bg-red-50 text-red-700 px-2 py-1.5 rounded hover:bg-red-100">Mark Missed</button></form>
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
