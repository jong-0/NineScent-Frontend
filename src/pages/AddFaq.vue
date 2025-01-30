<template>
  <div>
    <h1>Faq form</h1>
    <select v-model="faqData.category">
      <option v-for="category in categories" :key="category" :value="category">
        {{ categoryLabels[category] }}
      </option></select
    ><br />
    <input type="text" v-model="faqData.title" placeholder="제목" /><br />
    <input type="text" v-model="faqData.content" placeholder="내용" /><br />
    <button @click="submitFaq">등록</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const router = useRouter();

const categories = ref(['user', 'delivery', 'order', 'item', 'as']);

const categoryLabels = {
  all: '전체',
  user: '회원정보',
  delivery: '배송문의',
  order: '주문/결제문의',
  item: '제품문의',
  as: '교환/환불/반품',
};

const faqData = ref({
  category: '',
  title: '',
  content: '',
});

const submitFaq = async () => {
  console.log(faqData.value);

  if (!faqData.value.category || !faqData.value.title || !faqData.value.content) {
    alert('모든 정보를 입력해주세요');
    return;
  }

  try {
    await faqnaReviewApi.postFaq(faqData.value);
    router.push({ name: 'CSCenter' });
  } catch (error) {
    console.error('Error adding faq', error);
  }
};
</script>

<style scoped></style>
