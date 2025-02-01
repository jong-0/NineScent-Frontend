<template>
  <div>
    <h1>Checkout Page</h1>
    <div class="user-info">
      <h1 v-if="itemsData.length > 0">
        {{ itemsData[0].userName }}님께서 주문하려는
        상품입니다.
      </h1>
      <div v-if="addressData && addressData.addrAddress">
        <h2>기본 배송 주소</h2>
        <p>{{ addressData.addrName }}</p>
        <p>{{ addressData.addrAddress }}</p>
        <p>{{ addressData.addrDetail }}</p>
        <p>{{ addressData.addrContact }}</p>
        <button
          @click="goToAddressPage(itemsData[0].userId)"
        >
          배송지 변경
        </button>
      </div>
    </div>
    <div v-if="itemsData && itemsData.length">
      <h2>주문 상품</h2>
      <div
        v-for="item in itemsData"
        :key="item.itemId"
        class="item-card"
      >
        <h3>{{ item.itemName }}</h3>
        <p>Quantity: {{ item.quantity }}</p>
        <p>Price: {{ item.originalPrice }}</p>
        <p v-if="item.discountedPrice">
          Discounted Price: {{ item.discountedPrice }}
        </p>
        <p v-if="item.shippingFee">
          Shipping Fee:
          {{ item.shippingFee.toLocalString() }}원
        </p>
      </div>
    </div>
    <div v-if="itemsData.length > 0" class="total-price">
      <h2>결제 금액</h2>
      <p>
        상품 금액:
        {{ totalOriginalPrice }}원
      </p>
      <p>배송비: {{ totalShippingFee }}원</p>
      <p v-if="totalDiscount == 0">
        할인 금액: {{ totalDiscount }}원
      </p>
      <p v-else>할인 금액: -{{ totalDiscount }}원</p>
      <hr />
      <h3>총 결제 금액: {{ finalPrice }}원</h3>
    </div>
    <div>
      <button @click="onPayment">결제하기</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import checkoutApi from '@/api/checkoutApi';
import addressApi from '@/api/addressApi';

const router = useRouter();
const itemsData = ref([]);
const addressData = ref({});
const userNo = 1;
// localStorage.getItem('userNo');

// 총 상품 금액 계산
const totalOriginalPrice = computed(() => {
  return itemsData.value.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
});

// 총 할인 금액 계산
const totalDiscount = computed(() => {
  return itemsData.value.reduce((sum, item) => {
    return (
      sum +
      (item.discountedPrice
        ? item.originalPrice - item.discountedPrice
        : 0) *
        item.quantity
    );
  }, 0);
});

// 총 배송비 계산
const totalShippingFee = computed(() => {
  return itemsData.value.reduce(
    (sum, item) => sum + item.shippingFee,
    0
  );
});

// 최종 결제 금액 계산
const finalPrice = computed(() => {
  return (
    totalOriginalPrice.value +
    totalShippingFee.value -
    totalDiscount.value
  );
});

// localStorage에서 orderItems 가져오기
const storedOrderItems = localStorage.getItem('orderItems');
const orderItems = storedOrderItems
  ? JSON.parse(storedOrderItems)
  : null;

const fetchOrderItems = async () => {
  if (orderItems) {
    itemsData.value = Array.isArray(orderItems)
      ? orderItems
      : [orderItems];

    const responseAddress = await addressApi.getAddress(
      itemsData.value[0].addressId
    );
    addressData.value = responseAddress;

    // orderItems 사용 후 localStorage 삭제 (더 이상 필요 없음)
    localStorage.removeItem('orderItems');
  } else {
    const responseItem = await checkoutApi.getPrepareOrder(
      userNo
    );
    itemsData.value = responseItem;
    const responseAddress = await addressApi.getAddress(
      responseItem[0].addressId
    );
    addressData.value = responseAddress;
  }
};

const goToAddressPage = (userNo) => {
  if (!userNo) {
    console.error('User ID is missing!');
    return;
  }
  localStorage.setItem('userNo', userNo); // Local Storage에 저장
  router.push({ name: 'Address', params: { userNo } }); // 페이지 이동
};

onMounted(() => {
  fetchOrderItems();
});

// 결제 처리 함수
const onPayment = () => {
  /* 1. 가맹점 식별하기 */
  const { IMP } = window;
  if (!IMP) {
    alert(
      '결제 시스템을 불러오지 못했습니다. 페이지를 새로고침 해주세요.'
    );
    return;
  }
  IMP.init('imp35201335'); // 아임포트 가맹점 식별코드 (테스트용)

  /* 2. 결제 데이터 정의하기 */
  const data = {
    pg: 'nice', // PG사
    pay_method: 'card', // 결제수단
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
    amount: finalPrice.value, // 결제금액
    name: '주문 상품 결제', // 주문명
    buyer_name: addressData.value.addrName, // 구매자 이름
    buyer_tel: addressData.value.addrContact, // 구매자 전화번호
    buyer_email: 'example@example.com', // 구매자 이메일 (데이터 추가 가능)
    buyer_addr: addressData.value.addrAddress, // 구매자 주소
    buyer_postcode: addressData.value.addrZipcode, // 구매자 우편번호
  };

  /* 3. 결제 창 호출 */
  IMP.request_pay(data, callbackPayment);
};

/* ✅ 결제 결과 콜백 함수 */
const callbackPayment = (response) => {
  const { success, merchant_uid, error_msg } = response;

  if (success) {
    alert('결제 성공');
    router.replace({ name: 'OrderComplete' }); // 결제 완료 페이지로 이동
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
};
</script>
