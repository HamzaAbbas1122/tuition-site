import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import StudentScheduleView from "./StudentScheduleView";

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
        orderBy: { date: "asc" }
      },
      payments: true,
    }
  });

  const easypaisaName = process.env.EASYPAISA_NAME || "";
  const easypaisaNumber = process.env.EASYPAISA_NUMBER || "";

  const allSessions = tuitions.flatMap(t => t.sessions);
  const totalAttended = allSessions.filter(s => s.status === "COMPLETED").length;
  const totalMissed = allSessions.filter(s => s.status === "MISSED").length;
  const totalUpcoming = allSessions.filter(s => ["SCHEDULED", "RESCHEDULED", "PENDING"].includes(s.status)).length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {session.user.name}&apos;s <span className="blue-glow-text">Dashboard</span>
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

      {/* Classes — Vertical Sidebar Layout */}
      <StudentScheduleView tuitions={tuitions as any} />

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}
