"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

export async function acceptStudentApp(id: string) {
  const app = await prisma.studentApplication.findUnique({ where: { id } });
  if (!app) return;

  await prisma.studentApplication.update({
    where: { id },
    data: { status: "ACCEPTED" },
  });

  const defaultPassword = await bcrypt.hash("student123", 10);
  const fakeEmail = `${app.studentName.replace(/\s+/g, "").toLowerCase()}@student.nexus.com`;

  await prisma.user.upsert({
    where: { email: fakeEmail },
    update: {},
    create: {
      name: app.studentName,
      email: fakeEmail,
      phone: app.phone,
      password: defaultPassword,
      role: "STUDENT",
      studentProfile: {
        create: { grade: app.subject }
      }
    }
  });

  revalidatePath("/dashboard/admin");
}

export async function rejectStudentApp(id: string) {
  await prisma.studentApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/dashboard/admin");
}

export async function acceptTeacherApp(id: string) {
  const app = await prisma.teacherApplication.findUnique({ where: { id } });
  if (!app) return;

  await prisma.teacherApplication.update({
    where: { id },
    data: { status: "ACCEPTED" },
  });

  const defaultPassword = await bcrypt.hash("teacher123", 10);

  await prisma.user.upsert({
    where: { email: app.email },
    update: {},
    create: {
      name: app.name,
      email: app.email,
      phone: app.phone,
      password: defaultPassword,
      role: "TEACHER",
      teacherProfile: {
        create: { subjects: app.subjects }
      }
    }
  });

  revalidatePath("/dashboard/admin");
}

export async function rejectTeacherApp(id: string) {
  await prisma.teacherApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/dashboard/admin");
}

export async function createTuitionClass(formData: FormData) {
  const teacherId = formData.get("teacherId") as string;
  const studentId = formData.get("studentId") as string;
  const subject = formData.get("subject") as string;

  if (!teacherId || !studentId || !subject) return;

  await prisma.tuitionClass.create({
    data: {
      teacherId,
      studentId,
      subject,
    },
  });

  revalidatePath("/dashboard/admin");
}

export async function togglePaymentStatus(id: string, currentStatus: string) {
  await prisma.payment.update({
    where: { id },
    data: { status: currentStatus === "PAID" ? "UNPAID" : "PAID", paidDate: currentStatus === "PAID" ? null : new Date() },
  });
  revalidatePath("/dashboard/admin");
}

export async function rescheduleClass(id: string, newDate: string) {
  if (!newDate) return;
  await prisma.classSession.update({
    where: { id },
    data: {
      rescheduledTo: new Date(newDate),
      status: "RESCHEDULED"
    }
  });
  revalidatePath("/dashboard/admin");
}
