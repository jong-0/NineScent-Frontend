import api from '@/api';

export default {
  // orderItems 불러오기
  async getPrepareOrder(userNo) {
    try {
      const { data } = await api.post('/order/prepare', {
        userNo,
      });
      console.log('order data :', data);
      return data;
    } catch (error) {
      // if (error.response && error.response.status === 409) {
      //   alert(error.response.data); // "Insufficient stock for item: Denim Jacket"
      // }
      console.error(
        'Failed to load data',
        error.response.data
      );
    }
  },
  async updateOrderAddress(userNo, addrNo) {
    console.log('userNo:', userNo);
    console.log('addrNo:', addrNo);

    try {
      const { data } = await api.post(
        `/order/update-address?userNo=${userNo}&addrNo=${addrNo}`
      );
      // console.log('order data :', data);
      return data;
    } catch (error) {
      // if (error.response && error.response.status === 409) {
      //   alert(error.response.data); // "Insufficient stock for item: Denim Jacket"
      // }
      console.error(
        'Failed to load data',
        error.response.data
      );
    }
  },
};
