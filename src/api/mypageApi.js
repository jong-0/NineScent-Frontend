import axios from 'axios';

export default {
  async getOrderSummary(userNo) {
    try {
      const { data } = await axios.get(
        `api/orderhist/summary/${userNo}`
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
        `api/orderhist/recent/${userNo}`
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
        `api/orderhist/${userNo}?page=${page}`
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
        `api/orderhist/detail/${orderId}`
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
