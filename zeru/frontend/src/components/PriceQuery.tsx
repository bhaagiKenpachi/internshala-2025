'use client';

import { useState } from 'react';
import { priceApi, PriceResponse } from '@/services/api';

const COMMON_TOKENS = [
    { address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', name: 'USDC', symbol: 'USDC' },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', name: 'Uniswap', symbol: 'UNI' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether', symbol: 'USDT' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
];

export default function PriceQuery() {
    const [token, setToken] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [timestamp, setTimestamp] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PriceResponse | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        // Use selectedDateTime if available, otherwise use timestamp
        const finalTimestamp = selectedDateTime
            ? Math.floor(new Date(selectedDateTime).getTime() / 1000)
            : parseInt(timestamp);

        try {
            const response = await priceApi.query({
                token,
                network,
                timestamp: finalTimestamp,
            });

            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch price');
        } finally {
            setLoading(false);
        }
    };

    const handleDateTimeChange = (dateTime: string) => {
        setSelectedDateTime(dateTime);
        if (dateTime) {
            const timestamp = Math.floor(new Date(dateTime).getTime() / 1000);
            setTimestamp(timestamp.toString());
        }
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'alchemy': return 'text-green-400';
            case 'cache': return 'text-blue-400';
            case 'interpolated': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'alchemy': return '🔗';
            case 'cache': return '⚡';
            case 'interpolated': return '📊';
            default: return '❓';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Query Token Price</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Token Selection */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Token Address
                        </label>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="0x..."
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />

                            {/* Quick Token Selection */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {COMMON_TOKENS.map((t) => (
                                    <button
                                        key={t.address}
                                        type="button"
                                        onClick={() => setToken(t.address)}
                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white text-sm transition-all"
                                    >
                                        {t.symbol}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Network Selection */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Network
                        </label>
                        <select
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="ethereum">Ethereum</option>
                            <option value="polygon">Polygon</option>
                        </select>
                    </div>

                    {/* Date & Time Selection */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Date & Time
                        </label>
                        <div className="space-y-3">
                            <input
                                type="datetime-local"
                                value={selectedDateTime}
                                onChange={(e) => handleDateTimeChange(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />

                            <div className="text-white/60 text-sm">
                                {selectedDateTime && (
                                    <span>Timestamp: {Math.floor(new Date(selectedDateTime).getTime() / 1000)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timestamp (Manual Input) */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Timestamp (Unix) - Manual Input
                        </label>
                        <div className="space-y-3">
                            <input
                                type="number"
                                value={timestamp}
                                onChange={(e) => setTimestamp(e.target.value)}
                                placeholder="1721088000"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />

                            {/* Quick Timestamp Selection */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const now = Math.floor(Date.now() / 1000);
                                        setTimestamp(now.toString());
                                        setSelectedDateTime(new Date(now * 1000).toISOString().slice(0, 16));
                                    }}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white text-sm transition-all"
                                >
                                    Now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
                                        setTimestamp(oneDayAgo.toString());
                                        setSelectedDateTime(new Date(oneDayAgo * 1000).toISOString().slice(0, 16));
                                    }}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white text-sm transition-all"
                                >
                                    1 Day Ago
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const oneWeekAgo = Math.floor(Date.now() / 1000) - (7 * 86400);
                                        setTimestamp(oneWeekAgo.toString());
                                        setSelectedDateTime(new Date(oneWeekAgo * 1000).toISOString().slice(0, 16));
                                    }}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white text-sm transition-all"
                                >
                                    1 Week Ago
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const oneMonthAgo = Math.floor(Date.now() / 1000) - (30 * 86400);
                                        setTimestamp(oneMonthAgo.toString());
                                        setSelectedDateTime(new Date(oneMonthAgo * 1000).toISOString().slice(0, 16));
                                    }}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white text-sm transition-all"
                                >
                                    1 Month Ago
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token || (!timestamp && !selectedDateTime)}
                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                    >
                        {loading ? 'Querying...' : 'Query Price'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {result && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Price Result</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Price</p>
                            <p className="text-3xl font-bold text-white">${result.price.toFixed(6)}</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Source</p>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{getSourceIcon(result.source)}</span>
                                <span className={`text-lg font-medium ${getSourceColor(result.source)}`}>
                                    {result.source.charAt(0).toUpperCase() + result.source.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Timestamp</p>
                            <p className="text-white font-medium">
                                {new Date((selectedDateTime ? Math.floor(new Date(selectedDateTime).getTime() / 1000) : parseInt(timestamp)) * 1000).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 