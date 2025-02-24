<template>
  <div class="container mt-5">
    <h5 class="mb-4 text-center">주문서</h5>

    <div class="row gx-5">
      <!-- 주문 상품 목록 -->
      <div class="col-12 col-lg-8">
        <template v-if="orderType === 'cart' && cartData">
          <h6 class="mb-3">장바구니 상품</h6>
          <ul class="cart-item-list">
            <li
              v-for="item in cartData"
              :key="item.itemId"
              class="cart-item"
            >
              <img
                :src="item.thumbSrc"
                alt="상품 이미지"
                class="product-image"
              />
              <div class="item-details">
                <p class="item-name">{{ item.title }}</p>
                <p class="item-price">
                  {{ item.price }}원 × {{ item.quantity }}개
                </p>
              </div>
            </li>
          </ul>
        </template>

        <template
          v-else-if="orderType === 'item' && itemData"
        >
          <h6 class="mb-3">구매 상품</h6>
          <div class="single-item">
            <img
              :src="itemData.mainPhoto"
              alt="상품 이미지"
              class="product-image"
            />
            <div class="item-details">
              <p class="item-name">
                {{ itemData.itemName }}
              </p>
              <p class="item-price">
                {{ itemData.price }}원 ×
                {{ itemData.quantity }}개
              </p>
            </div>
          </div>
        </template>

        <div v-else class="text-center text-muted py-4">
          <p>주문할 상품이 없습니다.</p>
        </div>
      </div>
      <!-- 배송지 및 결제 정보 -->
      <div class="col-12 col-lg-4 mt-4 mt-lg-0">
        <h6 class="mb-3">배송 정보</h6>
        <div v-if="addressData" class="address-info">
          <p>
            <strong>{{ addressData.addrName }}</strong>
          </p>
          <p>
            {{ addressData.addrAddress }}
            {{ addressData.addrDetail }}
          </p>
          <p>{{ addressData.addrContact }}</p>
          <button
            class="change-address-btn"
            @click="goToAddressPage(userNo)"
          >
            배송지 변경
          </button>
        </div>
        <!-- 결제 요약 -->
        <h6 class="mt-4">결제 금액</h6>
        <div class="order-summary">
          <p>
            주문 금액:
            <strong>{{ totalProductPrice }}원</strong>
          </p>
          <p>할인 금액: <strong>{{}}</strong></p>
          <p>
            배송비: <strong>{{ shippingCost }}원</strong>
          </p>
          <p>
            총 금액:
            <strong>{{ finalTotalAmount }}원</strong>
          </p>
        </div>
        <button class="checkout-btn" @click="onPayment">
          결제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import addressApi from '@/api/addressApi';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';
import { result } from 'lodash';
const authStore = useAuthStore();

const router = useRouter();

const cartData = ref(null);
const itemData = ref(null);
const addressData = ref(null);
const orderType = sessionStorage.getItem('orderType');
const userNo = authStore.userNo; // authStore에서 가져오기
const shippingCost = ref(0);

const fetchOrderData = () => {
  if (orderType === 'cart') {
    const storedCart = sessionStorage.getItem('cartData');
    const storedShippingCost =
      sessionStorage.getItem('shippingCost');
    shippingCost.value = storedShippingCost
      ? Number(storedShippingCost)
      : 0;

    cartData.value = storedCart
      ? JSON.parse(storedCart)
      : null;
    console.log('cartData:', cartData);
  } else if (orderType === 'item') {
    const storedItem = sessionStorage.getItem('itemData');
    const storedShippingCost =
      sessionStorage.getItem('shippingCost');
    shippingCost.value = storedShippingCost
      ? Number(storedShippingCost)
      : 0;
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
// 총 상품 금액 (배송비 전)
const totalProductPrice = computed(() => {
  if (
    orderType === 'cart' &&
    Array.isArray(cartData.value)
  ) {
    return cartData.value.reduce(
      (sum, item) =>
        sum + (item.quantity || 1) * (item.price || 0),
      0
    );
  } else if (orderType === 'item' && itemData.value) {
    return (
      (itemData.value.price || 0) *
      (itemData.value.quantity || 1)
    );
  }
  return 0;
});

// 총 결제 금액 (배송비 포함)
const finalTotalAmount = computed(
  () => totalProductPrice.value + shippingCost.value
);
// 총 할인 금액
const totalDiscount = computed(() => {
  if (
    orderType === 'cart' &&
    Array.isArray(cartData.value)
  ) {
    return cartData.value.reduce(
      (sum, item) => sum + item.discount * item.quantity,
      0
    );
  } else if (orderType === 'item' && itemData.value) {
    return (
      (itemData.value.discount || 0) *
      (itemData.value.quantity || 1)
    );
  }
  return 0;
});

const goToAddressPage = () => {
  router.push({
    name: 'Address',
    query: { source: 'checkout' },
  });
};

onMounted(() => {
  fetchOrderData();
  fetchAddressData();
});

// ✅ 결제 처리 함수 (수정된 코드)
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
    amount: finalTotalAmount.value, // 결제금액
    name: '주문 상품 결제', // 주문명
    buyer_name: addressData.value?.addrName || '이름 없음', // 구매자 이름
    buyer_tel:
      addressData.value?.addrContact || '010-0000-0000', // 구매자 전화번호
    buyer_email: 'example@example.com', // 구매자 이메일 (데이터 추가 가능)
  };

  /* 3. 결제 창 호출 */
  IMP.request_pay(data, callbackPayment);
};

