import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  const [celebs, setCelebs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/celeb")
      .then((res) => res.json())
      .then(setCelebs);
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">🌟 All Celebrities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {celebs.map((celeb: any) => (
          <div
            key={celeb.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {celeb.thumbnailUrl && (
              <img
                src={celeb.thumbnailUrl}
                alt={celeb.name}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {celeb.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                🎭 Category:{" "}
                <span className="font-medium">{celeb.category}</span>
              </p>
              <p className="text-sm text-gray-600">
                🌍 Country: <span className="font-medium">{celeb.country}</span>
              </p>
              <p className="text-sm text-gray-600">
                👥 Fanbase:{" "}
                <span className="font-medium">
                  {celeb.fanbaseCount.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-blue-600 mt-1 truncate">
                📸 Instagram:{" "}
                <a
                  href={celeb.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {celeb.instagramUrl}
                </a>
              </p>

              {/* 👉 View More Button */}
              <div className="mt-3 text-right">
                <Link
                  href={`/celebrity/${celeb.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
