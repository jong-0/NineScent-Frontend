<template>
  <div>
    <h1>Faq form</h1>
    <select v-model="faqData.category">
      <option v-for="category in categories" :key="category" :value="category">
        {{ categoryLabels[category] }}
      </option>
    </select>
    <br />
    <input type="text" v-model="faqData.title" placeholder="제목" /><br />
    <input type="text" v-model="faqData.content" placeholder="내용" /><br />
    <button @click="submitFaq">등록</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const router = useRouter();
const route = useRoute();

const categories = ref(['user', 'delivery', 'order', 'item', 'as']);

const categoryLabels = {
  all: '전체',
  user: '회원정보',
  delivery: '배송문의',
  order: '주문/결제문의',
  item: '제품문의',
  as: '교환/환불/반품',
};

// 기본 데이터
const faqData = ref({
  category: '',
  title: '',
  content: '',
});

// URL에서 faqId 가져오기
const faqId = route.params.faqId;

// FAQ 데이터 불러오기
const fetchFaqData = async () => {
  if (!faqId) return; // faqId가 없으면 새 글쓰기 모드
  try {
    const response = await faqnaReviewApi.getFaqById(faqId);
    faqData.value = response; // 가져온 데이터로 설정
  } catch (error) {
    console.error('Error fetching FAQ data', error);
  }
};

// FAQ 등록 또는 수정
const submitFaq = async () => {
  if (!faqData.value.category || !faqData.value.title || !faqData.value.content) {
    alert('모든 정보를 입력해주세요');
    return;
  }

  try {
    if (faqId) {
      // 수정 모드
      await faqnaReviewApi.putFaq(faqId, faqData.value);
    } else {
      // 새 글 등록 모드
      await faqnaReviewApi.postFaq(faqData.value);
    }
    router.push({ name: 'CSCenter' });
  } catch (error) {
    console.error('Error saving FAQ', error);
  }
};

// 컴포넌트 마운트 시 데이터 불러오기
onMounted(() => {
  fetchFaqData();
});
</script>

<style scoped></style>
