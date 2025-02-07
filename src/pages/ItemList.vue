<template>
  <div>
    <h1>Item List</h1>
    <ul>
      <li v-for="item in items" :key="item.itemId" class="item">
        <button @click="selectItem(item.itemId)">{{ item.itemName }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import itemApi from '@/api/itemApi';

const router = useRouter();

const items = ref([]);

const fetchItems = async () => {
  try {
    const response = await itemApi.getItems();
    items.value = response;
  } catch (error) {
    console.error('Error fetching list', error);
  }
};

const selectItem = (itemId) => {
  router.push({ name: 'Item', params: { itemId } });
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.item {
  list-style: none;
}
</style>
