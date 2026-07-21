import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 max-w-lg text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for applying. We have received your application and will contact you via WhatsApp shortly to discuss the next steps.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
