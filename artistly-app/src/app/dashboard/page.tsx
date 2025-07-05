"use client";

import { useEffect } from "react";
import DashboardTable from "@/components/DashboardTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadSubmittedArtists, loadBrowseArtists, updateArtistStatus } from "@/store/artistsSlice";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { submittedArtists, browseArtists, loading, error } = useAppSelector((state) => state.artists);

    useEffect(() => {
        dispatch(loadSubmittedArtists());
        dispatch(loadBrowseArtists());
    }, [dispatch]);

    const handleStatusChange = (id: number, newStatus: string) => {
        dispatch(updateArtistStatus({ id, status: newStatus }));
    };

    // Filter to show only accepted artists from browseArtists
    const acceptedArtists = browseArtists.filter(artist => artist.status === 'Approved');

    const stats = {
        total: submittedArtists.length,
        pending: submittedArtists.filter(a => a.status === "Pending").length,
        approved: submittedArtists.filter(a => a.status === "Approved").length,
        underReview: submittedArtists.filter(a => a.status === "Under Review").length,
        accepted: acceptedArtists.length,
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Manager Dashboard</h1>
                <p className="text-lg text-gray-600">Manage artist submissions and booking requests.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-purple-600 text-xl">🎭</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Accepted Artists</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accepted Artists Section */}
            {acceptedArtists.length > 0 && (
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Accepted Artists</h3>
                            <p className="text-sm text-gray-600">Artists who have been accepted and are available for booking</p>
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
                                            Accepted By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Accepted Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {acceptedArtists.map((artist) => (
                                        <tr key={artist.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-green-600 font-semibold text-sm">
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
                                                <span className="text-sm font-medium text-green-600">{artist.price}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{artist.acceptedBy}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(artist.acceptedAt || '').toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs truncate" title={artist.notes}>
                                                    {artist.notes || "No notes"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Table */}
            <DashboardTable artists={submittedArtists} onStatusChange={handleStatusChange} />
        </div>
    );
} 