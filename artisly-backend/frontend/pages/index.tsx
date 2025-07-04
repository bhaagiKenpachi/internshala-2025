import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [celebs, setCelebs] = useState([]);
  const [followedCelebs, setFollowedCelebs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:3001/celeb")
      .then((res) => res.json())
      .then(setCelebs);
  }, []);

  // Load followed celebrities for fans from localStorage
  useEffect(() => {
    if (user?.role === 'fan') {
      const stored = localStorage.getItem(`followed_${user.id}`);
      if (stored) {
        const followedIds = new Set(JSON.parse(stored));
        setFollowedCelebs(followedIds as Set<string>);
      }
    }
  }, [user]);

  const handleFollow = async (celebId: string) => {
    if (!user || user.role !== 'fan') return;

    setLoading(prev => ({ ...prev, [celebId]: true }));

    try {
      const isFollowed = followedCelebs.has(celebId);

      if (isFollowed) {
        // Unfollow
        setFollowedCelebs(prev => {
          const newSet = new Set(prev);
          newSet.delete(celebId);
          return newSet;
        });
        localStorage.setItem(`followed_${user.id}`, JSON.stringify(Array.from(followedCelebs).filter(id => id !== celebId)));
      } else {
        // Follow
        setFollowedCelebs(prev => new Set(Array.from(prev).concat(celebId)));
        localStorage.setItem(`followed_${user.id}`, JSON.stringify(Array.from(followedCelebs).concat(celebId)));
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
    } finally {
      setLoading(prev => ({ ...prev, [celebId]: false }));
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🌟 All Celebrities</h1>
        {user && (
          <p className="text-gray-600">
            Welcome back, {user.email}!
            {user.role === 'fan' && ' Discover and follow your favorite celebrities.'}
            {user.role === 'celebrity' && ' Manage your profile and track your engagement.'}
          </p>
        )}
        {!user && (
          <p className="text-gray-600">
            Discover amazing celebrities and join our community!
          </p>
        )}
      </div>
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

              {/* Action Buttons */}
              <div className="mt-3 flex justify-between items-center">
                <Link
                  href={`/celebrity/${celeb.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View More →
                </Link>

                {/* Follow Button - Only show for logged-in fans */}
                {user?.role === 'fan' && (
                  <button
                    onClick={() => handleFollow(celeb.id)}
                    disabled={loading[celeb.id]}
                    className={`px-3 py-1 text-sm rounded-full font-medium transition-colors ${followedCelebs.has(celeb.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                      } ${loading[celeb.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading[celeb.id] ? '...' : followedCelebs.has(celeb.id) ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
