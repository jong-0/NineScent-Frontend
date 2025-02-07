<template>
  <div>
    <h1>Review</h1>
    <div>
      <ul>
        <li v-for="review in reviews" :key="review.reviewId" class="review">
          <div>
            <p>userNo: {{ review.userNo }}</p>
            <p>content: {{ review.content }}</p>
            <p>
              rate:
              <span v-for="i in 5" :key="i">
                <i v-if="i <= review.rating" class="fa-solid fa-star"></i>
                <i v-else class="fa-regular fa-star"></i>
              </span>
            </p>
            <p>date: {{ formatDate(review.createdDate) }}</p>
            <p>image: {{ review.reviewImage }}</p>
          </div>
          <div>
            <span class="update" @click="editReview(review)"
              ><i class="fa-regular fa-pen-to-square"></i
            ></span>
            <span class="delete" @click.stop="deleteReview(review.reviewId)"
              ><i class="fa-solid fa-x"></i
            ></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div>
    <button @click="addReview(itemId)">글쓰기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const route = useRoute();
const router = useRouter();

const reviews = ref({
  userNo: 0,
  content: '',
  rating: 0,
  createdDate: '',
  reviewImage: '',
});

const itemId = route.params.itemId;

const fetchReviewData = async () => {
  if (!itemId) return;
  try {
    const response = await faqnaReviewApi.getReviewByItemId(itemId);
    reviews.value = response;
  } catch (error) {
    console.error('Error fetching review data', error);
  }
};

const formatDate = (date) => {
  if (!date || date.length < 6) return 'N/A';
  return date.slice(0, 3).join('-');
};

const addReview = (itemId) => {
  router.push({ name: 'AddReview', params: { itemId } });
};

const editReview = (review) => {
  router.push({
    name: 'UpdateReview',
    params: { itemId: itemId, reviewId: review.reviewId },
  });
};

const deleteReview = async (reviewId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await faqnaReviewApi.deleteReview(reviewId);
    fetchReviewData();
  } catch (error) {
    console.error('Error deleting review', error);
  }
};

onMounted(() => {
  fetchReviewData();
});
</script>

<style scoped>
.review {
  list-style: none;
  border: 1px solid #000000;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}
</style>
