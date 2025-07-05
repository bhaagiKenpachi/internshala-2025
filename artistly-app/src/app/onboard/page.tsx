import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardPage() {
    return (
        <div className="py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Artist Onboarding</h1>
                <p className="text-lg text-gray-600">Join our platform and showcase your talent to event planners worldwide.</p>
            </div>
            <OnboardingForm />
        </div>
    );
} 