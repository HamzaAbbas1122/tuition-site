import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import SiteVisitTracker from "@/components/SiteVisitTracker";

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
        {/* Ambient background glows */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-100/25 rounded-full blur-[170px] pointer-events-none -z-10" />
        <div className="fixed top-1/2 left-2/3 w-[450px] h-[450px] bg-indigo-100/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200/80 bg-[#faf8f5]/80 backdrop-blur-md py-8 mt-20 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <Image 
                  src="/logo-desktop.png" 
                  alt="Tuitionss.com" 
                  width={150} 
                  height={30} 
                  className="hidden sm:block object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
                <Image 
                  src="/z-logo.png" 
                  alt="Tuitionss.com" 
                  width={24} 
                  height={24} 
                  className="block sm:hidden object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
              <p className="text-slate-500">© {new Date().getFullYear()} Tuitionss.com. Private 1-on-1 tuition for O &amp; A-Level students.</p>
              <div className="flex space-x-6 text-slate-600 font-medium">
                <a href="/apply/student" className="hover:text-blue-600 transition-colors">Apply Student</a>
                <a href="/apply/teacher" className="hover:text-blue-600 transition-colors">Apply Teacher</a>
                <a href="/login" className="hover:text-blue-600 transition-colors">Portal Login</a>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
        <SpeedInsights />
        <SiteVisitTracker />
        
        {/* WhatsApp Floating Button */}
        <a 
          href="https://wa.me/923226636595?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20home%20tuition."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          aria-label="Chat with us on WhatsApp"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </body>
    </html>
  );
}



