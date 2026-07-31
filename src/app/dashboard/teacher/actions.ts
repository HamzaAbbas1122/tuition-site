"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestReschedule(sessionId: string, formData: FormData) {
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const reason = formData.get("reason") as string;
  if (!startTime || !endTime) return;

  const session = await prisma.classSession.findUnique({ where: { id: sessionId } });
  if (!session) return;

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const proposedStart = new Date(session.date);
  proposedStart.setHours(startHours, startMinutes, 0, 0);

  const proposedEnd = new Date(session.date);
  proposedEnd.setHours(endHours, endMinutes, 0, 0);

  await prisma.classSession.update({
    where: { id: sessionId },
    data: {
      rescheduleRequestedBy: "TEACHER",
      rescheduleProposedTime: proposedStart,
      rescheduleProposedEndTime: proposedEnd,
      rescheduleReason: reason,
      rescheduleStatus: "PENDING"
    }
  });
  revalidatePath("/dashboard/teacher");
}

export async function markClassStatus(sessionId: string, status: "COMPLETED" | "MISSED" | "PENDING") {
  await prisma.classSession.update({
    where: { id: sessionId },
    data: { status },
  });
  revalidatePath("/dashboard/teacher");
}

export async function updateClassLink(sessionId: string, formData: FormData) {
  const link = formData.get("link") as string;
  await prisma.classSession.update({
    where: { id: sessionId },
    data: { classLink: link },
  });
  revalidatePath("/dashboard/teacher");
}
