"use client";
import React, { useState } from "react";

const faqs = [
    {
        question: "Do you accept insurance?",
        answer: "No, but a superbill is provided for self-submission.",
    },
    {
        question: "Are online sessions available?",
        answer: "Yes—all virtual sessions via Zoom.",
    },
    {
        question: "What is your cancellation policy?",
        answer: "24-hour notice required.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="p-4 flex flex-col gap-[1rem] md:gap-[2rem] md:px-[10%] relative bg-cover bg-no-repeat bg-[#bfe1e7] py-[112px] xl:px-[173px] xl:py-[112px] px-4">
            <div className="max-w-4xl w-full">
                <h2 className="font-bold text-4xl block text-left md:text-6xl text-[#1e4145] pb-2 md:pb-4 md:flex gap-2 md:gap-4 relative">Frequently Asked Questions</h2>
                <div className="pt-8">
                    <hr className="border-gray-400 mb-0" />
                    <div className="divide-y divide-gray-400">
                        {faqs.map((faq, idx) => (
                            <div key={faq.question} className="py-4">
                                <button
                                    type="button"
                                    className={
                                        `flex flex-1 items-center justify-between transition-all font-bold text-2xl md:text-3xl text-left text-[#1e4145] p-4 pl-0 rounded-t-lg hover:no-underline hover:opacity-70 relative z-49 w-full ${openIndex === idx ? '' : 'rounded-b-lg'}`
                                    }
                                    onClick={() => toggle(idx)}
                                    aria-expanded={openIndex === idx}
                                >
                                    <span className="font-bold flex-1 text-left">{faq.question}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`lucide lucide-chevron-down h-4 w-4 shrink-0 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </button>
                                {openIndex === idx && (
                                    <div className="pb-4 pt-0 font-para text-xl text-[#1e4145] animate-fade-in">
                                        <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <hr className="border-gray-400 mt-0" />
                </div>
            </div>
        </section>
    );
}

// Optional: Add a simple fade-in animation
// In your global CSS (e.g., globals.css), add:
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.3s ease; } 