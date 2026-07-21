"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-xl font-bold text-indigo-600">
              Nexus Academy
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/apply/student" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Apply as Student
            </Link>
            <Link href="/apply/teacher" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Apply as Teacher
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/dashboard/${session.user.role.toLowerCase()}`}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
