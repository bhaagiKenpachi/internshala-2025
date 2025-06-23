"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ArtistCard from "@/components/ArtistCard";
import FilterBlock from "@/components/FilterBlock";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadBrowseArtists, setFilters } from "@/store/artistsSlice";

function ArtistsPageContent() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const { browseArtists, filters, loading, error } = useAppSelector((state) => state.artists);

    useEffect(() => {
        dispatch(loadBrowseArtists());
    }, [dispatch]);

    // Apply category filter from query param on mount
    useEffect(() => {
        const category = searchParams.get("category");
        if (category) {
            dispatch(setFilters({ category }));
        }
    }, [dispatch, searchParams]);

    const handleFilterChange = (filterType: string, value: string) => {
        dispatch(setFilters({ [filterType]: value }));
    };

    const handleReset = () => {
        dispatch(setFilters({ category: "All", location: "All", priceRange: "All" }));
    };

    const filteredArtists = browseArtists.filter(artist => {
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

    if (loading) {
        return (
            <div className="py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading artists...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <div className="text-center">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Browse Artists</h1>
                <p className="text-lg text-gray-600">Discover talented performers for your next event</p>
            </div>
            <FilterBlock filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.id} {...artist} />
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

export default function ArtistsPage() {
    return (
        <Suspense fallback={
            <div className="py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ArtistsPageContent />
        </Suspense>
    );
} 