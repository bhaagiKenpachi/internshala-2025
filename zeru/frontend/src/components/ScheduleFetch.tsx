'use client';

import { useState } from 'react';
import { scheduleApi, ScheduleResponse } from '@/services/api';

const COMMON_TOKENS = [
    { address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', name: 'USDC', symbol: 'USDC' },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', name: 'Uniswap', symbol: 'UNI' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether', symbol: 'USDT' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
];

export default function ScheduleFetch() {
    const [token, setToken] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScheduleResponse | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await scheduleApi.schedule({
                token,
                network,
            });

            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to schedule fetch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Schedule Historical Data Fetch</h2>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-400 text-xl">ℹ️</div>
                        <div>
                            <h3 className="text-blue-400 font-medium mb-2">How it works</h3>
                            <p className="text-blue-300 text-sm">
                                Schedule a background job to fetch historical price data for a token.
                                The worker will fetch prices from the token's creation date to the present,
                                storing them in the database for future queries and interpolation.
                            </p>
                        </div>
                    </div>
                </div>

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

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                    >
                        {loading ? 'Scheduling...' : 'Schedule Fetch'}
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
                    <h3 className="text-xl font-bold text-white mb-4">Schedule Result</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Status</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-white font-medium capitalize">{result.status}</p>
                            </div>
                        </div>

                        {result.jobId && (
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/60 text-sm">Job ID</p>
                                <p className="text-white font-mono text-sm mt-1">{result.jobId}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <div className="text-green-400 text-xl">✅</div>
                            <div>
                                <h4 className="text-green-400 font-medium mb-1">Job Scheduled Successfully</h4>
                                <p className="text-green-300 text-sm">
                                    The background worker will now fetch historical price data for this token.
                                    You can query prices while the data is being fetched, and interpolation will
                                    be available once enough data points are collected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Worker Status */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Worker Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/60 text-sm">Status</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-white font-medium">Active</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/60 text-sm">Queue</p>
                        <p className="text-white font-medium">BullMQ</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/60 text-sm">Processing</p>
                        <p className="text-white font-medium">Last 7 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 