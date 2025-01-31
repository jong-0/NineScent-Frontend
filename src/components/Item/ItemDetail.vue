<template>
  <div class="container">
    <div class="item-detail">
      <!-- 상품 이미지 -->
      <div class="image-section">
        <img :src="item.imageUrl" alt="상품 이미지" v-if="item.imageUrl" />
      </div>

      <!-- 상품 정보 -->
      <div class="info-section">
        <h1 class="item-name">{{ item.name }}상품이름</h1>
        <p class="price">{{ formatPrice(item.price) }}원</p>

        <!-- 적립금 정보 -->
        <!-- <p class="reward-points"> -->
        <!-- 💰 적립금: {{ formatPrice(item.rewardPoints) }}원 -->
        <!-- </p> -->

        <!-- 배송 정보 -->
        <p class="shipping-info">
          🚚 배송비: {{ formatShippingFee(item.shippingFee) }}
        </p>

        <!-- 상품 옵션 선택 -->
        <div class="option-section" v-if="item.options && item.options.length">
          <label for="option-select">옵션 선택</label>
          <select v-model="selectedOption">
            <option
              v-for="(option, index) in item.options"
              :key="index"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <!-- 수량 선택 -->
        <div class="quantity-section">
          <label for="quantity">수량</label>
          <button @click="decreaseQuantity">-</button>
          <input type="number" v-model="quantity" min="1" />
          <button @click="increaseQuantity">+</button>
        </div>

        <!-- 총 주문 금액 -->
        <p class="total-price">총 주문 금액: {{ formatPrice(totalPrice) }}원</p>

        <!-- 구매 및 장바구니 버튼 -->
        <div class="button-section">
          <button class="buy-button" @click="buyNow">바로 구매</button>
          <button class="cart-button" @click="addToCart">장바구니 담기</button>
        </div>
      </div>
    </div>

    <!-- 상세 설명 -->
    <div class="item-description">
      <h2>상품 상세 설명</h2>
      <p v-html="item.longDescription"></p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getItem } from '@/api/itemApi';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const item = ref({});
    const selectedOption = ref('');
    const quantity = ref(1);

    // 상품 정보 불러오기
    const fetchItem = async () => {
      try {
        const itemId = route.params.id;
        item.value = await getItem(itemId);
        selectedOption.value = item.value.options?.[0] || ''; // 기본 선택 옵션
      } catch (error) {
        console.error('상품 정보를 불러오는데 실패했습니다.', error);
      }
    };

    // 가격 포맷 함수
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    // 배송비 포맷 함수
    const formatShippingFee = (fee) => {
      return fee === 0 ? '무료 배송' : `${formatPrice(fee)}원`;
    };

    // 총 주문 금액 계산
    const totalPrice = computed(() => {
      return item.value.price * quantity.value;
    });

    // 수량 조절
    const increaseQuantity = () => {
      quantity.value += 1;
    };

    const decreaseQuantity = () => {
      if (quantity.value > 1) quantity.value -= 1;
    };

    const addToCart = () => {
      alert('장바구니에 추가되었습니다!');
    };

    const buyNow = () => {
      alert('구매 페이지로 이동합니다!');
    };

    onMounted(fetchItem);

    return {
      item,
      selectedOption,
      quantity,
      formatPrice,
      formatShippingFee,
      totalPrice,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      buyNow,
    };
  },
};
</script>

<style scoped>
/* 컨테이너 스타일 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 상품 상세 영역 */
.item-detail {
  display: flex;
  gap: 40px;
  align-items: center;
}

/* 이미지 스타일 */
.image-section img {
  max-width: 400px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 상품 정보 스타일 */
.info-section {
  flex: 1;
}

/* 상품명 */
.item-name {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
}

/* 가격 */
.price {
  font-size: 22px;
  font-weight: bold;
  color: #ff6600;
  margin-bottom: 10px;
}

/* 적립금 */
.reward-points {
  font-size: 16px;
  color: #0070c9;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 배송 정보 */
.shipping-info {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

/* 옵션 선택 */
.option-section {
  margin-bottom: 15px;
}

.option-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.option-section select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

/* 수량 선택 */
.quantity-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-section button {
  padding: 5px 10px;
  font-size: 18px;
  border: none;
  background: #ddd;
  cursor: pointer;
}

.quantity-section input {
  width: 50px;
  text-align: center;
}

/* 총 주문 금액 */
.total-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

/* 버튼 스타일 */
.button-section {
  display: flex;
  gap: 10px;
}

.buy-button,
.cart-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.buy-button {
  background: #ff6600;
  color: white;
}

.cart-button {
  background: #0070c9;
  color: white;
}
</style>
