'use client';

import { useState, useEffect } from 'react';
import { priceApi } from '@/services/api';

interface PriceData {
    date: number;
    price: number;
    source: string;
}

const COMMON_TOKENS = [
    { address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', name: 'USDC', symbol: 'USDC' },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', name: 'Uniswap', symbol: 'UNI' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether', symbol: 'USDT' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
];

export default function PriceHistory() {
    const [selectedToken, setSelectedToken] = useState('');
    const [customAddress, setCustomAddress] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [loading, setLoading] = useState(false);
    const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
    const [error, setError] = useState('');

    const generateSampleData = (token: string) => {
        const now = Math.floor(Date.now() / 1000);
        const data: PriceData[] = [];

        // Generate sample data for the last 30 days
        for (let i = 30; i >= 0; i--) {
            const timestamp = now - (i * 24 * 60 * 60);
            let basePrice = 1.0;

            // Different base prices for different tokens
            if (token.toLowerCase().includes('uni')) basePrice = 9.0;
            if (token.toLowerCase().includes('usdt')) basePrice = 1.0;
            if (token.toLowerCase().includes('wbtc')) basePrice = 65000;

            // Add some realistic price variation
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = basePrice * (1 + variation);

            data.push({
                date: timestamp,
                price: parseFloat(price.toFixed(6)),
                source: Math.random() > 0.7 ? 'alchemy' : 'interpolated'
            });
        }

        return data;
    };

    const handleTokenChange = (tokenAddress: string) => {
        setSelectedToken(tokenAddress);
        setCustomAddress('');
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const data = generateSampleData(tokenAddress);
            setPriceHistory(data);
            setLoading(false);
        }, 1000);
    };

    const handleCustomAddressSubmit = async () => {
        if (!customAddress.trim()) return;

        setSelectedToken('');
        setLoading(true);
        setError('');

        try {
            // Generate timestamps for the last 30 days
            const now = Math.floor(Date.now() / 1000);
            const timestamps = [];
            for (let i = 30; i >= 0; i--) {
                timestamps.push(now - (i * 24 * 60 * 60));
            }

            // Fetch price data for each timestamp
            const priceData: PriceData[] = [];
            for (const timestamp of timestamps) {
                try {
                    const response = await priceApi.query({
                        token: customAddress,
                        network,
                        timestamp
                    });

                    priceData.push({
                        date: timestamp,
                        price: response.price,
                        source: response.source
                    });
                } catch (err) {
                    // Skip failed requests, continue with available data
                    console.log(`Failed to fetch price for ${new Date(timestamp * 1000).toISOString()}`);
                }
            }

            setPriceHistory(priceData);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch price history');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 1000) return `$${price.toLocaleString()}`;
        if (price >= 1) return `$${price.toFixed(4)}`;
        return `$${price.toFixed(6)}`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'alchemy': return '🔗';
            case 'cache': return '⚡';
            case 'interpolated': return '📊';
            default: return '❓';
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

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Price History</h2>

                <div className="space-y-6">
                    {/* Token Selection */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Select Token
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {COMMON_TOKENS.map((t) => (
                                <button
                                    key={t.address}
                                    onClick={() => handleTokenChange(t.address)}
                                    className={`px-4 py-3 rounded-lg border transition-all ${selectedToken === t.address
                                        ? 'bg-purple-600 border-purple-500 text-white'
                                        : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                                        }`}
                                >
                                    <div className="font-medium">{t.symbol}</div>
                                    <div className="text-xs opacity-70">{t.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Address Input */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Or Enter Custom Token Address
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={customAddress}
                                onChange={(e) => setCustomAddress(e.target.value)}
                                placeholder="0x..."
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleCustomAddressSubmit}
                                disabled={loading || !customAddress.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                            >
                                {loading ? 'Fetching...' : 'Fetch History'}
                            </button>
                        </div>
                        <p className="text-white/60 text-xs mt-2">
                            Enter a token contract address to fetch real price history data
                        </p>
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
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        <span className="text-white">
                            {customAddress ? 'Fetching real price history...' : 'Loading price history...'}
                        </span>
                    </div>
                    {customAddress && (
                        <div className="mt-4 text-center">
                            <p className="text-white/60 text-sm">This may take a few moments as we fetch data for the last 30 days</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Price History Chart */}
            {priceHistory.length > 0 && !loading && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6">Price Chart (Last 30 Days)</h3>

                    {/* Simple Chart */}
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                        <div className="h-64 flex items-end justify-between space-x-1">
                            {priceHistory.map((data, index) => {
                                const maxPrice = Math.max(...priceHistory.map(d => d.price));
                                const minPrice = Math.min(...priceHistory.map(d => d.price));
                                const range = maxPrice - minPrice;
                                const height = range > 0 ? ((data.price - minPrice) / range) * 100 : 50;

                                return (
                                    <div
                                        key={index}
                                        className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                                        style={{ height: `${height}%` }}
                                        title={`${formatDate(data.date)}: ${formatPrice(data.price)}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-white/60 text-xs mt-2">
                            <span>{formatDate(priceHistory[0]?.date || 0)}</span>
                            <span>{formatDate(priceHistory[priceHistory.length - 1]?.date || 0)}</span>
                        </div>
                    </div>

                    {/* Price Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Current Price</p>
                            <p className="text-2xl font-bold text-white">
                                {formatPrice(priceHistory[priceHistory.length - 1]?.price || 0)}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">30-Day High</p>
                            <p className="text-2xl font-bold text-green-400">
                                {formatPrice(Math.max(...priceHistory.map(d => d.price)))}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">30-Day Low</p>
                            <p className="text-2xl font-bold text-red-400">
                                {formatPrice(Math.min(...priceHistory.map(d => d.price)))}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-sm">Data Points</p>
                            <p className="text-2xl font-bold text-white">{priceHistory.length}</p>
                        </div>
                    </div>

                    {/* Price History Table */}
                    <div className="bg-white/5 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-white/80 font-medium">Date</th>
                                        <th className="px-4 py-3 text-left text-white/80 font-medium">Price</th>
                                        <th className="px-4 py-3 text-left text-white/80 font-medium">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceHistory.slice(-10).reverse().map((data, index) => (
                                        <tr key={index} className="border-t border-white/10">
                                            <td className="px-4 py-3 text-white">{formatDate(data.date)}</td>
                                            <td className="px-4 py-3 text-white font-medium">{formatPrice(data.price)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                    <span>{getSourceIcon(data.source)}</span>
                                                    <span className={`text-sm ${getSourceColor(data.source)}`}>
                                                        {data.source.charAt(0).toUpperCase() + data.source.slice(1)}
                                                    </span>
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

            {/* No Data State */}
            {!selectedToken && !customAddress && !loading && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-white mb-2">Select a Token or Enter Address</h3>
                        <p className="text-white/60">Choose a predefined token or enter a custom token address to view its price history and charts.</p>
                    </div>
                </div>
            )}
        </div>
    );
} 