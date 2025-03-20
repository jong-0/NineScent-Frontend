import axios from 'axios';

const API_BASE_URL = 'http://13.125.170.208/api/cart';

export const cartApi = {
  // 장바구니 조회
  async getCart(userNo) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/detail/${userNo}`
      );
      return response.data;
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      return null;
    }
  },

  // 장바구니에 상품 추가
  async addItem(userNo, itemId, quantity) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/add/${userNo}`,
        {
          itemId,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      throw error;
    }
  },

  // 수량 변경
  async updateItem(userNo, itemId, quantity, action) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/update/${userNo}`,
        {
          itemId,
          quantity,
          action, // 'increase' | 'decrease' | 'set'
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ 수량 변경 실패:', error);
      throw error;
    }
  },

  // 선택된 아이템 삭제
  async removeSelectedItems(userNo) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/removeselected/${userNo}`
      );
      return response.data;
    } catch (error) {
      console.error('선택된 아이템 삭제 실패:', error);
      throw error;
    }
  },

  // 개별 아이템 삭제
  async removeItem(userNo, itemId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/removeitem/${userNo}`,
        {
          params: { itemId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('아이템 삭제 실패:', error);
      throw error;
    }
  },
};
