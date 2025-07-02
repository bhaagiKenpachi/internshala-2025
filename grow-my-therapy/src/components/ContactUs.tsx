"use client"
import React, { useState } from "react";

interface FormState {
    name: string;
    phone: string;
    email: string;
    message: string;
    preferredTime: string;
    agree: boolean;
}

interface FormErrors {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    preferredTime?: string;
    agree?: string;
}

export default function ContactUs() {
    const [form, setForm] = useState<FormState>({
        name: "",
        phone: "",
        email: "",
        message: "",
        preferredTime: "",
        agree: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const validate = () => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required.";
        if (!form.phone.trim()) newErrors.phone = "Phone is required.";
        if (!form.email.trim()) newErrors.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email address.";
        if (!form.message.trim()) newErrors.message = "Please tell us what brings you here.";
        if (!form.preferredTime.trim()) newErrors.preferredTime = "Preferred time is required.";
        if (!form.agree) newErrors.agree = "You must agree to be contacted.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            // Submit logic here
            alert("Form submitted!");
        }
    };
    return (
        <section className="w-full bg-[#bfe1e7] py-16 px-4 md:px-[10%] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Left: Info */}
            <div className="w-full">
                <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-semibold text-darkMain1 mb-2 text-[#1e4145]">
                        Our Office
                    </h3>
                    <div className="text-[#1e4145] mb-2 text-xl">1287 Maplewood Drive<br />Los Angeles, CA 90026</div>
                </div>
                <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-semibold text-darkMain1 mb-2 text-[#1e4145]">Office Hours</h3>
                    <div className="text-[#1e4145] mb-2 text-xl">In-person: Tue & Thu, 10 AM–6 PM</div>
                    <div className="text-[#1e4145] mb-2 text-xl">Virtual via Zoom: Mon, Wed & Fri, 1 PM–5 PM</div>
                </div>
                <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-semibold text-darkMain1 mb-2 text-[#1e4145]">Contact</h3>
                    <div className="text-[#1e4145] mb-2 text-xl">
                        <span>📞</span>
                        <span>(323) 555-0192</span>
                    </div>
                    <div className="text-[#1e4145] mb-2 text-xl">
                        <span>✉️</span>
                        <a href="mailto:serena@blakepsychology.com" className="underline hover:no-underline">serena@blakepsychology.com</a>
                    </div>
                </div>
            </div>
            {/* Right: Form */}
            <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-[#1e4145] bg-[#F5F7FA]">
                <h2 className="font-heading text-2xl font-bold mb-2 text-center text-[#144133]">Get In Touch</h2>
                <p className="text-sm text-center mb-6 text-[#144133]">Fill out the form and Serena will get back to you soon. Your information is private and secure.</p>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <label className="font-semibold text-[#1e4145]">Name
                        <input type="text" name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4145] bg-white" placeholder="Your Name" />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </label>
                    <label className="font-semibold text-[#1e4145]">Phone
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4145] bg-white" placeholder="(323) 555-0192" />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                    </label>
                    <label className="font-semibold text-[#1e4145]">Email
                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4145] bg-white" placeholder="you@example.com" />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </label>
                    <label className="font-semibold text-[#1e4145]">What brings you here?
                        <textarea name="message" value={form.message} onChange={handleChange} rows={4} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4145] resize-none bg-white" placeholder="How can I help you?" />
                        {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                    </label>
                    <label className="font-semibold text-[#1e4145]">Preferred time to reach you
                        <input type="text" name="preferredTime" value={form.preferredTime} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4145] bg-white" placeholder="e.g. Weekdays after 5pm" />
                        {errors.preferredTime && <span className="text-red-500 text-sm">{errors.preferredTime}</span>}
                    </label>
                    <label className="flex items-center gap-2 text-[#1e4145]">
                        <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} required className="accent-[#1e4145]" />
                        I agree to be contacted
                    </label>
                    {errors.agree && <span className="text-red-500 text-sm ml-1">{errors.agree}</span>}
                    <button type="submit" className="mt-2 bg-[#1e4145] text-white font-semibold rounded-md py-3 transition hover:opacity-90">Submit</button>
                </form>
            </div>
        </section>
    );
} 