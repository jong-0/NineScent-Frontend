<template>
  <div class="title">
    <h2>고객센터</h2>
    <div class="nav">
      <ul class="nav-list">
        <li
          v-for="item in menuItems"
          :key="item.id"
          :class="{ active: selectedMenu === item.id }"
          @click="selectMenu(item.id)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
  </div>
  <div class="sub">
    <h4>{{ getCurrentTitle }}</h4>
  </div>
  <div class="content">
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import faq from '@/components/cs/Faq.vue';
import one from '@/components/cs/OneOnOne.vue';
import gift from '@/components/cs/Gift.vue';

// 메뉴 아이템 정의
const menuItems = [
  { id: 'faq', title: 'FAQ' },
  { id: 'one', title: '1:1문의' },
  { id: 'gift', title: '고객사은품 안내' },
];

// 선택된 메뉴 상태 관리
const selectedMenu = ref('');

// 컴포넌트가 마운트될 때 FAQ를 기본값으로 설정
onMounted(() => {
  if (!selectedMenu.value) {
    selectMenu('faq');
  }
});

// 현재 선택된 메뉴의 제목 가져오기
const getCurrentTitle = computed(() => {
  const currentItem = menuItems.find((item) => item.id === selectedMenu.value);
  return currentItem ? currentItem.title : '';
});

// 메뉴 선택 핸들러
const selectMenu = (menuId) => {
  selectedMenu.value = menuId;
};

// 컴포넌트 동적 import
const currentComponent = computed(() => {
  switch (selectedMenu.value) {
    case 'faq':
      return faq;
    case 'one':
      return one;
    case 'gift':
      return gift;
    default:
      return null;
  }
});
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-list {
  display: flex;
  gap: 20px;
}

li {
  list-style: none;
  cursor: pointer;
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
}

li.active {
  /* background-color: #f0f0f0; */
  font-weight: bold;
  text-decoration-line: underline;
}

.sub {
  margin: 20px 0;
  padding: 16px;
}

.content {
  min-height: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
}
</style>
