import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedTeachers() {
  const teachers = [
    {
      name: "Muhammad Ali",
      email: "M.ali972@gmail.com",
      subjects: "Mathematics, Physics",
      qualification: "MSc Physics",
      grades: "O Levels, A Levels",
    },
    {
      name: "Fatima Zahra",
      email: "fatima.zahra12@gmail.com",
      subjects: "Biology, Chemistry",
      qualification: "MBBS",
      grades: "O Levels, A Levels",
    },
    {
      name: "Ahmed Raza",
      email: "ahmedraza_cs@gmail.com",
      subjects: "Computer Science",
      qualification: "BS Computer Science",
      grades: "Class 9, O Levels",
    },
    {
      name: "Ayesha Noor",
      email: "ayeshanoor986@gmail.com",
      subjects: "English Literature",
      qualification: "MA English",
      grades: "Class 8, Class 9, O Levels",
    },
    {
      name: "Usman Tariq",
      email: "muhmmadusman@gmail.com",
      subjects: "Accounting, Economics",
      qualification: "ACCA",
      grades: "O Levels, A Levels",
    },
  ];

  const defaultPassword = await bcrypt.hash("Password123!", 10);

  console.log("Seeding 5 teachers...");

  for (const t of teachers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: t.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: t.name,
          email: t.email,
          password: defaultPassword,
          role: "TEACHER",
          teacherProfile: {
            create: {
              subjects: t.subjects,
              grades: t.grades,
              qualification: t.qualification,
            },
          },
        },
      });
      console.log(`Created teacher: ${t.name}`);
    } else {
      console.log(`Teacher already exists: ${t.name}`);
    }
  }

  console.log("Seeding complete.");
}

seedTeachers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
