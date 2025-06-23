"use client";

import { useState } from "react";

type ArtistSubmission = {
    id: number;
    name: string;
    category: string;
    location: string;
    fee: string;
    status: string;
    submittedAt: string;
};

type DashboardTableProps = {
    artists: ArtistSubmission[];
    onStatusChange: (id: number, newStatus: string) => void;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Approved":
            return "bg-green-100 text-green-800";
        case "Pending":
            return "bg-yellow-100 text-yellow-800";
        case "Under Review":
            return "bg-blue-100 text-blue-800";
        case "Rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function DashboardTable({ artists, onStatusChange }: DashboardTableProps) {
    const [selectedArtist, setSelectedArtist] = useState<number | null>(null);

    const handleAction = (id: number, action: string) => {
        onStatusChange(id, action);
        setSelectedArtist(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Artist Submissions</h3>
                <p className="text-sm text-gray-600">Manage artist applications and their status</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Artist
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fee Range
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-semibold text-sm">
                                                {artist.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{artist.category}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{artist.location}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-green-600">{artist.fee}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(artist.status)}`}>
                                        {artist.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(artist.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="relative">
                                        <button
                                            onClick={() => setSelectedArtist(selectedArtist === artist.id ? null : artist.id)}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Actions
                                        </button>
                                        {selectedArtist === artist.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleAction(artist.id, "Approved")}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(artist.id, "Under Review")}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Mark for Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(artist.id, "Rejected")}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {artists.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl text-gray-600 mb-2">No submissions yet</p>
                    <p className="text-gray-500">Artist applications will appear here once submitted.</p>
                </div>
            )}
        </div>
    );
} 