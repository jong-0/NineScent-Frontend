<template>
  <div v-if="!isLoading">
    <div>
      <div class="review-container">
        <p class="no-content" v-if="reviews.length === 0">등록된 후기가 없습니다.</p>
        <ul class="review-list" v-else>
          <li v-for="review in reviews" :key="review.reviewId" class="review">
            <div>
              <p>{{ review.name }} {{ formatDate(review.createdDate) }}</p>
              <p>
                <span v-for="i in 5" :key="i">
                  <i v-if="i <= review.rating" class="fa-solid fa-star"></i>
                  <i v-else class="fa-regular fa-star"></i>
                </span>
              </p>
              <p>{{ review.reviewImage }}</p>

              <p>{{ review.content }}</p>
            </div>
            <div v-if="isReviewOwner(review)">
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
    <div class="add-review">
      <button class="add-btn" @click="addReview(itemId)">글쓰기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const reviews = ref([]);
const isLoading = ref(true);

const itemId = route.params.itemId;

const isReviewOwner = (review) => {
  return review.userNo === authStore.user?.userNo;
};

const fetchReviewData = async () => {
  if (!itemId) return;
  isLoading.value = true;
  try {
    const response = await faqnaReviewApi.getReviewByItemId(itemId);
    reviews.value = response;
  } catch (error) {
    console.error('Error fetching review data', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date) => {
  if (!date || date.length < 6) return 'N/A';

  const year = String(date[0]).slice(2);
  const month = String(date[1]).padStart(2, '0');
  const day = String(date[2]).padStart(2, '0');

  return `${year}.${month}.${day}`;
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
  authStore.loadStoredToken();
});
</script>

<style scoped>
.no-content {
  text-align: center;
  margin: 20px 0px;
}

.review-container {
  margin: 20px 0px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.review-list {
  margin: 0;
  padding: 0;
}

.review {
  list-style: none;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.add-review {
  text-align: right;
  margin: 20px 0px;
}

.add-btn {
  padding: 5px 15px;
  border-radius: 5px;
  background-color: #ffffff;
}
</style>
