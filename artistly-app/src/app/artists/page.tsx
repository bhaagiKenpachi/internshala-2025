"use client";

import { useState } from "react";
import ArtistCard from "@/components/ArtistCard";
import FilterBlock from "@/components/FilterBlock";
import artists from "@/data/artists.json";

export default function ArtistsPage() {
    const [filters, setFilters] = useState({
        category: "All",
        location: "All",
        priceRange: "All"
    });

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const filteredArtists = artists.filter(artist => {
        const categoryMatch = filters.category === "All" || artist.category === filters.category;
        const locationMatch = filters.location === "All" || artist.location === filters.location;

        // Price range filtering logic
        let priceMatch = true;
        if (filters.priceRange !== "All") {
            const artistPrice = artist.price;
            const [minPrice, maxPrice] = filters.priceRange.split(" - ");
            const artistMin = parseInt(artistPrice.split(" - ")[0].replace("$", ""));
            const artistMax = parseInt(artistPrice.split(" - ")[1].replace("$", ""));
            const filterMin = parseInt(minPrice.replace("$", ""));
            const filterMax = parseInt(maxPrice.replace("$", ""));

            priceMatch = artistMin >= filterMin && artistMax <= filterMax;
        }

        return categoryMatch && locationMatch && priceMatch;
    });

    return (
        <div className="py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Browse Artists</h1>
                <p className="text-lg text-gray-600">Discover talented performers for your next event</p>
            </div>
            <FilterBlock filters={filters} onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArtists.map((artist, idx) => (
                    <ArtistCard key={idx} {...artist} />
                ))}
            </div>
            {filteredArtists.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-600 mb-2">No artists found</p>
                    <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
            )}
        </div>
    );
} 