import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <section className="w-full bg-[#d6f0f6] py-16 md:py-24 lg:py-28 px-4 md:px-8 lg:px-16 xl:px-24 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
        {/* Headshot */}
        <div
          className="relative w-[70vw] sm:w-[70vw] md:w-[300px] lg:w-[400px] h-[400px] sm:h-[400px] lg:h-[600px] justify-self-center bg-cover bg-center bg-no-repeat rounded-2xl border-8 border-white shadow-lg"
          style={{ backgroundImage: "url('/about.jpg')" }}
        >
          {/* Bottom Badge */}
          <div className="absolute bottom-0 bg-white/80 rounded-tr-md rounded-br-md rounded-bl-md px-4 py-2 shadow-md text-sm flex flex-col gap-0">
            <span className="font-semibold text-black">Dr. Serena Blake</span>
            <span className="text-xs font-medium text-black">PsyD</span>
            <div className="font-semibold flex items-center text-black text-xs mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="gold"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4 mr-1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <Link href="/#testimonials" className="text-black no-underline">
                Top Rated | 8 Years Experience
              </Link>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-3 flex flex-col md:mt-0 gap-3 lg:gap-5 flex-1">
          {/* Yellow Badge */}
          <div>
            <span className=" md:mx-0  max-w-fit rounded-lg bg-amber-100 px-3 py-1 text-sm text-[#1e4145] font-medium block">
              Dr. Serena Blake, PsyD — Clinical Psychologist
            </span>
          </div>

          {/* Name */}
          <p className="text-3xl font-bold text-[#1e4145] lg:text-4xl font-sans">
            Hi, I&apos;m Dr. Serena Blake
          </p>

          {/* Paragraph */}
          <p className="mt-2 leading-relaxed w-full text-[#1e4145] font-sans font-medium text-base md:text-lg lg:text-xl ">
            Dr. Serena Blake is a licensed clinical psychologist (PsyD) based in Los
            Angeles, CA, with eight years of experience and over 500 client
            sessions. She blends evidence-based approaches—like
            cognitive-behavioral therapy and mindfulness—with compassionate,
            personalized care to help you overcome anxiety, strengthen
            relationships, and heal from trauma. Whether you meet in her Maplewood
            Drive office or connect virtually via Zoom, Dr. Blake is committed to
            creating a safe, supportive space for you to thrive.
          </p>

          {/* Details */}
          <div className="mt-4 font-sans font-medium leading-relaxed text-[#1e4145] text-base md:text-lg lg:text-xl space-y-1">
            <div>
              <span className="inline-block mr-2">8 years of practice</span>•
              <span className="inline-block ml-2">500+ sessions</span>
            </div>
            <div>
              <strong>Phone:</strong> (323) 555-0192
            </div>
            <div>
              <strong>Office Hours:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>In-person: Tue & Thu, 10 AM–6 PM</li>
                <li>Virtual via Zoom: Mon, Wed & Fri, 1 PM–5 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
