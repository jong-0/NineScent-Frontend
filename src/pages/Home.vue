<template>
  <div class="home">
    <Header />
    <main class="main">
      <section class="hero">
        <h1>Discover the Perfect Fragrance</h1>
        <p>Your journey to elegance starts here.</p>
        <button class="shop-now">Shop Now</button>
      </section>
      <section class="featured-products">
        <h2>Featured Products</h2>
        <div class="product-list">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="product-item"
            @click="goToDetail(product.id)"
          >
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }}</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const router = useRouter();

const goToDetail = (productId) => {
  router.push(`/items/${productId}`);
};

const featuredProducts = [
  {
    id: 1,
    name: '딥 다운 핸드 밤 50ml',
    price: '32,000원',
    image:
      'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/%E1%84%83%E1%85%B5%E1%86%B8+%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB+%E1%84%92%E1%85%A2%E1%86%AB%E1%84%83%E1%85%B3+%E1%84%87%E1%85%A1%E1%86%B7+50ml.jpg',
  },
  {
    id: 2,
    name: 'Citrus Bloom',
    price: '$79',
    image:
      'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/2.jpg',
  },
  {
    id: 3,
    name: 'Mystic Oud',
    price: '$99',
    image:
      'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/3.jpg',
  },
];
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: #333;
}
.hero {
  text-align: center;
  padding: 50px 20px;
  background-color: #ececec;
}
.hero h1 {
  font-size: 36px;
}
.hero p {
  font-size: 18px;
  margin: 10px 0;
}
.shop-now {
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.featured-products {
  padding: 20px;
}
.product-list {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.product-item img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.product-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-item:hover {
  transform: scale(1.05);
}
</style>
