type ArtistCardProps = {
    name: string;
    category: string;
    price: string;
    location: string;
    imageUrl?: string;
};

export default function ArtistCard({ name, category, price, location, imageUrl }: ArtistCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 w-full max-w-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-2 overflow-hidden border-4 border-white shadow-lg">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <span className="text-4xl">🎤</span>
                )}
            </div>
            <div className="text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-1">{name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-1">{category}</p>
                <p className="text-gray-600 text-sm mb-2">{location}</p>
                <p className="text-green-600 font-semibold text-lg">{price}</p>
            </div>
            <button className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg w-full">
                Ask for Quote
            </button>
        </div>
    );
} 