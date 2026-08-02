import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch real teachers from DB
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { teacherProfile: true },
    take: 3,
  });

  const subjects = [
    { title: "Mathematics", icon: "📐", desc: "Class 6 through A-Levels: Algebra, Calculus, Statistics & Geometry", badge: "STEM" },
    { title: "Physics", icon: "🔬", desc: "O-Level & A-Level: Mechanics, Waves, Electricity & Modern Physics", badge: "STEM" },
    { title: "Chemistry", icon: "🧪", desc: "Organic, Inorganic & Physical Chemistry for O/A-Levels", badge: "STEM" },
    { title: "Biology", icon: "🧬", desc: "Cell Biology, Genetics, Human Systems & Ecology", badge: "Science" },
    { title: "Computer Science", icon: "💻", desc: "Programming, OOP, Data Structures & Web Fundamentals", badge: "Tech" },
    { title: "English Language", icon: "📚", desc: "Academic Writing, Comprehension, Grammar & Literature", badge: "Arts" },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Submit Your Application",
      desc: "Fill in a short form — your subject, grade level, and preferred schedule. No fees to apply.",
    },
    {
      step: "02",
      title: "Get Matched to a Teacher",
      desc: "We review your request and assign a qualified teacher suited to your curriculum and pace.",
    },
    {
      step: "03",
      title: "Start Live 1-on-1 Classes",
      desc: "Your teacher shares a meeting link for each session. Track attendance and reschedule when needed — all from your dashboard.",
    },
  ];

  const whyUs = [
    {
      title: "1-on-1 Sessions Only",
      desc: "No shared classes. Every session is just you and your teacher, at your own pace.",
      icon: "🎯",
    },
    {
      title: "Rescheduling Without the Hassle",
      desc: "Request a new time directly through your dashboard. Admin coordinates with the teacher and confirms.",
      icon: "📅",
    },
    {
      title: "Your Own Attendance Record",
      desc: "Students and parents can see every completed, missed, or rescheduled class — no need to ask.",
      icon: "📊",
    },
    {
      title: "Teachers We've Verified Ourselves",
      desc: "Every teacher on the platform is reviewed by us before being assigned to any student.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full space-y-12 md:space-y-24 py-12">

      {/* ── Hero ── */}
      <section className="w-full relative overflow-hidden text-center px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">

          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>3 Free Demo Classes · O &amp; A-Levels · Class 2–12</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Private Tutoring,{" "}
            <span className="blue-glow-text">Done Properly</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Live 1-on-1 classes for O &amp; A-Level students. Each session is taught by a qualified teacher, tracked automatically, and scheduled around your availability.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply/student"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 border border-blue-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Enroll as a Student</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link
              href="/apply/teacher"
              className="w-full sm:w-auto rounded-xl glass-card px-8 py-3.5 text-sm font-semibold text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all hover:border-blue-300 flex items-center justify-center gap-2"
            >
              <span>Apply to Teach</span>
              <span aria-hidden="true" className="text-blue-600">→</span>
            </Link>
          </div>

          {/* Factual trust signals */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> All teachers reviewed by us
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> Live 1-on-1 classes only
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs flex items-center justify-center gap-2">
              <span className="text-blue-600 text-base">✓</span> Attendance tracked for you
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-center justify-center gap-2 text-emerald-800">
              <span className="text-emerald-600 text-base">🎁</span> 3 Demo Classes, Free
            </div>
          </div>
        </div>
      </section>

      {/* ── Subjects ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Subjects We <span className="blue-glow-text">Cover</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            We currently offer tuition for the following subjects. Can&apos;t see yours?{" "}
            <Link href="/apply/student" className="text-blue-600 font-semibold hover:underline">Get in touch</Link> — we&apos;ll do our best to find a match.
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
                Request a tutor <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How It <span className="blue-glow-text">Works</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Three simple steps from application to your first class.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl flex flex-col space-y-4 relative">
              <span className="text-5xl font-extrabold text-blue-100 select-none absolute top-5 right-6 leading-none">{step.step}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Step {step.step}</span>
              <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 Free Demo Classes ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white/80 glass-card p-10 sm:p-14">
          {/* Decorative background number */}
          <span className="absolute right-8 top-6 text-[120px] font-extrabold text-emerald-100/70 select-none leading-none pointer-events-none">3</span>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
            {/* Left: copy */}
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800">
                <span>🎁</span> No payment required
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Try 3 Classes <span className="text-emerald-600">Free</span> Before You Commit
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
                Not sure if online tuition is right for your child? We give every new student <strong>3 full demo sessions</strong> with their assigned teacher — completely free. No payment, no pressure. If you&apos;re not happy after the demo, you don&apos;t continue.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Real sessions with your actual assigned teacher</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Full 1-on-1 format — same as paid classes</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Decide to continue only if you&apos;re satisfied</li>
              </ul>
            </div>

            {/* Right: CTA card */}
            <div className="w-full md:shrink-0 md:w-auto flex flex-col items-center gap-4 bg-white/90 border border-emerald-200 rounded-2xl p-8 shadow-md text-center md:min-w-[220px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-4xl shadow-xs">🎓</div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">3 Classes</p>
                <p className="text-sm text-emerald-700 font-bold">Completely Free</p>
              </div>
              <Link
                href="/apply/student"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 text-center"
              >
                Start Free Demo
              </Link>
              <p className="text-[11px] text-slate-400">No card needed. Apply and we&apos;ll contact you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What Makes Us <span className="blue-glow-text">Different</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              We keep things simple and transparent. Here&apos;s exactly what you get.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-xs">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teachers Showcase ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Our <span className="blue-glow-text">Teachers</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Each teacher is individually reviewed before joining the platform.
            </p>
          </div>
          <Link href="/apply/teacher" className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            Apply to Teach →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher.id} className="glass-card glass-card-hover p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700">
                      {teacher.teacherProfile?.subjects || "General"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Verified</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {teacher.name}
                    </h3>
                    {teacher.teacherProfile?.subjects && (
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        Teaches: {teacher.teacherProfile.subjects}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Live 1-on-1 classes</span>
                  <Link href="/apply/student" className="text-xs font-bold text-blue-600 hover:underline">
                    Request this teacher
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-500 py-12 glass-card rounded-3xl border-dashed border-slate-300">
              Teacher profiles are being set up. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Start Learning This Month</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Submit your application today. We&apos;ll match you with a teacher and have your first class scheduled within a few days.
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
