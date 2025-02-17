<template>
  <div>TEST페이지 입니다.</div>
  <br />
  <button @click="cartToCheckout(userNo)">
    카트 주문하기
  </button>
  <hr />
  <button @click="itemToCheckout(itemId)">
    아이템 주문하기
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const userNo = 1;
const itemId = 1;

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

const itemToCheckout = async (itemId) => {
  sessionStorage.setItem('itemId', itemId); // 세션 스토리지에 저장
  sessionStorage.setItem('orderType', 'item'); // 주문 타입 저장

  // 주문 데이터 백엔드에서 불러오기
  const response = await fetch(`/api/items/${itemId}`);
  const itemData = await response.json();

  // 주문 데이터 sessionStorage에 저장
  sessionStorage.setItem(
    'itemData',
    JSON.stringify(itemData)
  );

  // 페이지 이동
  router.push({ name: 'Checkout' });
};
</script>
