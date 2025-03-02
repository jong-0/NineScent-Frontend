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
    <template v-if="faqs.content.length > 0">
      <template v-for="faq in faqs.content" :key="faq.faqId">
        <!-- FAQ 질문 행 -->
        <div class="faq-items">
          <button class="faq-item" @click="toggleFaq(faq.faqId)">
            <span class="list-icon"><i class="fa-solid fa-q"></i></span>
            <span class="list-category">{{ categoryLabels[faq.category] }}</span>
            <span class="list-title">{{ faq.title }}</span>
            <span v-if="isAdmin" class="list-update" @click="editFaq(faq.faqId)"
              ><i class="fa-regular fa-pen-to-square"></i
            ></span>
            <span v-if="isAdmin" class="list-delete" @click.stop="deleteFaq(faq.faqId)"
              ><i class="fa-solid fa-x"></i
            ></span>
            <span class="list-toggle"
              ><i
                :class="['fa-solid', 'fa-chevron-down', { rotated: openedFaqId === faq.faqId }]"
              ></i
            ></span>
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
    </template>
    <template v-else>
      <div class="no-content">등록된 게시물이 없습니다.</div>
    </template>
  </div>
  <template v-if="faqs.content.length > 0">
    <div class="paginate">
      <vue-awesome-paginate
        :total-items="faqs.totalElements"
        :items-per-page="faqs.pageable.pageSize"
        :max-pages-shown="faqs.totalPages"
        :show-ending-buttons="false"
        v-model="currentPage"
        @click="handlePageChange"
      >
        <template #first-page-button><i class="fa-solid fa-backward-fast"></i></template>
        <template #prev-button><i class="fa-solid fa-caret-left"></i></template>
        <template #next-button><i class="fa-solid fa-caret-right"></i></template>
        <template #last-page-button><i class="fa-solid fa-forward-fast"></i></template>
      </vue-awesome-paginate>
    </div>
  </template>
  <div v-if="isAdmin" class="add-faq">
    <button class="add-btn" @click="addFaq">글쓰기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const router = useRouter();
const authStore = useAuthStore();

const categories = ref([]);
const faqs = ref({
  content: [],
  pageable: { pageNumber: 0, pageSize: 10 },
  totalElements: 0,
  totalPages: 0,
});
const selectedCategory = ref(null);
const openedFaqId = ref(null);
const openStates = ref({});

let isAdmin = false;

const categoryLabels = {
  all: '전체',
  user: '회원정보',
  delivery: '배송문의',
  order: '주문/결제문의',
  item: '제품문의',
  as: '교환/환불/반품',
};

const currentPage = ref(1);
const pageRequest = ref({ page: 0 });

const handlePageChange = async (page) => {
  currentPage.value = page;
  pageRequest.value.page = page - 1;
  await fetchFaqs(selectedCategory.value);
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
    const response = await faqnaReviewApi.getFaqPage(category, pageRequest.value.page);
    faqs.value = response;

    if (faqs.value.pageable) {
      currentPage.value = faqs.value.pageable.pageNumber + 1;
    }
  } catch (error) {
    console.error('Error fetching list', error);
  }
};

// const fetchFaqs = async (category) => {
//   try {
//     const response = await faqnaReviewApi.getFaqs(category);
//     faqs.value = response;
//   } catch (error) {
//     console.error('Error fetching list', error);
//   }
// };

const setCategory = (category) => {
  selectedCategory.value = category;
  fetchFaqs(category);
  openedFaqId.value = null; // 카테고리 변경 시 열려 있던 FAQ 닫기
};

// FAQ 클릭 시 토글 (펼치기/닫기)
const toggleFaq = (faqId) => {
  openedFaqId.value = openedFaqId.value === faqId ? null : faqId;
  openStates.value[faqId] = !openStates.value[faqId];
};

const deleteFaq = async (faqId) => {
  try {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    await faqnaReviewApi.deleteFaq(faqId);
    fetchFaqs(selectedCategory.value);
    fetchFaqCategories();
  } catch (error) {
    console.error('Error deleting faq', error);
  }
};

const addFaq = () => {
  router.push({ name: 'AddFaq' });
};

const editFaq = (faqId) => {
  router.push({ name: 'UpdateFaq', params: { faqId } });
};

onMounted(() => {
  authStore.loadStoredToken();
  fetchFaqCategories();

  const getRole = localStorage.getItem('role');
  isAdmin = getRole === 'ROLE_ADMIN';
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
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
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
  margin-top: 10px;
  margin-bottom: 10px;
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
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
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

.list-update {
  cursor: pointer;
}

.list-delete {
  margin-left: 20px;
  cursor: pointer;
}

.list-toggle {
  margin-left: 20px;
}

button.active {
  /* background-color: #f0f0f0; */
  font-weight: bold;
  text-decoration-line: underline;
}

.no-content {
  text-align: center;
  margin: 20px 0px;
}

.add-faq {
  text-align: right;
  margin: 20px 0px;
}

.add-btn {
  padding: 5px 15px;
  border-radius: 5px;
  background-color: #ffffff;
}

.add-btn:hover {
  background-color: #f0f0f0;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
}

.fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.paginate {
  margin-top: 10px;
  text-align: center;
}
</style>
