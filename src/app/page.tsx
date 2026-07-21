import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch some teachers to showcase
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { teacherProfile: true },
    take: 3,
  });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Learning</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Join Nexus Academy to experience premium tuitions tailored to your success. Apply today and unlock your potential with top-tier educators.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/apply/student"
              className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
            >
              Enroll as Student
            </Link>
            <Link href="/apply/teacher" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
              Become a Teacher <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Teachers Showcase */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Educators</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We have a rigorous application process to ensure only the best teachers are guiding our students.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div key={teacher.id} className="flex flex-col items-start bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-x-4 text-xs">
                    <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
                      {teacher.teacherProfile?.subjects || "Various Subjects"}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-4 text-xl font-semibold leading-6 text-gray-900">
                      {teacher.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Experienced educator specializing in {teacher.teacherProfile?.subjects}.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-10 border border-dashed rounded-3xl">
                No teachers showcased yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
