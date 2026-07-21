"use client";

import { submitStudentApplication } from "../actions";

export default function StudentApplicationPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Apply as a Student</h2>
          <p className="mt-2 text-sm text-gray-600">Join our premium tuition sessions.</p>
        </div>
        <form action={submitStudentApplication} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input id="studentName" name="studentName" type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">Parent Name</label>
              <input id="parentName" name="parentName" type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
              <input id="phone" name="phone" type="tel" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject(s) Needed</label>
              <input id="subject" name="subject" type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Math, Physics" />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
