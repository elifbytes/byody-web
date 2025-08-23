import axios from 'axios';
import { District } from '@/types/address';

const getDistricts = async (search: string, page?: number, limit?: number): Promise<District[]> => {
    const params: Record<string, string|number> = { search };
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    const response = await axios.get('/api/districts', { params });
    return response.data;
};

const saitransService = {
    getDistricts,
};
export default saitransService;
