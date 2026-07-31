"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#faf8f5]/90 backdrop-blur-xl border-b border-blue-100/80 sticky top-0 z-50 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-sm tracking-wider">T</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Tuitionss<span className="blue-glow-text">.com</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {!session && (
              <>
                <Link href="/apply/student" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50/60">
                  Apply as Student
                </Link>
                <Link href="/apply/teacher" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50/60">
                  Apply as Teacher
                </Link>
              </>
            )}
            
            {session ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href={`/dashboard/${session.user.role.toLowerCase()}`}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-xs"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 focus:outline-none transition-colors border border-slate-200/70"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-100/80 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {!session && (
            <>
              <Link 
                href="/apply/student" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50/80 transition-colors"
              >
                👨‍🎓 Apply as Student
              </Link>
              <Link 
                href="/apply/teacher" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50/80 transition-colors"
              >
                👨‍🏫 Apply as Teacher
              </Link>
            </>
          )}
          
          <div className="pt-2 border-t border-slate-100">
            {session ? (
              <div className="space-y-2">
                <Link 
                  href={`/dashboard/${session.user.role.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-blue-50 text-blue-700 font-extrabold text-sm px-4 py-2.5 rounded-xl border border-blue-200/80"
                >
                  Dashboard ({session.user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-center text-red-600 font-bold text-sm px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20"
              >
                Login to Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
