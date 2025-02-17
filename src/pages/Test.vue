<template>
  <div>TEST페이지 입니다.</div>
  <br />
  <button @click="cartToCheckout(userNo)">
    카트 주문하기
  </button>
  <hr />
  <div class="quantity-selector">
    <button @click="decreaseQuantity">-</button>
    <input
      type="number"
      v-model.number="quantity"
      min="1"
    />
    <button @click="increaseQuantity">+</button>
  </div>
  <button @click="itemToCheckout(itemId)">
    아이템 주문하기
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
const userNo = 1;
const itemId = 1;
const quantity = ref(1);

const cartToCheckout = async (userNo) => {
  sessionStorage.setItem('userNo', userNo); // 세션 스토리지에 저장
  sessionStorage.setItem('orderType', 'cart'); // 주문 타입 저장

  // 주문 데이터 백엔드에서 불러오기
  const response = await fetch(
    `/api/cart/detail/${userNo}`
  );
  const cartData = await response.json();

  // 주문 데이터 sessionStorage에 저장
  sessionStorage.setItem(
    'cartData',
    JSON.stringify(cartData)
  );

  // 페이지 이동
  router.push({ name: 'Checkout' });
};

// 수량 증가
const increaseQuantity = () => {
  quantity.value++;
};

// 수량 감소 (최소값 1)
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
const itemToCheckout = async (itemId) => {
  sessionStorage.setItem('itemId', itemId); // 세션 스토리지에 저장
  sessionStorage.setItem('orderType', 'item'); // 주문 타입 저장

  // 주문 데이터 백엔드에서 불러오기
  const response = await fetch(`/api/items/${itemId}`);
  const itemData = await response.json();
  itemData.quantity = quantity.value; // ✅ 데이터에 수량 추가

  // 주문 데이터 sessionStorage에 저장
  sessionStorage.setItem(
    'itemData',
    JSON.stringify(itemData)
  );

  // 페이지 이동
  router.push({ name: 'Checkout' });
};
</script>
