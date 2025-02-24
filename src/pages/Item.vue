<template>
  <div class="product-detail">
    <!-- 상품 정보 섹션 -->
    <div class="product-container">
      <div class="product-images">
        <!-- <img :src="product.photo" alt="Product Image" class="main-image" /> -->
        <img class="main-image" src="@/assets/images/product2.jpg" alt="" />
      </div>

      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}원</p>
        <p>{{ product.description }}</p>

        <!-- 수량 선택 -->
        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increaseQuantity">+</button>
        </div>

        <!-- 총 가격 -->
        <div class="total-price">
          <span>총 상품금액</span>
          <span>{{ formatPrice(calculateTotalPrice()) }}원</span>
        </div>

        <!-- 장바구니 및 구매 버튼 -->
        <div class="action-buttons">
          <button class="buy-now" @click="buyNow">바로구매</button>
          <button class="add-to-cart" @click="addToCart">장바구니</button>
        </div>
      </div>
    </div>

    <!-- 상품 상세 정보 및 리뷰/Q&A 탭 -->
    <div class="product-tabs">
      <div class="tab-headers">
        <a href="#detail">상세정보</a>
        <a href="#review">리뷰</a>
        <a href="#qna">Q&A</a>
      </div>

      <div class="tab-content">
        <!-- 상세 정보 -->
        <div class="detail-info">
          <p>{{ product.titleName }}</p>
          <!-- <img v-if="product.detail" :src="product.detail" alt="Product Detail Image" /> -->
          <img src="@/assets/images/product2.jpg" alt="" />
        </div>

        <div id="review" class="section">
          <Review />
        </div>
        <div id="qna" class="section">
          <Qna />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import itemApi from '@/api/itemApi';
import Qna from '@/components/qnareview/Qna.vue';
import Review from '@/components/qnareview/Review.vue';

const route = useRoute();

// ✅ 초기 값 설정 (기본 데이터 제공)
const product = ref({
  id: 1,
  name: '핸드 밤 50ml',
  price: 32000,
  description:
    'Deep Down Hand Balm 50ml 건강하고 소탈한 모습, 내면의 숲을 탐색하는 자유로운 여행자를 떠올립니다. 딥 다운의 향기를 핸드 밤으로 만나보세요.',
  photo:
    'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/%E1%84%83%E1%85%B5%E1%86%B8+%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB+%E1%84%92%E1%85%A2%E1%86%AB%E1%84%83%E1%85%B3+%E1%84%87%E1%85%A1%E1%86%B7+50ml.jpg',
  detail:
    'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/detail/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A61.jpg',
});

const quantity = ref(1);
const productId = route.params.itemId;

// ✅ 백엔드 API에서 데이터 가져오기
const fetchProduct = async () => {
  try {
    const data = await itemApi.getItemById(productId);

    product.value = {
      id: data.itemId || 1,
      name: data.itemName || '핸드 밤 50ml',
      price: data.price || 32000,
      description:
        data.itemDesc || '건강하고 소탈한 모습, 내면의 숲을 탐색하는 자유로운 여행자를 떠올립니다.',
      photo:
        data.photo ||
        'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/sample-product.jpg',
      detail:
        data.detail ||
        'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/detail/sample-detail.jpg',
    };
  } catch (error) {
    console.error('상품 데이터 로딩 실패:', error);
  }
};

// 가격 포맷
const formatPrice = (price) => price.toLocaleString();

// 가격 계산
const calculateTotalPrice = () => {
  return product.value.price * quantity.value;
};

// 날짜 포맷
const formatDate = (date) => new Date(date).toLocaleDateString();

// 수량 조절
const increaseQuantity = () => quantity.value++;
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// 장바구니 추가
const addToCart = () => {
  console.log(`장바구니 추가: ${product.value.name}, 수량: ${quantity.value}`);
};

// 즉시 구매
const buyNow = () => {
  console.log(`즉시 구매: ${product.value.name}, 수량: ${quantity.value}`);
};

// ✅ 페이지 로드 시 상품 데이터 가져오기
onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 50px;
}

.main-image {
  width: 100%;
  height: auto;
}

.product-info {
  padding: 20px;
}

.product-info h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.option-group {
  margin-bottom: 20px;
}

.option-group select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #fff;
}

.quantity-selector input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  margin: 0 5px;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.action-buttons button {
  padding: 15px;
  border: none;
  cursor: pointer;
}

.buy-now {
  background-color: #333;
  color: white;
}

.add-to-cart {
  background-color: #eee;
  color: #333;
}

.product-tabs {
  margin-top: 50px;
}

.tab-headers {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-headers a {
  padding: 15px 30px;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.tab-headers a:active {
  font-weight: bold;
  border-bottom: 2px solid #333;
}

.tab-headers a:hover {
  font-weight: bold;
  border-bottom: 2px solid #333;
}

.tab-content {
  padding: 30px 0;
}

.review-item,
.qna-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.stars {
  color: #ffd700;
}

.stars i.filled {
  color: #ffd700;
}

.stars i:not(.filled) {
  color: #ddd;
}

.question,
.answer {
  display: flex;
  gap: 15px;
  margin: 10px 0;
}

.q-mark,
.a-mark {
  font-weight: bold;
  color: #333;
}

.date {
  color: #999;
  font-size: 14px;
}

.detail-info img {
  max-width: 800px;
  width: 100%;
  height: auto;
  margin: 20px auto;
  display: block;
}

.product-info p {
  line-height: 1.6;
  color: #666;
  margin: 20px 0;
}

.main-image {
  max-width: 500px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 40px 20px;
}

.section {
  margin-top: 70px;
}
</style>
