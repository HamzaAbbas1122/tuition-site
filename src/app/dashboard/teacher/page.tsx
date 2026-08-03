import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import TeacherScheduleView from "./TeacherScheduleView";

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
        orderBy: { date: "asc" }
      },
      payments: true,
    }
  });

  const allSessions = tuitions.flatMap(t => t.sessions);
  const totalCompleted = allSessions.filter(s => s.status === "COMPLETED").length;
  const totalMissed = allSessions.filter(s => s.status === "MISSED").length;
  const totalUpcoming = allSessions.filter(s => ["SCHEDULED", "RESCHEDULED", "PENDING"].includes(s.status)).length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {session.user.name}'s <span className="blue-glow-text">Dashboard</span>
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="text-center px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-emerald-700 text-xl">{totalCompleted}</span>
            <span className="text-emerald-600 font-medium text-xs">Completed</span>
          </div>
          <div className="text-center px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-red-700 text-xl">{totalMissed}</span>
            <span className="text-red-600 font-medium text-xs">Missed</span>
          </div>
          <div className="text-center px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-blue-700 text-xl">{totalUpcoming}</span>
            <span className="text-blue-600 font-medium text-xs">Upcoming</span>
          </div>
          <div className="text-center px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl min-w-[70px]">
            <span className="block font-extrabold text-slate-700 text-xl">{tuitions.length}</span>
            <span className="text-slate-500 font-medium text-xs">Students</span>
          </div>
        </div>
      </div>

      {/* Interactive student selector + schedule */}
      <TeacherScheduleView tuitions={tuitions as any} />

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}
