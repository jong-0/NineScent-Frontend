import api from '@/api';

export default {
  // addressList 불러오기
  async getAddressList(userNo) {
    try {
      const { data } = await api.get(
        `/address/list/${userNo}`
      );
      console.log('address list :', data);
      return data;
    } catch (error) {
      console.error(
        'Failed to load data',
        error.response.data
      );
    }
  },
  // 특정 address 불러오기
  async getAddress(addrNo) {
    try {
      const { data } = await api.get(`/address/${addrNo}`);
      console.log('address:', data);
      return data;
    } catch (error) {
      console.error(
        'Failed to load data',
        error.response.data
      );
    }
  },
  // address default 불러오기
  async getAddressDefault(userNo) {
    try {
      const { data } = await api.get(
        `/address/default/${userNo}`
      );
      console.log('default address :', data);
      return data;
    } catch (error) {
      console.error(
        'Failed to load data',
        error.response.data
      );
    }
  },
  // address 추가
  async addAddress(userNo, address) {
    try {
      const { data } = await api.post(
        `/address/add/${userNo}`,
        address
      );
      console.log('address added :', data);
      return data;
    } catch (error) {
      console.error(
        'Failed to add address:',
        error.response?.data || error.message
      );
      throw error; // 에러를 던져 상위에서 처리
    }
  },
  // address update
  async updateAddress(addrNo, address) {
    try {
      const { data } = await api.put(
        `/address/update/${addrNo}`,
        address
      );
      console.log('address added :', data);
      return data;
    } catch (error) {
      console.error(
        'Failed to add address:',
        error.response?.data || error.message
      );
      throw error; // 에러를 던져 상위에서 처리
    }
  },
  // address 삭제
  async deleteAddress(addrNo) {
    try {
      const { data } = await api.delete(
        `/address/delete/${addrNo}`
      );
      return data;
    } catch (error) {
      console.error(
        'Failed to delete data',
        error.response.data
      );
    }
  },
};
