"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitStudentApplication(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const parentName = formData.get("parentName") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;

  if (!studentName || !parentName || !phone || !subject) {
    return { error: "All fields are required" };
  }

  await prisma.studentApplication.create({
    data: {
      studentName,
      parentName,
      phone,
      subject,
    },
  });

  redirect("/apply/success");
}

export async function submitTeacherApplication(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const subjects = formData.get("subjects") as string;

  if (!name || !phone || !email || !subjects) {
    return { error: "All fields are required" };
  }

  await prisma.teacherApplication.create({
    data: {
      name,
      phone,
      email,
      subjects,
    },
  });

  redirect("/apply/success");
}
