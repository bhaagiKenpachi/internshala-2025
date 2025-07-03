// pages/celebrity/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function CelebrityProfile() {
  const { query } = useRouter();
  const [celeb, setCeleb] = useState<any>(null);

  useEffect(() => {
    if (query.id) {
      fetch(`http://localhost:3001/celeb/${query.id}`)
        .then((res) => res.json())
        .then(setCeleb);
    }
  }, [query.id]);

  if (!celeb) return <p className="p-6">Loading...</p>;

  function getMockEvents(name: string) {
    const events = {
      "Diljit Dosanjh": [
        "🎤 Live at Coachella 2024",
        "📀 New Punjabi Album 'Born to Shine'",
        "📰 Featured in Rolling Stone India",
      ],
      Shakira: [
        "🎬 Super Bowl 2025 Performance",
        "📀 New Album 'Power Latina'",
        "🎤 Live at MTV Europe Awards",
      ],
      Naveen: [
        "🎤 Performed at Delhi Indie Fest",
        "📺 Interviewed on IndieWave Podcast",
        "📀 Released Debut EP: 'Echoes of Home'",
      ],
      default: [
        "🎤 Live performance at Global Music Fest",
        "📀 New album hit 1M streams",
        "🎬 Featured in a music documentary",
      ],
    };
    return events[name] || events["default"];
  }

  const events = getMockEvents(celeb.name);

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
        <img
          src={celeb.thumbnailUrl}
          alt={celeb.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{celeb.name}</h1>
        <p>
          <strong>Category:</strong> {celeb.category}
        </p>
        <p>
          <strong>Country:</strong> {celeb.country}
        </p>
        <p>
          <strong>Fanbase:</strong> {celeb.fanbaseCount.toLocaleString()}
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a
            href={celeb.instagramUrl}
            target="_blank"
            className="text-blue-600 underline"
          >
            {celeb.instagramUrl}
          </a>
        </p>

        {/* Secondary Platform Data */}
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">
            📰 Recent Performances & Social Stats
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {events.map((event, idx) => (
              <li key={idx}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
