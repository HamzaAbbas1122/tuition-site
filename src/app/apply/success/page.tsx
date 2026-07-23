import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="glass-card glass-card-hover p-10 rounded-3xl max-w-lg text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Application Submitted!</h1>
        <p className="text-slate-600 mb-8 text-base leading-relaxed">
          Thank you for applying. We have received your application and will contact you via WhatsApp shortly to discuss the next steps.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 border border-blue-500/20 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

