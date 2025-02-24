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
      const { data } = await api.get(`/faq/category/${category}`);
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
  // faq 수정
  async putFaq(faqId, faq) {
    try {
      const { data } = await api.put(`/faq/${faqId}`, faq);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // faqId로 faq 불러오기
  async getFaqById(faqId) {
    try {
      const { data } = await api.get(`/faq/${faqId}`);
      console.log('faq list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  // qna 불러오기
  async getQnaByItemId(itemId) {
    try {
      const { data } = await api.get(`/qna/item/${itemId}`);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // userNo로 qna 불러오기
  async getQnaByUserNo(userNo) {
    try {
      const { data } = await api.get(`/qna/user/${userNo}`);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qnaId로 qna 불러오기
  async getQnaById(qnaId) {
    try {
      const { data } = await api.get(`/qna/${qnaId}`);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna 작성
  async postQna(qna) {
    try {
      const { data } = await api.post(`/qna`, qna);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna 삭제
  async deleteQna(qnaId) {
    try {
      const { data } = await api.delete(`/qna/${qnaId}`);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna 수정
  async putQna(qnaId, qna) {
    try {
      const { data } = await api.put(`/qna/${qnaId}`, qna);
      console.log('qna list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  // review 불러오기
  async getReviewByItemId(itemId) {
    try {
      const { data } = await api.get(`/review/item/${itemId}`);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // userNo로 review 불러오기
  async getReviewByUserNo(userNo) {
    try {
      const { data } = await api.get(`/review/user/${userNo}`);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // reviewId로 review 불러오기
  async getReviewById(reviewId) {
    try {
      const { data } = await api.get(`/review/${reviewId}`);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // review 작성
  async postReview(review) {
    try {
      const { data } = await api.post(`/review`, review);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // review 삭제
  async deleteReview(reviewId) {
    try {
      const { data } = await api.delete(`/review/${reviewId}`);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // review 수정
  async putReview(reviewId, review) {
    try {
      const { data } = await api.put(`/review/${reviewId}`, review);
      console.log('review list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  // qna Answer 작성
  async postAnswer(answer) {
    try {
      const { data } = await api.post(`/answer`, answer);
      console.log('answer list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna Answer 불러오기
  async getAnswerByQnaId(qnaId) {
    try {
      const { data } = await api.get(`/answer/question/${qnaId}`);
      console.log('answer list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna Answer 삭제
  async deleteAnswer(answerId) {
    try {
      const { data } = await api.delete(`/answer/${answerId}`);
      console.log('answer list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
  // qna Answer 수정
  async putAnswer(answerId, answer) {
    try {
      const { data } = await api.put(`/answer/${answerId}`, answer);
      console.log('answer list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  async getRatingByItemId(itemId) {
    try {
      const { data } = await api.get(`/review/rating/${itemId}`);
      console.log('rating list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },

  async getRatingCountsByItemId(itemId) {
    try {
      const { data } = await api.get(`/review/rating-count/${itemId}`);
      console.log('rating count list :', data);
      return data;
    } catch (error) {
      console.error('Failed to load data', error.response.data);
    }
  },
};
