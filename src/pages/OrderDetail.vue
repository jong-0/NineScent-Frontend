<template>
  <div>
    <h1>주문 상세 정보</h1>
    <p>
      주문번호: {{ orderDetail?.orderId || '정보 없음' }}
    </p>
    <p>
      주문자: {{ orderDetail?.user?.name || '정보 없음' }}
    </p>
    <p>주문 날짜: {{ formattedOrderDate }}</p>
    <p>
      배송 상태:
      {{
        orderDetail?.deliveryDone ? '배송 완료' : '배송 중'
      }}
    </p>
    <p>
      결제 상태:
      {{
        orderDetail?.paymentDone ? '결제 완료' : '결제 대기'
      }}
    </p>

    <h2>주문 상품 목록</h2>
    <ul>
      <li
        v-for="item in orderDetail?.orderItems || []"
        :key="item.orderItemId"
      >
        <p>
          상품명: {{ item.item?.itemName || '정보 없음' }}
        </p>
        <p>
          설명:
          {{ item.item?.itemDescription || '설명 없음' }}
        </p>
        <p>수량: {{ item.quantity }}</p>
        <p>
          가격:
          {{
            item.originalPrice ||
            item.item?.price ||
            '가격 없음'
          }}원
        </p>
        <p>
          할인된 가격:
          {{
            item.discountedPrice > 0
              ? item.discountedPrice
              : '할인 없음'
          }}원
        </p>
      </li>
    </ul>

    <h2>배송 정보</h2>
    <p>
      수령인:
      {{ orderDetail?.address?.addrName || '정보 없음' }}
    </p>
    <p>
      연락처:
      {{ orderDetail?.address?.addrContact || '정보 없음' }}
    </p>
    <p>
      주소:
      {{
        orderDetail?.address?.addrAddress || '주소 없음'
      }}
      {{ orderDetail?.address?.addrDetail || '' }}
    </p>
    <p>
      추가 요청사항:
      {{ orderDetail?.address?.addrRequest || '없음' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.query.orderId || route.params.orderId; // ✅ query 또는 params에서 orderId 가져오기
const orderDetail = ref(null);

// ✅ 주문 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 변환
const formattedOrderDate = computed(() => {
  if (!orderDetail.value?.orderDate) return '정보 없음';
  const dateArr = orderDetail.value.orderDate;
  return `${dateArr[0]}-${String(dateArr[1]).padStart(
    2,
    '0'
  )}-${String(dateArr[2]).padStart(2, '0')} 
            ${String(dateArr[3]).padStart(2, '0')}:${String(
    dateArr[4]
  ).padStart(2, '0')}:${String(dateArr[5]).padStart(
    2,
    '0'
  )}`;
});

// ✅ 주문 상세 데이터 불러오기
const fetchOrderDetail = async () => {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok)
      throw new Error('주문 정보를 가져오지 못했습니다.');
    orderDetail.value = await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};

onMounted(() => {
  fetchOrderDetail();
});
</script>
