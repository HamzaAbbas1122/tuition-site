"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { sendApplicationReceivedEmail } from "@/lib/email";

export async function submitStudentApplication(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const parentName = formData.get("parentName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const grade = formData.get("grade") as string;

  if (!studentName || !parentName || !phone || !subject || !email) {
    throw new Error("All fields are required");
  }

  await prisma.studentApplication.create({
    data: {
      studentName,
      parentName,
      phone,
      email: email || null,
      subject,
      grade: grade || "Class 9",
    } as any,
  });

  await sendApplicationReceivedEmail({
    to: email,
    name: studentName,
    role: "STUDENT",
  });

  redirect("/apply/success");
}

export async function submitTeacherApplication(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const subjects = formData.get("subjects") as string;
  const qualification = formData.get("qualification") as string;
  const grades = formData.getAll("grades") as string[];
  const gradesStr = grades.length > 0 ? grades.join(", ") : (formData.get("grades") as string || "Class 2 to A Levels");

  if (!name || !phone || !email || !subjects || !qualification) {
    throw new Error("All fields are required");
  }

  await prisma.teacherApplication.create({
    data: {
      name,
      phone,
      email,
      subjects,
      grades: gradesStr,
      qualification,
    } as any,
  });

  await sendApplicationReceivedEmail({
    to: email,
    name,
    role: "TEACHER",
  });

  redirect("/apply/success");
}
