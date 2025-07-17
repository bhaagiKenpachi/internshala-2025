import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface PriceResponse {
    price: number;
    source: 'cache' | 'alchemy' | 'interpolated';
}

export interface ScheduleResponse {
    status: string;
    jobId?: string;
}

export interface JobStatusResponse {
    jobId: string;
    state: string;
    progress: number;
    data: any;
    createdAt: number;
    processedOn?: number;
    finishedOn?: number;
}

export interface JobListResponse {
    jobs: JobStatusResponse[];
    page: number;
    limit: number;
}

export interface PriceQueryParams {
    token: string;
    network: string;
    timestamp: number;
}

export interface ScheduleParams {
    token: string;
    network: string;
}

export interface PriceHistoryResponse {
    history: Array<{
        token: string;
        network: string;
        date: number;
        price: number;
    }>;
}

export const priceApi = {
    query: async (params: PriceQueryParams): Promise<PriceResponse> => {
        const response = await api.post('/api/price', params);
        return response.data;
    },
    history: async (params: { token: string; network: string }): Promise<PriceHistoryResponse> => {
        const response = await api.post('/api/price-history', params);
        return response.data;
    },
};

export const scheduleApi = {
    schedule: async (params: ScheduleParams): Promise<ScheduleResponse> => {
        const response = await api.post('/api/schedule', params);
        return response.data;
    },

    stop: async (jobId: string): Promise<{ status: string; jobId: string; message: string }> => {
        const response = await api.delete(`/api/stop/${jobId}`);
        return response.data;
    },

    getStatus: async (jobId: string): Promise<JobStatusResponse> => {
        const response = await api.get(`/api/status/${jobId}`);
        return response.data;
    },

    listJobs: async (page: number = 1, limit: number = 10): Promise<JobListResponse> => {
        const response = await api.get(`/api/jobs?page=${page}&limit=${limit}`);
        return response.data;
    },
};

export default api; 