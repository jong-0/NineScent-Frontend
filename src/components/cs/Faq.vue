<template>
  <div>
    <h1>FAQ</h1>
    <div class="categories">
      <button
        class="category"
        v-for="category in categories"
        :key="category"
        @click="setCategory(category)"
        :class="{ active: selectedCategory === category }"
      >
        {{ categoryLabels[category] }}
      </button>
    </div>
  </div>

  <div class="faq-list">
    <template v-for="faq in faqs" :key="faq.faqId">
      <!-- FAQ 질문 행 -->
      <div class="faq-items">
        <button class="faq-item" @click="toggleFaq(faq.faqId)">
          <span class="list-icon"><i class="fa-solid fa-q"></i></span>
          <span class="list-category">{{ categoryLabels[faq.category] }}</span>
          <span class="list-title">{{ faq.title }}</span>
          <span @click.stop="deleteFaq(faq.faqId)"><i class="fa-solid fa-x"></i></span>
        </button>

        <!-- 클릭된 FAQ의 답변을 바로 아래에 표시 -->
        <transition name="slide">
          <div v-if="openedFaqId === faq.faqId" class="faq-answer">
            <i class="fa-solid fa-a"></i>
            <span>{{ faq.content }}</span>
          </div>
        </transition>
      </div>
    </template>
  </div>
  <div>
    <button @click="addFaq">글쓰기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const router = useRouter();

const categories = ref([]);
const faqs = ref([]);
const selectedCategory = ref(null);
const openedFaqId = ref(null);

const categoryLabels = {
  all: '전체',
  user: '회원정보',
  delivery: '배송문의',
  order: '주문/결제문의',
  item: '제품문의',
  as: '교환/환불/반품',
};

const fetchFaqCategories = async () => {
  try {
    const response = await faqnaReviewApi.getFaqCategories();
    categories.value = response;
    selectedCategory.value = categories.value[0];
    fetchFaqs(selectedCategory.value);
  } catch (error) {
    console.error('Error fetching list', error);
  }
};

const fetchFaqs = async (category) => {
  try {
    const response = await faqnaReviewApi.getFaqs(category);
    faqs.value = response;
  } catch (error) {
    console.error('Error fetching list', error);
  }
};

const setCategory = (category) => {
  selectedCategory.value = category;
  fetchFaqs(category);
  openedFaqId.value = null; // 카테고리 변경 시 열려 있던 FAQ 닫기
};

// FAQ 클릭 시 토글 (펼치기/닫기)
const toggleFaq = (faqId) => {
  openedFaqId.value = openedFaqId.value === faqId ? null : faqId;
};

const deleteFaq = async (faqId) => {
  try {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    await faqnaReviewApi.deleteFaq(faqId);
    fetchFaqs(selectedCategory.value);
  } catch (error) {
    console.error('Error deleting faq', error);
  }
};

const addFaq = () => {
  router.push({ name: 'AddFaq' });
};

onMounted(() => {
  fetchFaqCategories();
});
</script>

<style scoped>
.category {
  margin: 20px 0px;
  background-color: transparent;
  border: none;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-items {
  border-bottom: 1px solid #e0e0e0;
}

.faq-item {
  border: none;
  background: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  text-align: left;
  cursor: pointer;
}

.faq-item:hover {
  background-color: #f9f9f9;
}

/* 답변 스타일 */
.faq-answer {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-icon {
  width: 30px;
}

.list-category {
  width: 120px;
}

.list-title {
  flex: 1;
}

button.active {
  /* background-color: #f0f0f0; */
  font-weight: bold;
  text-decoration-line: underline;
}
</style>
