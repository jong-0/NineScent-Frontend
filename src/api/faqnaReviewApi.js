import api from '@/api';

export default {
  // faq category 불러오기
  async getFaqCategories() {
    try {
      const { data } = await api.get(`/faq/categories`);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // faq category 별 faq 불러오기
  async getFaqs(category) {
    try {
      const { data } = await api.get(`/faq/${category}`);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // faq 작성
  async postFaq(faq) {
    try {
      const { data } = await api.post(`/faq`, faq);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // faq 삭제
  async deleteFaq(faqId) {
    try {
      const { data } = await api.delete(`/faq/${faqId}`);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna 불러오기
  // review 불러오기
};
