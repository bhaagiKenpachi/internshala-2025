"use client";

import React, { useEffect, useState } from "react";

const sentences = [
  "Greater love in your relationships",
  "Greater peace in your heart",
  "Greater purpose in your life direction",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sentences.length);
    }, 2500); // Change sentence every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-7rem)] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/hero-bg.webp"
        alt="hero background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ color: "transparent" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      {/* Content */}
      <div className="relative z-20 text-center px-4 md:px-[10%] max-w-screen-2xl flex flex-col items-center w-full">
        <h2
          className="mb-3 text-[14px] font-sans"
          style={{
            color: "#F5F7FAC",
            opacity: 0.8,
            marginBottom: "12px",
          }}
        >
          Christian Counseling Services in Richmond &amp; Central Virginia
        </h2>
        <span className="font-extrabold  md:text-4xl w-full block py-2 md:py-4 font-sans text-[#F5F7FA] text-3xl">
          Professional Counseling for Christian Healing and Growth
        </span>
        <p className="text-xl font-sans text-[#F5F7FA] font-light md:font-semibold max-w-xl mx-auto">
          Begin your journey today towards spiritual growth, deeper
          relationships, and lasting inner peace.
        </p>
        <h3 className=" font-extrabold text-2xl text-white font-sans">
          I want to work with you for…
        </h3>
        <div className="relative h-12 overflow-hidden w-full">
          <div
            key={current}
            className="absolute inset-0 w-full flex items-center justify-center transition-opacity duration-700 ease-in-out opacity-100"
            style={{ willChange: "opacity, transform" }}
          >
            <span className=" text-lg lg:text-xl flex items-center gap-2 text-[#B5DBDF] font-extrabold font-sans tracking-wide drop-shadow transition-all duration-700 ease-in-out animate-fade-in-up">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              {sentences[current] || "Greater purpose in your life direction"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center mb-2 gap-0.5 flex-wrap">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="gold"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="ml-1 text-sm font-bold text-white">Top Rated</span>
          </div>
          <span className="w-1 h-1 mx-1.5 bg-gray-300 rounded-full"></span>
          <a
            href="#aboutUs"
            className="text-xs font-bold text-white underline hover:no-underline"
          >
            40+ Years Experience
          </a>
          <span className="w-1 h-1 mx-1.5 bg-gray-300 rounded-full"></span>
          <a
            href="#testimonials"
            className="text-xs font-bold text-white underline hover:no-underline"
          >
            Testimonials
          </a>
          <span className="w-1 h-1 mx-1.5 bg-gray-300 rounded-full"></span>
          <a
            href="#AsSeenOn"
            className="text-xs font-bold text-white underline hover:no-underline"
          >
            Media Mentions
          </a>
        </div>
        <a href="/book" className="mt-4 block w-fit mx-auto">
          <button className="group relative inline-flex h-11 items-center justify-center rounded-xl border-0 bg-[#D9F5E5] text-[#1E3A8A] text-[18px] font-extrabold font-sans px-6 shadow transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-2"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
            </svg>
            Start Healing Today
          </button>
        </a>
      </div>
    </div>
  );
}
