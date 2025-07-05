import React from "react";

const services = [
  {
    title: "Anxiety & Stress Management",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description:
      "Learn effective strategies to manage anxiety and stress, regain control over your thoughts, and find peace in your daily life. Together, we will develop personalized coping mechanisms and mindfulness techniques to help you thrive.",
  },
  {
    title: "Relationship Counseling",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    description:
      "Strengthen your relationships and improve communication with your loved ones. Whether you are facing challenges as a couple or within your family, I provide a supportive space to foster understanding and connection.",
  },
  {
    title: "Trauma Recovery",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    description:
      "Begin your journey of healing from past trauma in a safe and compassionate environment. We will work together to process difficult experiences, build resilience, and restore hope for the future.",
  },
];

const Services = () => {
  return (
    <section
      className="w-full relative p-4 py-12 md:py-16 lg:py-28 md:px-[10%] bg-[#f6f8fa] md:bg-no-repeat md:bg-[length:auto_300px] md:bg-[position:right_2rem_bottom] md:pr-32"
      style={{ backgroundImage: "url('/plant.webp')" }}
    >
      <div className="max-w-6xl w-full">
        <h2 className="font-bold mb-12 text-3xl md:text-4xl xl:text-6xl text-[#1e4145] pb-4 flex gap-2 items-center">
          How I Help
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-[#bfe1e7] border border-gray-400 rounded-xl shadow-md flex flex-col p-6 h-full"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-44 object-cover rounded-md mb-4"
              />

              <h3 className="font-bold text-xl text-[#1e4145] mb-2">
                {service.title}
              </h3>

              {/* Growable content */}
              <p className="text-[#1e4145] text-base font-medium font-sans leading-snug mb-4 flex-grow">
                {service.description}
              </p>

              {/* Push to bottom */}
              <div className="mt-auto">
                <button className="w-full border border-[#1e4145] text-[#1e4145] py-2 rounded-md hover:bg-white transition-colors text-sm font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
