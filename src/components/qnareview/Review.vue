<template>
  <div v-if="!isLoading">
    <div>
      <div class="review-container">
        <p class="no-content" v-if="reviews.length === 0">등록된 후기가 없습니다.</p>
        <ul class="review-list" v-else>
          <li v-for="review in reviews" :key="review.reviewId" class="review">
            <div>
              <p class="content-title">{{ review.name }} {{ formatDate(review.createdDate) }}</p>
              <p class="content-rate">
                <span v-for="i in 5" :key="i">
                  <i v-if="i <= review.rating" class="fa-solid fa-star"></i>
                  <i v-else class="fa-regular fa-star"></i>
                </span>
              </p>
              <!-- <p>{{ review.reviewImage }}</p> -->
              <span>
                <img class="review-image" src="@/assets/images/product2.jpg" alt="" />
              </span>

              <p class="content-content">{{ review.content }}</p>
            </div>
            <div v-if="isReviewOwner(review)">
              <span class="update" @click="editReview(review)">수정</span>
              <span class="delete" @click.stop="deleteReview(review.reviewId)">삭제</span>
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
let userNo = 0;

const itemId = route.params.itemId;

const isReviewOwner = (review) => {
  return review.userNo === userNo;
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

  const getUserNo = localStorage.getItem('userNo');
  if (getUserNo) {
    userNo = parseInt(getUserNo);
  }
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
  display: flex;
  justify-content: space-between;
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

.update {
  margin-right: 10px;
  cursor: pointer;
  color: #8a8a8a;
}

.delete {
  cursor: pointer;
  color: #8a8a8a;
}

.review-image {
  width: 120px;
  height: 130px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.content-title {
  margin-bottom: 0px;
}

.content-rate {
  margin-bottom: 5px;
}

.content-content {
  margin-bottom: 0px;
}
</style>
