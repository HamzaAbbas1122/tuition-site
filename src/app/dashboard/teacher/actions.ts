"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addClassSession(formData: FormData) {
  const tuitionId = formData.get("tuitionId") as string;
  const date = formData.get("date") as string;
  const endTime = formData.get("endTime") as string;
  const classLink = formData.get("classLink") as string;

  if (!tuitionId || !date || !endTime) return;

  await prisma.classSession.create({
    data: {
      tuitionId,
      date: new Date(date),
      endTime: new Date(endTime),
      classLink: classLink || null,
      status: "SCHEDULED"
    },
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

export async function updateClassLink(sessionId: string, link: string) {
  await prisma.classSession.update({
    where: { id: sessionId },
    data: { classLink: link },
  });
  revalidatePath("/dashboard/teacher");
}
