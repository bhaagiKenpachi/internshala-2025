"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup.object({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    bio: yup.string().required("Bio is required").min(10, "Bio must be at least 10 characters"),
    categories: yup.array().min(1, "Please select at least one category").required(),
    languages: yup.array().min(1, "Please select at least one language").required(),
    feeRange: yup.string().required("Fee range is required"),
    location: yup.string().required("Location is required"),
    imageUrl: yup.string().default(undefined)
});

const categories = ["Singer", "Dancer", "Speaker", "DJ", "Comedian", "Magician"];
const languages = ["English", "Hindi", "Spanish", "French", "German", "Chinese", "Japanese"];
const feeRanges = ["$100 - $300", "$300 - $500", "$500 - $800", "$800 - $1200", "$1200+"];

export default function OnboardingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categories: [],
            languages: []
        }
    });

    const watchedCategories = watch("categories") || [];
    const watchedLanguages = watch("languages") || [];

    const handleCategoryChange = (category: string) => {
        const newCategories = watchedCategories.includes(category)
            ? watchedCategories.filter(c => c !== category)
            : [...watchedCategories, category];
        setValue("categories", newCategories);
    };

    const handleLanguageChange = (language: string) => {
        const newLanguages = watchedLanguages.includes(language)
            ? watchedLanguages.filter(l => l !== language)
            : [...watchedLanguages, language];
        setValue("languages", newLanguages);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveToDashboard = (data: any) => {
        // Get existing submissions from localStorage
        const existingSubmissions = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');

        // Create new submission
        const newSubmission = {
            id: Date.now(), // Simple ID generation
            name: data.name,
            category: data.categories[0], // Use first category for display
            location: data.location,
            fee: data.feeRange,
            status: "Pending",
            submittedAt: new Date().toISOString().split('T')[0],
            bio: data.bio,
            languages: data.languages,
            imageUrl: data.imageUrl
        };

        // Add to existing submissions
        const updatedSubmissions = [newSubmission, ...existingSubmissions];

        // Save back to localStorage
        localStorage.setItem('artistSubmissions', JSON.stringify(updatedSubmissions));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to dashboard
        saveToDashboard(data);

        console.log("Form submitted:", data);
        setSubmitSuccess(true);
        setIsSubmitting(false);
        reset(); // Reset form after successful submission
    };

    if (submitSuccess) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg p-8">
                <div className="text-green-500 text-8xl mb-6">✓</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Application Submitted!</h2>
                <p className="text-lg text-gray-600 mb-8">Thank you for your interest in joining Artistly.com. We&apos;ll review your application and get back to you soon.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setSubmitSuccess(false)}
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                        Submit Another Application
                    </button>
                    <a
                        href="/dashboard"
                        className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold text-lg border border-gray-300"
                    >
                        View Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name *</label>
                    <input
                        {...register("name")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Bio *</label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium resize-none"
                        placeholder="Tell us about yourself, your experience, and what makes you unique..."
                    />
                    {errors.bio && <p className="text-red-500 text-sm mt-2 font-medium">{errors.bio.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Performance Categories *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((category) => (
                            <label key={category} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={watchedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-900">{category}</span>
                            </label>
                        ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-sm mt-2 font-medium">{errors.categories.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Languages Spoken *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {languages.map((language) => (
                            <label key={language} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={watchedLanguages.includes(language)}
                                    onChange={() => handleLanguageChange(language)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-900">{language}</span>
                            </label>
                        ))}
                    </div>
                    {errors.languages && <p className="text-red-500 text-sm mt-2 font-medium">{errors.languages.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Fee Range *</label>
                    <select
                        {...register("feeRange")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                    >
                        <option value="">Select your fee range</option>
                        {feeRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>
                    {errors.feeRange && <p className="text-red-500 text-sm mt-2 font-medium">{errors.feeRange.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Location *</label>
                    <input
                        {...register("location")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="Enter your city"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-2 font-medium">{errors.location.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Image URL (Optional)</label>
                    <input
                        {...register("imageUrl")}
                        type="url"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="https://example.com/your-profile-image.jpg"
                    />
                    {errors.imageUrl && <p className="text-red-500 text-sm mt-2 font-medium">{errors.imageUrl.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </form>
        </div>
    );
} 