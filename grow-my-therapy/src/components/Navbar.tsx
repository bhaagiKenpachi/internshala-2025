"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f7f9fa] shadow-md border-b border-[#b7c7c9] px-4 md:px-[173px] py-4">
      <div
        className="max-w-7xl w-full mx-auto flex items-center justify-between md:justify-between"
        style={{ minHeight: "89px" }}
      >
        {/* Mobile: Logo centered above */}
        <div className="flex flex-col items-start justify-center w-full md:hidden">
          <Link href="/">
            <img
              src="/logo.webp"
              alt="logo"
              width={180}
              height={89}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Desktop: Logo left */}
        <div className="hidden md:flex items-center gap-2 font-heading">
          <Link href="/">
            <img src="/logo.webp" alt="logo" width={200} height={89} />
          </Link>
        </div>
        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#f2f7f7] z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
            <img src="/logo.webp" alt="Logo" className="h-10" />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-start px-6 py-4 space-y-6 text-[#1e4145] font-semibold text-xl">
            <span className="text-2xl font-bold">Ellie Shumaker</span>
            <Link href="/services" onClick={() => setIsOpen(false)}>
              How I Help
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About Me
            </Link>
            <Link href="/testimonials" onClick={() => setIsOpen(false)}>
              Testimonials
            </Link>
            <Link href="/faq" onClick={() => setIsOpen(false)}>
              Rates & FAQs
            </Link>
            <Link href="/areas" onClick={() => setIsOpen(false)}>
              Areas Served
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>

        {/* Nav Links - desktop only */}
        <nav className="hidden md:flex gap-2">
          {[
            "Services",
            "About",
            "Testimonials",
            "Rates & FAQs",
            "Areas Served",
            "Contact",
          ].map((item) => (
            <Link
              key={item}
              href={`/${item
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/\s/g, "")}`}
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] text-[18px] px-[12px] py-[8px]"
              style={{ fontFamily: "Noto Sans, sans-serif" }}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA Button - desktop only */}
        <div className="hidden md:flex">
          <Link
            href="/get-started"
            className="items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E4145]/50 bg-white text-[#1E4145] text-[18px] font-[Noto_Sans] px-[24px] h-[50px] flex shadow-sm border border-[#1E4145]"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            Get Started
          </Link>
        </div>

        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button
            className="text-[#1E4145] focus:outline-none md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
