<template>
  <div>NewTestCheckout</div>

  <!-- 카트 주문 -->
  <div v-if="orderType === 'cart' && cartData">
    <h2>카트 주문 상품 목록</h2>
    <ul>
      <li
        v-for="item in cartData.cartItems"
        :key="item.cartItemId"
      >
        {{ item.itemName }} - {{ item.quantity }}개
      </li>
    </ul>
  </div>
  <!-- 개별 상품 주문 -->
  <div v-else-if="orderType === 'item' && itemData">
    <h2>개별 상품 주문</h2>
    <p>상품명: {{ itemData.itemName }}</p>
    <p>가격: {{ itemData.price }}원</p>
  </div>
  <div v-else>
    <p>불러올 수 있는 주문 정보가 없습니다.</p>
  </div>
  <div v-if="addressData && addressData.addrAddress">
    <h2>기본 배송 주소</h2>
    <p>{{ addressData.addrName }}</p>
    <p>{{ addressData.addrAddress }}</p>
    <p>{{ addressData.addrDetail }}</p>
    <p>{{ addressData.addrContact }}</p>
    <button @click="goToAddressPage(userNo)">
      배송지 변경
    </button>
  </div>
  <!-- 결제 금액 -->
  <div class="total-price" v-if="finalPrice > 0">
    <h2>결제 금액</h2>
    <p>총 결제 금액: {{ finalPrice }}원</p>
  </div>

  <!-- 결제 버튼 -->
  <div>
    <button @click="onPayment">결제하기</button>
  </div>
</template>

<script setup>
import addressApi from '@/api/addressApi';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const cartData = ref(null);
const itemData = ref(null);
const addressData = ref(null);
const orderType = sessionStorage.getItem('orderType');
const userNo = sessionStorage.getItem('userNo'); // 세션에서 가져오기

const fetchOrderData = () => {
  if (orderType === 'cart') {
    const storedCart = sessionStorage.getItem('cartData');
    console.log(storedCart);

    cartData.value = storedCart
      ? JSON.parse(storedCart)
      : null;
  } else if (orderType === 'item') {
    const storedItem = sessionStorage.getItem('itemData');
    console.log(storedItem);

    itemData.value = storedItem
      ? JSON.parse(storedItem)
      : null;
  }
};

const fetchAddressData = async () => {
  // 기본 주소 불러오기 (새로운 주문 시)
  if (!userNo) return;

  const defaultResponse =
    await addressApi.getAddressDefault(userNo);
  addressData.value = defaultResponse;

  // 기존 sessionStorage에 저장된 주소가 있는 경우 덮어쓰기
  const addrNo = sessionStorage.getItem('selectedAddress');

  if (addrNo) {
    try {
      const response = await addressApi.getAddress(addrNo);
      if (response) {
        addressData.value = response; // ✅ 선택한 주소로 업데이트
      }
    } catch (error) {
      console.error(
        '선택한 주소를 불러오는 중 오류 발생:',
        error
      );
    }
    sessionStorage.removeItem('selectedAddress');
  }
};
// 총 결제 금액 계산
const finalPrice = computed(() => {
  if (orderType === 'cart' && cartData.value) {
    return cartData.value.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  } else if (orderType === 'item' && itemData.value) {
    return itemData.value.price;
  }
  return 0;
});

const goToAddressPage = () => {
  router.push({ name: 'Address', params: { userNo } });
};

onMounted(() => {
  fetchOrderData();
  fetchAddressData();
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

/*   결제 결과 콜백 함수 */
const callbackPayment = (response) => {
  const { success, merchant_uid, error_msg } = response;

  if (success) {
    alert('결제 성공');
    router.replace({ name: 'OrderComplete' }); // 결제 완료 페이지로 이동
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
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
    buyer_name: addressData.value?.addrName || '이름 없음', // 구매자 이름
    buyer_tel:
      addressData.value?.addrContact || '010-0000-0000', // 구매자 전화번호
    buyer_email: 'example@example.com', // 구매자 이메일 (데이터 추가 가능)
    buyer_addr:
      addressData.value?.addrAddress || '주소 없음', // 구매자 주소
    buyer_postcode:
      addressData.value?.addrZipcode || '00000', // 구매자 우편번호
  };

  /* 3. 결제 창 호출 */
  IMP.request_pay(data, callbackPayment);
};
</script>
