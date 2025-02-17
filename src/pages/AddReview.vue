<template>
  <div>
    <h1>Review form</h1>
    <div>
      <h2>{{ itemData.itemName }}</h2>
      <p>{{ itemData.itemSize }}</p>
      <p>{{ itemData.mainPhoto }}</p>
    </div>
    <select v-model="reviewData.rating">
      <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
    </select>
    <p>어떤 점이 좋았나요?</p>
    <br />
    <input type="text" v-model="reviewData.content" placeholder="내용" /><br />
    <input type="text" v-model="reviewData.attachment" placeholder="사진첨부" /><br />
    <button @click="submitReview">등록</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';
import itemApi from '@/api/itemApi';

const router = useRouter();
const route = useRoute();

const reviewData = ref({
  itemId: 0,
  userNo: 0,
  rating: 0,
  content: '',
  attachment: '',
  createdDate: '',
});

const itemData = ref({
  itemName: '',
  itemSize: '',
  mainPhoto: '',
});

const itemId = route.params.itemId;
const reviewId = route.params.reviewId;

const fetchItemData = async () => {
  if (!itemId) return;
  try {
    const response = await itemApi.getItemById(itemId);
    itemData.value = response;
    reviewData.value.itemId = itemId;
  } catch (error) {
    console.error('Error fetching item data', error);
  }
};

const fetchReviewData = async () => {
  const reviewId = route.params.reviewId;
  if (!reviewId) return;
  try {
    const response = await faqnaReviewApi.getReviewById(reviewId);
    reviewData.value = response;
  } catch (error) {
    console.error('Error fetching Review data', error);
  }
};

const submitReview = async () => {
  if (!reviewData.value.rating || !reviewData.value.content) {
    alert('모든 정보를 입력해주세요');
    return;
  }

  reviewData.value.userNo = 1; // 임시 사용자 번호 1
  reviewData.value.createdDate = new Date().toISOString();
  if (reviewData.value.attachment === '') {
    reviewData.value.attachment = '없음';
  }

  try {
    if (reviewId) {
      // 수정 모드
      await faqnaReviewApi.putReview(reviewId, reviewData.value);
    } else {
      // 등록 모드
      await faqnaReviewApi.postReview(reviewData.value);
    }
    router.push({ name: 'Item', params: { itemId } });
  } catch (error) {
    console.error('Error submitting Review', error);
  }
};

onMounted(() => {
  fetchItemData();
  fetchReviewData();
});
</script>

<style scoped></style>
