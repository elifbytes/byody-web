import { Country, State } from '@/types/country';
import axios from 'axios';

const getCountries = async (): Promise<Country[]> => (await axios.get('/api/countries')).data;
const getStates = async (countryId: number): Promise<State[]> => (await axios.get(`/api/countries/${countryId}/states`)).data;

const countryService = {
    getCountries,
    getStates,
};

export default countryService;
