<template>
  <div v-if="order" class="order-detail-container">
    <!-- 상단: 주문 정보 -->
    <div class="order-summary">
      <h2>주문 상세 정보</h2>
      <p>📅 주문 날짜: {{ formattedDate }}</p>
      <p>📦 주문번호: {{ order.orderId }}</p>
    </div>

    <!-- 🚚 배송 정보 -->
    <div class="shipping-info">
      <h3>📍 배송 정보</h3>
      <p>
        <strong>받는 분:</strong>
        {{ order.address.addrName }}
      </p>
      <p>
        <strong>연락처:</strong>
        {{ order.address.addrContact }}
      </p>
      <p>
        <strong>주소:</strong>
        {{ order.address.addrAddress }}
        {{ order.address.addrDetail }}
      </p>
      <p v-if="order.address.addrRequest">
        <strong>배송 요청사항:</strong>
        {{ order.address.addrRequest }}
      </p>
    </div>
    <!-- 🛍 주문 상품 -->
    <div class="order-items">
      <h3>🛍 주문 상품</h3>
      <div
        v-for="item in order.orderItems"
        :key="item.orderItemId"
        class="order-item"
      >
        <img
          :src="item.item.mainPhoto"
          alt="상품 이미지"
          class="product-image"
        />
        <div class="item-details">
          <p class="item-name">{{ item.item.itemName }}</p>
          <p class="item-price">
            💰 가격: {{ item.discountedPrice }}원
          </p>
          <p class="item-quantity">
            📦 수량: {{ item.quantity }}개
          </p>
        </div>
      </div>
    </div>

    <!-- 💳 결제 정보 -->
    <div class="payment-info">
      <h3>💳 결제 정보</h3>
      <p>
        <strong>상품 금액:</strong> {{ order.totalPrice }}원
      </p>
      <p>
        <strong>할인 금액:</strong> -{{
          order.totalDiscount
        }}원
      </p>
      <p>
        <strong>배송비:</strong> {{ order.shippingFee }}원
      </p>
      <hr />
      <p class="final-amount">
        <strong>총 결제 금액:</strong>
        {{ order.finalAmount }}원
      </p>
    </div>

    <!-- 뒤로가기 버튼 -->
    <button @click="goBack" class="back-button">
      뒤로가기
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import mypageApi from '@/api/mypageApi';

const route = useRoute();
const router = useRouter();
const order = ref(null);

// 날짜 포맷팅 (2025, 2, 23, 6, 55, 27 -> 2025-02-23)
const formattedDate = computed(() => {
  if (!order.value?.orderDate) return '';
  const [year, month, day] = order.value.orderDate;
  return `${year}-${String(month).padStart(
    2,
    '0'
  )}-${String(day).padStart(2, '0')}`;
});

const fetchOrderDetail = async () => {
  try {
    const response = await mypageApi.getOrderDetail(
      route.params.orderId
    );
    if (response) order.value = response;
  } catch (error) {
    console.error(
      '주문 상세 정보를 불러올 수 없습니다.',
      error
    );
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchOrderDetail();
});
</script>
<style scoped>
/* 📌 전체 컨테이너 */
.order-detail-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 📌 주문 정보 */
.order-summary h2 {
  font-size: 22px;
  margin-bottom: 10px;
}
.order-summary p {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}

/* 📌 배송 정보 */
.shipping-info,
.payment-info,
.order-items {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

/* 📌 주문 상품 */
.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}
.item-details {
  flex-grow: 1;
}
.item-name {
  font-size: 16px;
  font-weight: bold;
}
.item-price,
.item-quantity {
  font-size: 14px;
  color: #666;
}

/* 📌 결제 정보 */
.payment-info p {
  font-size: 16px;
  margin: 5px 0;
}
.payment-info .final-amount {
  font-size: 18px;
  font-weight: bold;
  color: #e44d26;
}

/* 📌 뒤로가기 버튼 */
.back-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background: #007bff;
  color: white;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.back-button:hover {
  background: #0056b3;
}

/* 📌 반응형 디자인 */
@media (max-width: 600px) {
  .order-detail-container {
    padding: 15px;
  }
  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>
