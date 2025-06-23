import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/store/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artistly.com - Performing Artist Booking Platform",
  description: "Connect with top performing artists for your events. Browse singers, dancers, speakers, and DJs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200 mb-6 sticky top-0 z-50">
            <div className="font-bold text-2xl text-blue-600">
              <Link href="/" className="hover:text-blue-700 transition-colors">Artistly</Link>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/artists" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Artists</Link>
              <Link href="/onboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Onboard</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto w-full px-4 min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
