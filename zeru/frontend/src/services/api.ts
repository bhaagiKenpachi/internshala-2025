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

export interface PriceQueryParams {
    token: string;
    network: string;
    timestamp: number;
}

export interface ScheduleParams {
    token: string;
    network: string;
}

export const priceApi = {
    query: async (params: PriceQueryParams): Promise<PriceResponse> => {
        const response = await api.post('/api/price', params);
        return response.data;
    },
};

export const scheduleApi = {
    schedule: async (params: ScheduleParams): Promise<ScheduleResponse> => {
        const response = await api.post('/api/schedule', params);
        return response.data;
    },
};

export default api; 