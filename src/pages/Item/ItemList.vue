<template>
  <div>
    <h1>Perfume</h1>
    <div class="grid-container">
      <div
        v-for="item in items"
        :key="item.itemId"
        class="grid-item"
        @click="selectItem(item.itemId)"
      >
        <!-- <img :src="item.imageUrl" :alt="item.itemName" class="item-image" /> -->
        <img class="item-image" src="@/assets/images/product1.jpg" alt="" />
        <p class="item-name">{{ item.itemName }} {{ item.itemSize }}ml</p>
        <p class="item-price">{{ priceText(item) }}</p>
      </div>
    </div>
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
    console.error('Error fetching list', error.message);
  }
};

const selectItem = (itemId) => {
  router.push({ name: 'ItemDetail', params: { id: itemId } });
};

const formattedPrice = (price) => {
  return price.toLocaleString();
};

const priceText = (item) => {
  if (item.discountRate > 0) {
    return `${item.discountRate}% ${formattedPrice(item.discountedPrice)}원`;
  } else {
    return `${formattedPrice(item.price)}원`;
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  gap: 16px;
  padding: 16px;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-item {
  /* border: 1px solid #ddd;
  border-radius: 8px; */
  /* padding: 16px; */
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.grid-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: auto;
  height: 100%;
  max-height: 300px;
  object-fit: cover;
}

@media (min-width: 900px) {
  .item-image {
    max-height: 350px;
  }
}

@media (min-width: 1200px) {
  .item-image {
    max-height: 400px;
  }
}

.item-name {
  margin-top: 15px;
}
</style>
