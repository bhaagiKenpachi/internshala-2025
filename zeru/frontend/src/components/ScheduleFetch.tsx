'use client';

import { useState, useEffect } from 'react';
import { scheduleApi, ScheduleResponse, JobListResponse, JobStatusResponse } from '@/services/api';

const COMMON_TOKENS = [
    { address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', name: 'USDC', symbol: 'USDC' },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', name: 'Uniswap', symbol: 'UNI' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether', symbol: 'USDT' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
];

const JOB_STATE_COLORS = {
    waiting: 'bg-yellow-500',
    active: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    delayed: 'bg-orange-500',
    cancelled: 'bg-gray-500',
};

const JOB_STATE_LABELS = {
    waiting: 'Waiting',
    active: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
};

export default function ScheduleFetch() {
    const [token, setToken] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScheduleResponse | null>(null);
    const [error, setError] = useState('');

    // Jobs state
    const [jobs, setJobs] = useState<JobStatusResponse[]>([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [jobsError, setJobsError] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // Load jobs on component mount and after scheduling
    useEffect(() => {
        loadJobs();
    }, [page]);

    const loadJobs = async () => {
        setJobsLoading(true);
        setJobsError('');
        try {
            const response = await scheduleApi.listJobs(page, limit);
            setJobs(response.jobs);
        } catch (err: any) {
            setJobsError(err.response?.data?.error || 'Failed to load jobs');
        } finally {
            setJobsLoading(false);
        }
    };

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
            // Reload jobs after scheduling
            loadJobs();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to schedule fetch');
        } finally {
            setLoading(false);
        }
    };

    const handleStopJob = async (jobId: string) => {
        try {
            await scheduleApi.stop(jobId);
            // Reload jobs after stopping
            loadJobs();
        } catch (err: any) {
            console.error('Failed to stop job:', err);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const getTokenSymbol = (address: string) => {
        const token = COMMON_TOKENS.find(t => t.address.toLowerCase() === address.toLowerCase());
        return token ? token.symbol : address.slice(0, 8) + '...';
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

            {/* All Jobs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">All Scheduled Jobs</h3>
                    <button
                        onClick={loadJobs}
                        disabled={jobsLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all"
                    >
                        {jobsLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {jobsError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <p className="text-red-400">{jobsError}</p>
                    </div>
                )}

                {jobsLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="text-white/60 mt-2">Loading jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-white/60">No jobs found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job.jobId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${JOB_STATE_COLORS[job.state as keyof typeof JOB_STATE_COLORS] || 'bg-gray-500'}`}></div>
                                        <span className="text-white font-medium">
                                            {JOB_STATE_LABELS[job.state as keyof typeof JOB_STATE_LABELS] || job.state}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white/60 text-sm">ID: {job.jobId}</span>
                                        {(job.state === 'waiting' || job.state === 'active' || job.state === 'delayed') && (
                                            <button
                                                onClick={() => handleStopJob(job.jobId)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-all"
                                            >
                                                Stop
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-white/60">Token</p>
                                        <p className="text-white font-mono">{getTokenSymbol(job.data.token)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60">Network</p>
                                        <p className="text-white capitalize">{job.data.network}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60">Created</p>
                                        <p className="text-white">{formatDate(job.createdAt)}</p>
                                    </div>
                                </div>

                                {job.state === 'active' && job.progress !== undefined && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white/60">Progress</span>
                                            <span className="text-white">{Math.round(job.progress)}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{ width: `${job.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {job.finishedOn && (
                                    <div className="mt-3 text-sm">
                                        <p className="text-white/60">Finished</p>
                                        <p className="text-white">{formatDate(job.finishedOn)}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-all"
                    >
                        Previous
                    </button>
                    <span className="text-white/60">Page {page}</span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={jobs.length < limit}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>

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
                        <p className="text-white/60 text-sm">Total Jobs</p>
                        <p className="text-white font-medium">{jobs.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 