import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tuitionss.com | Premium Online & In-Person Tuitions",
  description: "Join Tuitionss.com for premium 1-on-1 tutoring from Class 2 to A Levels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#faf8f5] text-slate-800 relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
        {/* Ambient warm creamy & blue soft glows */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/25 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse" />
        <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-100/35 rounded-full blur-[170px] pointer-events-none -z-10" />
        <div className="fixed top-1/2 left-2/3 w-[450px] h-[450px] bg-indigo-100/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200/80 bg-[#faf8f5]/80 backdrop-blur-md py-8 mt-20 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                  T
                </div>
                <span className="font-extrabold text-slate-800 tracking-tight text-sm">Tuitionss.com</span>
              </div>
              <p className="text-slate-500">© {new Date().getFullYear()} Tuitionss.com. Empowering education worldwide.</p>
              <div className="flex space-x-6 text-slate-600 font-medium">
                <a href="/apply/student" className="hover:text-blue-600 transition-colors">Apply Student</a>
                <a href="/apply/teacher" className="hover:text-blue-600 transition-colors">Apply Teacher</a>
                <a href="/login" className="hover:text-blue-600 transition-colors">Portal Login</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}



