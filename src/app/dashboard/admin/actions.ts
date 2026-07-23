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
  const fakeEmail = `${app.studentName.replace(/\s+/g, "").toLowerCase()}@student.tuitionss.com`;

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
        create: { grade: (app as any).grade || "Class 9" }
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
        create: { subjects: app.subjects, grades: (app as any).grades || "Class 2 to A Levels" } as any
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
  let grade = formData.get("grade") as string;

  if (!teacherId || !studentId || !subject) return;

  if (!grade) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentId }
    });
    grade = studentProfile?.grade || "Class 9";
  }

  await prisma.tuitionClass.create({
    data: {
      teacherId,
      studentId,
      subject,
      grade: grade || "Class 9",
    } as any,
  });

  revalidatePath("/dashboard/admin");
}

export async function updateUserGrade(userId: string, grade: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true, teacherProfile: true }
  });
  if (!user) return;

  if (user.role === "STUDENT") {
    await prisma.studentProfile.upsert({
      where: { userId },
      update: { grade } as any,
      create: { userId, grade } as any,
    });
  } else if (user.role === "TEACHER") {
    await prisma.teacherProfile.upsert({
      where: { userId },
      update: { grades: grade } as any,
      create: { userId, grades: grade } as any,
    });
  }
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
      date: new Date(newDate),
      status: "RESCHEDULED"
    }
  });
  revalidatePath("/dashboard/admin");
}

export async function generateMonthSchedule(tuitionId: string, startDateStr: string, startTimeStr: string, endTimeStr: string, selectedDays: number[]) {
  const startDate = new Date(startDateStr);
  const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
  const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
  
  const sessionsToCreate = [];

  // Generate for 30 days starting from the given start date
  for (let i = 0; i < 30; i++) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(startDate.getDate() + i);
    
    // Only schedule if the day of week is selected
    if (selectedDays.includes(sessionDate.getDay())) {
      sessionDate.setHours(startHours, startMinutes, 0, 0);
      
      const endTime = new Date(sessionDate);
      endTime.setHours(endHours, endMinutes, 0, 0);
      
      sessionsToCreate.push({
        tuitionId,
        date: sessionDate,
        endTime: endTime,
        status: "SCHEDULED"
      });
    }
  }

  if (sessionsToCreate.length > 0) {
    for (const session of sessionsToCreate) {
      await prisma.classSession.create({ data: session });
    }
  }
  revalidatePath("/dashboard/admin");
}

export async function handleRescheduleRequest(sessionId: string, action: 'APPROVE' | 'REJECT') {
  const session = await prisma.classSession.findUnique({ where: { id: sessionId } });
  if (!session || session.rescheduleStatus !== 'PENDING') return;

  if (action === 'APPROVE' && session.rescheduleProposedTime) {
    const newEndTime = session.rescheduleProposedEndTime || new Date(session.rescheduleProposedTime.getTime() + 3600000);

    await prisma.classSession.update({
      where: { id: sessionId },
      data: {
        date: session.rescheduleProposedTime,
        endTime: newEndTime,
        rescheduleStatus: 'ACCEPTED',
        status: 'RESCHEDULED'
      }
    });
  } else {
    await prisma.classSession.update({
      where: { id: sessionId },
      data: {
        rescheduleStatus: 'REJECTED'
      }
    });
  }
  
  revalidatePath("/dashboard/admin");
}

export async function deleteSession(sessionId: string) {
  await prisma.classSession.delete({ where: { id: sessionId } });
  revalidatePath("/dashboard/admin");
}

export async function deleteTuition(tuitionId: string) {
  await prisma.classSession.deleteMany({ where: { tuitionId } });
  await prisma.payment.deleteMany({ where: { tuitionId } });
  await prisma.tuitionClass.delete({ where: { id: tuitionId } });
  revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
  // Manual cascade delete
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { teacherClasses: true, studentClasses: true } });
  if (!user) return;

  const tuitionIds = [
    ...user.teacherClasses.map(t => t.id),
    ...user.studentClasses.map(t => t.id)
  ];

  if (tuitionIds.length > 0) {
    await prisma.classSession.deleteMany({ where: { tuitionId: { in: tuitionIds } } });
    await prisma.payment.deleteMany({ where: { tuitionId: { in: tuitionIds } } });
    await prisma.tuitionClass.deleteMany({ where: { id: { in: tuitionIds } } });
  }

  await prisma.teacherProfile.deleteMany({ where: { userId } });
  await prisma.studentProfile.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  
  revalidatePath("/dashboard/admin");
}
