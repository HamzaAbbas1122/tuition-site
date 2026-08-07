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

  const faqs = [
    {
      q: "What happens if I'm not satisfied after the 3 demo classes?",
      a: "You simply don't pay anything. The demo is completely risk-free. If you are not satisfied with your assigned tutor, we will reassign a new tutor for you."
    },
    {
      q: "How does payment work?",
      a: "We charge a fixed monthly fee based on the number of subjects and grade level. Payments can be easily made via online bank transfer or Easypaisa."
    },
    {
      q: "What if I need to miss a class?",
      a: "No problem. You can request a reschedule directly from your student dashboard, and we\u2019ll arrange a make-up class with your teacher."
    },
    {
      q: "Are the classes group or individual?",
      a: "All our classes are strictly 1-on-1. You get 100% of the teacher's attention to focus on exactly what you need help with."
    },
    {
      q: "Is there a fee to apply as a teacher?",
      a: "No — the application itself is completely free. There is a Rs. 2,500 fee for the 7-Day Professional Teacher Training that comes after the screening call. This is stated upfront in the FAQ so there are no surprises.",
      teacher: true,
    },
    {
      q: "What does the subject screening call involve?",
      a: "It's a short 5\u201310 minute call purely to assess your subject knowledge and grade-level fit. No pitch, no fees discussed \u2014 just a pass/fail competency check.",
      teacher: true,
    },
    {
      q: "How does the demo class work?",
      a: "After completing the 7-day training, you deliver an observed mock class evaluated by the trainer. Passing the demo \u2014 not just completing 7 days \u2014 is what earns you the Verified Teacher badge.",
      teacher: true,
    },
    {
      q: "How soon will I be assigned students after getting verified?",
      a: "It depends on real student demand for your subject and grade level. We match teachers as requests come in \u2014 typically within a few weeks of verification.",
      teacher: true,
    },
  ];

  const teacherSteps = [
    { num: "01", icon: "\ud83d\udcdd", title: "Free Application", desc: "Apply at tuitionss.com/apply/teacher. No fee to apply \u2014 pricing info is in the FAQ before you submit." },
    { num: "02", icon: "\ud83d\udcde", title: "Screening Call (5\u201310 min)", desc: "A short competency check on subject depth and grade fit. Pass/fail only \u2014 no pitch or fees discussed." },
    { num: "03", icon: "\ud83c\udf93", title: "7-Day Training", desc: "Paid professional training (Rs. 2,500) led by an experienced online teacher. Pricing was visible before you applied.", cost: "Rs. 2,500" },
    { num: "04", icon: "\ud83c\udfeb", title: "Graded Demo Class", desc: "An observed mock class evaluated by the trainer. This \u2014 not just attendance \u2014 earns your Verified status." },
    { num: "05", icon: "\u2705", title: "Verified & Placed", desc: "Get your badge, certificate, and reusable materials. Matched with students as demand arrives \u2014 typically within a few weeks." },
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


      {/* ── Dashboard Preview ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Text */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Track Everything From Your <span className="blue-glow-text">Dashboard</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              No more messy WhatsApp groups or tracking spreadsheets. Both parents and students get access to a clean portal where you can see upcoming classes, past attendance, and request rescheduling in one click.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 max-w-md mx-auto lg:mx-0 text-left">
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</span> One-click class joining links</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</span> Transparent attendance history</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">✓</span> Simple reschedule requests</li>
            </ul>
          </div>

          {/* Right CSS Mockup */}
          <div className="flex-1 w-full max-w-2xl perspective-1000">
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-blue-900/10 transform lg:-rotate-y-6 transition-transform duration-700 hover:rotate-y-0">
              {/* Fake Browser Header */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="mx-auto bg-white border border-slate-200/80 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono w-1/2 text-center truncate shadow-xs">
                  tuitionss.com/dashboard/student
                </div>
              </div>
              {/* Fake App Content */}
              <div className="flex h-[320px] bg-[#faf8f5]">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-slate-200/80 bg-white/70 p-4 space-y-4">
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-12 bg-blue-50 rounded-xl border border-blue-200/60 p-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] shrink-0">📐</div>
                      <div className="space-y-1 w-full">
                        <div className="h-2 bg-blue-700/80 rounded w-3/4"></div>
                        <div className="h-1.5 bg-blue-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-12 bg-white rounded-xl border border-slate-100 p-2 flex items-center gap-2 opacity-60">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] shrink-0">🔬</div>
                      <div className="space-y-1 w-full">
                        <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                        <div className="h-1.5 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Main panel */}
                <div className="w-2/3 p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">A-Level Mathematics</div>
                      <div className="text-[10px] text-slate-500 font-medium">Your Teacher</div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">Active</div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Today, 4:00 PM
                      </div>
                      <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">Upcoming</div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[11px] font-bold text-center py-2 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-1">
                        Join Class <span className="text-[8px]">→</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer">
                        Reschedule
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs opacity-70">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-[11px] font-bold text-slate-600">Yesterday, 4:00 PM</div>
                      <div className="text-[10px] text-slate-500 font-bold border border-slate-200 px-2 py-0.5 rounded-full">Completed</div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[8px] font-bold">✓</span>
                      <span className="text-[10px] text-slate-500 font-medium">Attended • 55 mins</span>
                    </div>
                  </div>

                </div>
              </div>
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

      {/* ── Teacher Hiring Process ── */}
      <section className="w-full max-w-7xl px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                For Teacher Applicants
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How to Join as a <span className="blue-glow-text">Verified Teacher</span>
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-lg">
                Our process is transparent from day one. 5 clear steps from application to your first student.
              </p>
            </div>
            <Link href="/apply/teacher" className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:scale-105 transition-all">
              Apply to Teach <span>→</span>
            </Link>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {teacherSteps.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center bg-white/90 border border-slate-200/60 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                {/* Step number */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/30 mb-3">
                  <span className="text-white text-[11px] font-extrabold">{step.num}</span>
                </div>
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                {/* Title */}
                <h3 className="text-[13px] font-bold text-slate-900 leading-snug mb-1.5">{step.title}</h3>
                {/* Cost badge */}
                {step.cost && (
                  <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-50 border border-amber-300 text-amber-800">
                    {step.cost}
                  </span>
                )}
                {/* Description */}
                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Transparency notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <span className="text-amber-500 text-base shrink-0 mt-0.5">💡</span>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>No hidden fees, ever.</strong> The Rs. 2,500 training cost is disclosed in the FAQ before you apply. The application itself is free and takes under 2 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full max-w-4xl mx-auto px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked <span className="blue-glow-text">Questions</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Everything you need to know before you start.
          </p>
        </div>

        {/* Student FAQs */}
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">For Students</p>
        <div className="space-y-4 mb-8">
          {faqs.filter(f => !f.teacher).map((faq, i) => (
            <details key={i} className="group glass-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none font-bold text-slate-900 list-none">
                {faq.q}
                <span className="transition group-open:rotate-180 text-blue-600">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Teacher FAQs */}
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">For Teacher Applicants</p>
        <div className="space-y-4">
          {faqs.filter(f => f.teacher).map((faq, i) => (
            <details key={i} className="group glass-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden border-blue-100/80">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none font-bold text-slate-900 list-none">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  {faq.q}
                </span>
                <span className="transition group-open:rotate-180 text-blue-600 shrink-0 ml-4">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
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
