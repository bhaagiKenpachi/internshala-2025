// pages/dashboard/fan.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

export default function FanDashboard() {
  const [followedCelebs, setFollowedCelebs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load followed celebrities from localStorage
    if (user?.role === 'fan') {
      const stored = localStorage.getItem(`followed_${user.id}`);
      if (stored) {
        const followedIds = JSON.parse(stored);
        // Fetch celebrity details for each followed ID
        Promise.all(
          followedIds.map((id: string) =>
            fetch(`http://localhost:3001/celeb/${id}`)
              .then(res => res.json())
              .catch(() => null)
          )
        ).then(celebs => {
          setFollowedCelebs(celebs.filter(Boolean));
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  if (loading) return <Layout><p className="p-6">Loading fan dashboard...</p></Layout>;

  return (
    <ProtectedRoute requiredRole="fan">
      <Layout>
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">🎤 Fan Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.email}!</p>
          </div>

          {followedCelebs.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">👥 Your Followed Celebrities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followedCelebs.map((celeb) => (
                  <div key={celeb.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">{celeb.name}</h3>
                    <p className="text-gray-600 mb-2">{celeb.category}</p>
                    <p><strong>Fanbase:</strong> {celeb.fanbaseCount?.toLocaleString()}</p>
                    <p><strong>Country:</strong> {celeb.country}</p>
                    {celeb.instagramUrl && (
                      <p className="mt-2">
                        <a
                          href={celeb.instagramUrl}
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Instagram →
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-4">No Followed Celebrities Yet</h2>
              <p className="text-gray-600 mb-4">Start following celebrities to see them here!</p>
              <a
                href="/"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Celebrities
              </a>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
