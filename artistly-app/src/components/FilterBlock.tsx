type FilterBlockProps = {
    filters: {
        category: string;
        location: string;
        priceRange: string;
    };
    onFilterChange: (filterType: string, value: string) => void;
    onReset: () => void;
};

export default function FilterBlock({ filters, onFilterChange, onReset }: FilterBlockProps) {
    const categories = ["All", "Singer", "Dancer", "Speaker", "DJ"];
    const locations = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Goa"];
    const priceRanges = ["All", "$300 - $500", "$500 - $800", "$800 - $1200"];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-gray-900">Filter Artists</h3>
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                >
                    <span>🔄</span>
                    Reset Filters
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => onFilterChange("category", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <select
                        value={filters.location}
                        onChange={(e) => onFilterChange("location", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                    >
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => onFilterChange("priceRange", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                    >
                        {priceRanges.map((price) => (
                            <option key={price} value={price}>{price}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
} 