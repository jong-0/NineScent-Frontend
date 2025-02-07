<template>
  <div>
    <h1>Item</h1>
    <div>
      <h2>{{ itemData.itemName }}</h2>
      <p>{{ itemData.price }}</p>
      <p>{{ itemData.description }}</p>
      <p>{{ itemData.category }}</p>
      <p>{{ itemData.subCategory }}</p>
    </div>

    <!-- 탭 메뉴 -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'review' }" @click="activeTab = 'review'">
        Review
      </button>
      <button :class="{ active: activeTab === 'qna' }" @click="activeTab = 'qna'">QnA</button>
    </div>

    <!-- 탭에 따른 컨텐츠 -->
    <div class="tab-content">
      <Review v-if="activeTab === 'review'" />
      <Qna v-if="activeTab === 'qna'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import itemApi from '@/api/itemApi';
import Review from '@/components/qnareview/Review.vue';
import Qna from '@/components/qnareview/Qna.vue';

const route = useRoute();

// 아이템 데이터
const itemData = ref({
  itemName: '',
  price: 0,
  description: '',
  category: '',
  subCategory: '',
});

// 현재 활성화된 탭 (기본값은 'review')
const activeTab = ref('review');

// 아이템 ID
const itemId = route.params.itemId;

// 아이템 데이터 가져오기
const fetchItemData = async () => {
  console.log(itemId);

  if (!itemId) return;
  try {
    const response = await itemApi.getItemById(itemId);
    itemData.value = response;
  } catch (error) {
    console.error('Error fetching item data', error);
  }
};

onMounted(() => {
  fetchItemData();
});
</script>

<style scoped>
.tabs {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #000000;
  color: white;
}

.tab-content {
  margin-top: 20px;
}
</style>
