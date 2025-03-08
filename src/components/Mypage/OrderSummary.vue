<template>
  <!-- 📌 주문 상태 요약 -->
  <section class="order-info">
    <div class="order-status">
      <div
        v-for="(count, status) in orderSummary"
        :key="status"
      >
        <p>
          {{ translatedStatus[status] || status }}
        </p>
        <h4>{{ count }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import mypageApi from '@/api/mypageApi';

const authStore = useAuthStore();
const orderSummary = ref({
  pendingPayment: 0,
  preparingDelivery: 0,
  // shipping: 0,
  delivered: 0,
  canceled: 0,
});

// 상태를 한글로 변환하는 computed 속성
const translatedStatus = computed(() => ({
  pendingPayment: '입금 대기 중',
  preparingDelivery: '배송 준비 중',
  // shipping: '배송 중',
  delivered: '배송 완료',
  canceled: '취소 / 반품 / 교환',
}));

// 📌 주문 상태 개수 조회
const fetchOrderSummary = async () => {
  try {
    const response = await mypageApi.getOrderSummary(
      authStore.userNo
    );
    if (response) orderSummary.value = response;
  } catch (error) {
    console.error(
      '주문 상태 요약을 불러올 수 없습니다.',
      error
    );
  }
};

onMounted(() => {
  fetchOrderSummary();
});
</script>

<style scoped>
.order-info {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.order-status,
.return-status {
  display: flex;
  gap: 20px;
}

.order-status div,
.return-status div {
  text-align: center;
}
</style>
