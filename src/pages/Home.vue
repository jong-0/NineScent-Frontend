<template>
  <div class="home">
    <section class="hero" :style="{ backgroundImage: `url(${mainImg1})` }">
      <p>Your journey to elegance starts here with us.</p>
      <button class="shop-now" @click="goToShop">Shop Now</button>
    </section>

    <section class="featured-products">
      <h2>Featured Products</h2>
      <carousel
        :items-to-show="1"
        :wrap-around="true"
        :autoplay="3000"
        :transition="1000"
        :mouseDrag="true"
        :touchDrag="true"
        class="carousel-container"
      >
        <slide v-for="product in featuredProducts" :key="product.itemId">
          <div class="slide-content" @click="goToDetail(product.itemId)">
            <img :src="product.mainPhoto" :alt="product.name" class="slide-image" />
            <div class="product-info">
              <p class="item-title">{{ product.itemName }} {{ product.itemSize }}</p>
              <p class="price">{{ priceText(product) }}</p>
            </div>
          </div>
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </section>
  </div>
</template>

<script setup>
import mainImg1 from '@/assets/images/mainImg.jpeg';
import { useRouter } from 'vue-router';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { ref, onMounted } from 'vue';
import itemApi from '@/api/itemApi';
import 'vue3-carousel/dist/carousel.css';

const router = useRouter();
const featuredProducts = ref([]);

const fetchItems = async () => {
  try {
    const response = await itemApi.recommendItem();
    featuredProducts.value = response;
    console.log('featuredProducts', featuredProducts.value);
  } catch (error) {
    console.error('Error fetching recommended items', error.message);
  }
};

const formattedPrice = (price) => {
  return price.toLocaleString();
};

const priceText = (product) => {
  if (product.discountRate > 0) {
    return `${product.discountRate}% ${formattedPrice(product.discountedPrice)}원`;
  } else {
    return `${formattedPrice(product.price)}원`;
  }
};

const goToShop = () => {
  router.push('/items');
};

const goToDetail = (productId) => {
  router.push(`/items/${productId}`);
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: #333;
}

.hero {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 50px;
  text-align: center;
  color: white;
}

.hero p {
  font-size: 18px;
  margin: 10px 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.shop-now {
  padding: 10px 20px;
  background-color: #f7f6f0;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.shop-now:hover {
  background-color: #333;
  color: #f7f6f0;
}

.featured-products {
  padding: 40px 20px;
  text-align: center;
}

.featured-products h2 {
  margin-bottom: 30px;
  font-size: 28px;
}

.carousel-container {
  max-width: 800px;
  margin: auto;
  padding: 20px 40px;
}

.slide-content {
  text-align: center;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease;
}

.slide-content:hover {
  transform: scale(1.03);
}

.slide-image {
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  margin-top: 15px;
}

.item-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #000000;
}

.price {
  color: #000000;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  color: #000000;
}

:deep(.carousel__pagination) {
  margin-top: 20px;
}

:deep(.carousel__pagination-button) {
  background-color: #ccc;
}

:deep(.carousel__pagination-button--active) {
  background-color: #333;
}
</style>
