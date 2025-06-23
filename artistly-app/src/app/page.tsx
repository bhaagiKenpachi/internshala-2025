import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Singers", icon: "🎤", description: "Vocal performers" },
  { name: "Dancers", icon: "💃", description: "Dance artists" },
  { name: "Speakers", icon: "🎤", description: "Public speakers" },
  { name: "DJs", icon: "🎧", description: "Music DJs" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center py-12 gap-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
          Welcome to <span className="text-blue-600">Artistly.com</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          The premier platform connecting Event Planners and Artist Managers.
          Discover, connect, and book top performing artists for your next event.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/artists"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg hover:shadow-xl"
          >
            Explore Artists
          </Link>
          <Link
            href="/onboard"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 font-semibold text-lg"
          >
            Join as Artist
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Artist Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mx-auto">
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <h3 className="font-bold text-xl text-gray-900 text-center mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-center text-sm">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Why Choose Artistly?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Easy Discovery</h3>
            <p className="text-gray-600">Find the perfect artist for your event with our advanced filtering system.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🤝</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Direct Connection</h3>
            <p className="text-gray-600">Connect directly with artists and managers without intermediaries.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">All artists are verified and reviewed for quality assurance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