/* ✅ 결제 결과 콜백 함수 (불필요한 호출 제거) */
const callbackPayment = async (response) => {
  const { success, error_msg } = response;

  if (success) {
    alert('결제가 완료되었습니다.');
    await saveOrder(); // 결제 성공 후 주문 저장
    router.replace({ name: 'OrderComplete' }); // 결제 완료 페이지로 이동
  } else {
    alert(`결제 실패: ${error_msg}`);
    return; // ✅ 취소 시 추가 동작 방지
  }
};

// 주문 저장 api 호출
const saveOrder = async () => {
  try {
    const orderData = {
      userNo: Number(userNo),
      addressNo: addressData.value.addrNo,
      paymentDone: true,
      orderItems:
        orderType === 'cart'
          ? cartData.value.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              originalPrice: item.price,
              discountedPrice:
                item.price - (item.discount || 0),
            }))
          : [
              {
                itemId: itemData.value.itemId,
                quantity: itemData.value.quantity,
                originalPrice: itemData.value.price,
                discountedPrice:
                  itemData.value.price -
                  (itemData.value.discount || 0),
              },
            ],
      totalPrice: totalProductPrice.value,
      totalDiscount: totalDiscount.value,
      finalAmount: finalTotalAmount.value,
      shippingFee: shippingCost.value,
    };
    console.log('****주문데이터', orderData);

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('주문 저장 실패');
    }

    // 주문 완료 페이지로 이동
    router.replace({
      name: 'OrderComplete',
      params: { orderId: result.orderId },
    });
  } catch (error) {
    console.log('주문 저장 오류 발생', error);

    alert('주문 저장에 실패했습니다. 다시 시도해 주세요');
  }
};
</script>

<style scoped>
/* 전체 컨테이너 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 주문 상품 목록 */
.cart-item-list {
  list-style-type: none;
  padding: 0;
}

.cart-item,
.single-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

/* 상품 이미지 */
.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

/* 상품 정보 */
.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 14px;
  font-weight: bold;
}

.item-price {
  font-size: 13px;
  color: #777;
}

/* 배송 정보 */
.address-info {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.change-address-btn {
  background-color: black;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.change-address-btn:hover {
  background-color: #333;
}

/* 주문 요약 */
.order-summary {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.order-summary p {
  margin-bottom: 5px;
  font-size: 14px;
}

/* 결제 버튼 */
.checkout-btn {
  width: 100%;
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #cc5200;
}

/* ✅ 반응형 디자인 */
@media (max-width: 992px) {
  .row {
    display: flex;
    flex-direction: column;
  }

  .col-12 {
    width: 100%;
  }

  .col-lg-8,
  .col-lg-4 {
    width: 100%;
  }

  .cart-item,
  .single-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-image {
    width: 100%;
    height: auto;
    max-width: 250px;
  }

  .item-details {
    text-align: center;
    width: 100%;
  }

  .address-info {
    text-align: center;
  }

  .change-address-btn,
  .checkout-btn {
    width: 100%;
  }
}
</style>
