import { Product } from '@/types/product';
import axios from 'axios';

const getProducts = async (query?: string): Promise<Product[]> => (await axios.get(`/api/search/products?query=${query}`)).data;

const searchService = {
    getProducts,
};

export default searchService;
