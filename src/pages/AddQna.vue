<template>
  <div>
    <h1>Qna form</h1>
    <div>
      <h2>{{ itemData.itemName }}</h2>
      <p>{{ itemData.itemSize }}</p>
      <p>{{ itemData.discountRate }}</p>
      <p>{{ itemData.discountedPrice }}</p>
      <p>{{ itemData.mainPhoto }}</p>
    </div>
    <select v-model="qnaData.qnaCategory">
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <br />
    <input type="text" v-model="qnaData.content" placeholder="내용" /><br />
    <input type="text" v-model="qnaData.attachment" placeholder="사진첨부" /><br />
    <button @click="submitQna">등록</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';
import itemApi from '@/api/itemApi';

const router = useRouter();
const route = useRoute();

const categories = ref(['배송', '재입고', '상품상세문의']);

const qnaData = ref({
  itemId: 0,
  userNo: 0,
  qnaCategory: '',
  content: '',
  attachment: '',
  isDone: false,
  createdDate: '',
});

const itemData = ref({
  itemName: '',
  itemSize: '',
  discountRate: 0,
  discountedPrice: 0,
  mainPhoto: '',
});

const itemId = route.params.itemId;
const questionId = route.params.questionId;

const fetchItemData = async () => {
  if (!itemId) return;
  try {
    const response = await itemApi.getItemById(itemId);
    itemData.value = response;
    qnaData.value.itemId = itemId;
  } catch (error) {
    console.error('Error fetching item data', error);
  }
};

const fetchQnaData = async () => {
  const questionId = route.params.questionId;
  if (!questionId) return;
  try {
    const response = await faqnaReviewApi.getQnaById(questionId);
    qnaData.value = response;
  } catch (error) {
    console.error('Error fetching Qna data', error);
  }
};

const submitQna = async () => {
  if (!qnaData.value.qnaCategory || !qnaData.value.content) {
    alert('모든 정보를 입력해주세요');
    return;
  }

  qnaData.value.userNo = 1; // 임시 사용자 번호 1
  qnaData.value.createdDate = new Date().toISOString();
  if (qnaData.value.attachment === '') {
    qnaData.value.attachment = '없음';
  }

  try {
    if (questionId) {
      // 수정 모드
      await faqnaReviewApi.putQna(questionId, qnaData.value);
    } else {
      // 등록 모드
      await faqnaReviewApi.postQna(qnaData.value);
    }
    router.push({ name: 'Item', params: { itemId } });
  } catch (error) {
    console.error('Error submitting Qna', error);
  }
};

onMounted(() => {
  fetchItemData();
  fetchQnaData();
});
</script>

<style scoped></style>
