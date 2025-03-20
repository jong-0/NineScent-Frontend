import axios from 'axios';

const API_BASE_URL = 'http://13.125.170.208';

export default {
  async getOrderSummary(userNo) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/orderhist/summary/${userNo}`
      );
      console.log(data);

      return data;
    } catch (error) {
      console.error(
        'Fail to load orders',
        error.response.data
      );
    }
  },
  async getRecentOrders(userNo) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/orderhist/recent/${userNo}`
      );
      console.log(data);

      return data;
    } catch (error) {
      console.error(
        'Fail to load orders',
        error.response.data
      );
    }
  },
  async getAllOrders(userNo, page) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/orderhist/${userNo}?page=${page}`
      );
      console.log(data);

      return data;
    } catch (error) {
      console.error(
        'Fail to load orders',
        error.response.data
      );
    }
  },
  async getOrderDetail(orderId) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/orderhist/detail/${orderId}`
      );
      console.log(data);

      return data;
    } catch (error) {
      console.error(
        'Fail to load orders',
        error.response.data
      );
    }
  },
};
