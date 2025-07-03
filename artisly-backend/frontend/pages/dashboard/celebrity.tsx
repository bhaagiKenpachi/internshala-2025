// pages/dashboard/celebrity.tsx
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function CelebrityDashboard() {
  const [celeb, setCeleb] = useState<any>(null);

  const celebId = 1; // simulate logged-in celebrity ID

  useEffect(() => {
    fetch(`http://localhost:3001/celeb/${celebId}`)
      .then((res) => res.json())
      .then(setCeleb);
  }, []);

  if (!celeb) return <p className="p-6">Loading dashboard...</p>;

 

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-6">📊 Celebrity Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-2">🙌 Fanbase</h2>
            <p>{celeb.fanbaseCount.toLocaleString()} fans</p>
          </div>

          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-2">👁️ Profile Views</h2>
            <p>{celeb.profileViews.toLocaleString()} views</p>
          </div>

          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-2">📈 Engagement</h2>
            <p>👍 Likes: {celeb.engagements?.likes}</p>
            <p>💬 Comments: {celeb.engagements?.comments}</p>
            <p>🔄 Shares: {celeb.engagements?.shares}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📰 Recent Highlights</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {celeb.highlights?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
       
      </div>
    </Layout>
  );
}
