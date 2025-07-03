// pages/dashboard/fan.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function FanDashboard() {
  const [celeb, setCeleb] = useState<any>(null);
  const celebId = 1; // simulated followed celebrity

  useEffect(() => {
    fetch(`http://localhost:3001/celeb/${celebId}`)
      .then(res => res.json())
      .then(setCeleb);
  }, []);

  
  if (!celeb) return <p className="p-6">Loading fan dashboard...</p>;

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-6">🎤 Fan Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold">{celeb.name}</h2>
            <p><strong>Category:</strong> {celeb.category}</p>
            <p><strong>Fanbase:</strong> {celeb.fanbaseCount?.toLocaleString()}</p>
            <p><strong>Country:</strong> {celeb.country}</p>
            <p><strong>Instagram:</strong> <a href={celeb.instagramUrl} className="text-blue-600 underline" target="_blank">{celeb.instagramUrl}</a></p>
            <p><strong>Profile Visits:</strong> {celeb.profileViews?.toLocaleString()}</p>
          </div>
        </div>

        {celeb.highlights?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📰 Recent Events</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {celeb.highlights.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
