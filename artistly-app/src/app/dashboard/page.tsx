"use client";

import { useState, useEffect } from "react";
import DashboardTable from "@/components/DashboardTable";
import submittedArtists from "@/data/submittedArtists.json";

type ArtistSubmission = {
    id: number;
    name: string;
    category: string;
    location: string;
    fee: string;
    status: string;
    submittedAt: string;
    bio?: string;
    languages?: string[];
    imageUrl?: string;
};

export default function DashboardPage() {
    const [artists, setArtists] = useState<ArtistSubmission[]>([]);

    useEffect(() => {
        // Load static data
        const staticData = submittedArtists;

        // Load data from localStorage
        const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');

        // Combine both data sources
        const combinedData = [...localStorageData, ...staticData];

        setArtists(combinedData);
    }, []);

    const handleStatusChange = (id: number, newStatus: string) => {
        setArtists(prev =>
            prev.map(artist =>
                artist.id === id ? { ...artist, status: newStatus } : artist
            )
        );

        // Update localStorage if the artist was from localStorage
        const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
        const updatedLocalStorageData = localStorageData.map((artist: ArtistSubmission) =>
            artist.id === id ? { ...artist, status: newStatus } : artist
        );
        localStorage.setItem('artistSubmissions', JSON.stringify(updatedLocalStorageData));
    };

    const stats = {
        total: artists.length,
        pending: artists.filter(a => a.status === "Pending").length,
        approved: artists.filter(a => a.status === "Approved").length,
        underReview: artists.filter(a => a.status === "Under Review").length,
    };

    return (
        <div className="py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Manager Dashboard</h1>
                <p className="text-lg text-gray-600">Manage artist submissions and booking requests.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-blue-600 text-xl">📊</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-yellow-600 text-xl">⏳</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-green-600 text-xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-blue-600 text-xl">🔍</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Under Review</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Table */}
            <DashboardTable artists={artists} onStatusChange={handleStatusChange} />
        </div>
    );
} 