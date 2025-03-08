import api from '@/api';

export default {
  // item list 불러오기
  async getItems() {
    try {
      const { data } = await api.get(`/items`);
      console.log('item list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  // item 불러오기
  async getItemById(id) {
    try {
      const { data } = await api.get(`/items/${id}`);
      console.log('item :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  // item 추가
  async addItem(item) {
    try {
      const { data } = await api.post(`/items`, item);
      console.log('item added :', data);
      return data;
    } catch (error) {
      console.error('Failed to add item', error.response.data);
    }
  },

  // item 수정
  async updateItem(id, item) {
    try {
      const { data } = await api.put(`/items/${id}`, item);
      console.log('item updated :', data);
      return data;
    } catch (error) {
      console.error('Failed to update item', error.response.data);
    }
  },

  // item 삭제
  async deleteItem(id) {
    try {
      const { data } = await api.delete(`/items/${id}`);
      console.log('item deleted :', data);
      return data;
    } catch (error) {
      console.error('Failed to delete item', error.response.data);
    }
  },

  async recommendItem() {
    try {
      const { data } = await api.get(`/items/recommend`);
      console.log('recommended item :', data);
      return data;
    } catch (error) {
      console.error('Failed to load recommend item', error.response.data);
    }
  },
};
