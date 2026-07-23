import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch teachers to showcase
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { teacherProfile: true },
    take: 3,
  });

  const subjects = [
    { title: "Mathematics", icon: "📐", desc: "Calculus, Algebra, Statistics & Geometry", badge: "STEM" },
    { title: "Physics", icon: "🔬", desc: "Mechanics, Electromagnetism & Quantum Physics", badge: "STEM" },
    { title: "Chemistry", icon: "🧪", desc: "Organic, Inorganic & Physical Chemistry", badge: "STEM" },
    { title: "Biology", icon: "🧬", desc: "Genetics, Human Anatomy & Cell Biology", badge: "Science" },
    { title: "Computer Science", icon: "💻", desc: "Programming, Web Development & Algorithms", badge: "Tech" },
    { title: "English & Humanities", icon: "📚", desc: "Literature, Academic Writing & Critical Thinking", badge: "Arts" },
  ];

  const features = [
    {
      title: "1-on-1 Personalized Mentorship",
      desc: "Every lesson is tailored to the student's individual learning speed and goals.",
      icon: "🎯",
    },
    {
      title: "Flexible Timetable & Rescheduling",
      desc: "Easily adjust monthly class times with transparent admin coordination.",
      icon: "📅",
    },
    {
      title: "Real-Time Progress & Attendance",
      desc: "Parents and students can monitor class completion and payment status anytime.",
      icon: "📊",
    },
    {
      title: "Vetted & Certified Instructors",
      desc: "Top-grade educators selected through strict qualification verification.",
      icon: "🛡️",
    },
  ];

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Parent of Grade 11 Student",
      avatar: "👩‍👧",
      rating: 5,
      subject: "Mathematics & Physics",
      comment: "Tuitionss.com completely turned around my son's grades. The 1-on-1 attention and flexible timetable made all the difference before his final exams!",
    },
    {
      name: "Muhammad Ali",
      role: "A-Level Student",
      avatar: "👨‍🎓",
      rating: 5,
      subject: "Chemistry & Biology",
      comment: "The instructors explain complex organic chemistry topics with such ease. Being able to reschedule sessions directly with my tutor saved me so much stress.",
    },
    {
      name: "Elena Rostova",
      role: "Computer Science Student",
      avatar: "👩‍💻",
      rating: 5,
      subject: "Programming & Algorithms",
      comment: "I went from struggling with basic coding to building full web applications. The verified tutors are truly top-grade educators!",
    },
    {
      name: "David Chen",
      role: "Parent of Grade 8 Student",
      avatar: "👨‍👦",
      rating: 5,
      subject: "General Science & Math",
      comment: "The real-time attendance logs and transparent monthly records give us total peace of mind. Highly recommended for any parent!",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full space-y-24 py-12">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden text-center px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>🎓 Premier 1-on-1 Online Education</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Empowering Students with <span className="blue-glow-text">World-Class Tutors</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience personalized live tuitions, interactive schedules, and transparent progress tracking tailored to help you excel academically.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply/student"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Enroll as Student</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link 
              href="/apply/teacher" 
              className="w-full sm:w-auto rounded-xl glass-card px-8 py-3.5 text-sm font-semibold text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all hover:border-blue-300 flex items-center justify-center gap-2"
            >
              <span>Become a Teacher</span>
              <span aria-hidden="true" className="text-blue-600">→</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> 100% Certified Tutors
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> Interactive Classes
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> Smart Timetables
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> Progress Ledger
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore <span className="blue-glow-text">Core Subjects</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Comprehensive tuition programs designed for school, college, and competitive exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, i) => (
            <div key={i} className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-3xl">{sub.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {sub.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{sub.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{sub.desc}</p>
              </div>
              <Link href="/apply/student" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Request Tutor <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Tuitionss.com */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Students & Parents <span className="blue-glow-text">Trust Us</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              We combine modern technology with top-tier pedagogy to deliver an unmatched learning environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-xs">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Stat Counter Strip */}
          <div className="border-t border-slate-200/80 pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-blue-700">98%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Grade Improvement</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-700">50+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Master Educators</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-sky-700">10,000+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Hours Taught</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-700">4.9 / 5</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Showcase */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our <span className="blue-glow-text">Featured Educators</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Handpicked tutors dedicated to nurturing intellectual curiosity and exam mastery.
            </p>
          </div>
          <Link href="/apply/teacher" className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            Join Our Faculty →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher.id} className="glass-card glass-card-hover p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700">
                      {teacher.teacherProfile?.subjects || "General Tutor"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Verified</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {teacher.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Specialized in delivering structured 1-on-1 lessons in {teacher.teacherProfile?.subjects || "multiple disciplines"}.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Live 1-on-1 Classes</span>
                  <Link href="/apply/student" className="text-xs font-bold text-blue-600 hover:underline">
                    Book Class
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-500 py-12 glass-card rounded-3xl border-dashed border-slate-300">
              Our faculty members are currently being updated.
            </div>
          )}
        </div>
      </section>

      {/* Student & Parent Reviews Section */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What Our <span className="blue-glow-text">Students & Parents Say</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Real feedback from parents and students who achieved academic success with Tuitionss.com.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="glass-card glass-card-hover p-8 rounded-3xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, rIndex) => (
                      <svg key={rIndex} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {rev.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-xs">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                  <p className="text-xs text-slate-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Elevate Your Education?</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Join hundreds of successful students achieving top grades with personalized tutoring at Tuitionss.com.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/apply/student"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                Apply as Student
              </Link>
              <Link
                href="/apply/teacher"
                className="bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/40 px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Apply as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

