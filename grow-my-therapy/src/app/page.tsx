import Hero from "@/components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import FAQ from "../components/FAQ";
import ContactUs from "../components/ContactUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />
      <Services />
      <FAQ />
      <ContactUs />
    </div>
  );
}
