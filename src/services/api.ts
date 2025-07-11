import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.oireachtas.ie/v1',
  headers: {
    Accept: 'application/json',
  },
});

export const fetchBills = async (limit: number = 20, skip: number = 0) => {
  try {
    const response = await api.get(`/legislation?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

export default api;
