import React from "react";

export default function About() {
    return (
        <section className="w-full bg-[#d6f0f6] py-16 md:py-24 lg:py-28 px-4 md:px-8 lg:px-16 xl:px-24 flex justify-center">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
                {/* Headshot */}
                <div className="mt-0 relative !w-[70vw] !h-[400px] sm:!w-[70vw] sm:!h-[88px] md:!h-[400px] md:!w-[300px] lg:!w-[400px] justify-self-center lg:!h-[600px] headshot headshot-1 !bg-cover bg-center !bg-no-repeat rounded-2xl border-8 border-white shadow-lg"
                    style={{ backgroundImage: "url('/about.jpg')" }}
                >
                    <div className="inline-flex items-center text-primary-foreground p-1 pr-4 shadow-md absolute bottom-0 bg-[#B5DBDF]/70 rounded-none rounded-r-lg">
                        <div className="ml-2 grid grid-cols-1 text-sm">
                            <span className="font-semibold">Dr. Serena Blake</span>
                            <span className="text-xs">PsyD</span>
                            <div className="font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gold" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <a href="/#testimonials">Top Rated | 8 Years Experience</a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Info */}
                <div className="flex-1">
                    {/* Yellow badge for name/title */}
                    <div className="mb-4">
                        <span className="mx-auto md:mx-0 max-w-fit rounded-lg bg-amber-100 px-3 py-1 text-sm text-[#1e4145] font-medium block">
                            Dr. Serena Blake, PsyD — Clinical Psychologist
                        </span>
                    </div>
                    {/* Name Heading */}
                    <p className="text-4xl font-bold text-[#1e4145] lg:text-5xl mb-4 font-sans">
                        Hi, I'm Dr. Serena Blake
                    </p>
                    {/* About Paragraph */}
                    <p className="mt-4 !leading-relaxed text-[#1e4145] text-lg md:text-xl lg:text-2xl font-medium">
                        Dr. Serena Blake is a licensed clinical psychologist (PsyD) based in Los Angeles, CA, with eight years of experience and over 500 client sessions. She blends evidence-based approaches—like cognitive-behavioral therapy and mindfulness—with compassionate, personalized care to help you overcome anxiety, strengthen relationships, and heal from trauma. Whether you meet in her Maplewood Drive office or connect virtually via Zoom, Dr. Blake is committed to creating a safe, supportive space for you to thrive.
                    </p>
                    {/* Experience */}
                    <div className="mt-4 !leading-relaxed text-[#1e4145] text-lg md:text-xl lg:text-2xl font-medium">
                        <span className="inline-block mr-2">8 years of practice</span>
                        <span className="inline-block">500+ sessions</span>
                        <span><strong>Phone:</strong> (323) 555-0192</span>
                        <strong>Office Hours:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>In-person: Tue & Thu, 10 AM–6 PM</li>
                            <li>Virtual via Zoom: Mon, Wed & Fri, 1 PM–5 PM</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
} 