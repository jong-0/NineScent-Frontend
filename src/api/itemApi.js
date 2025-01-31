import axios from 'axios';

const BASE_URL = '/api/items';

export const getItem = async (itemId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};
