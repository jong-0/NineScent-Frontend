<template>
  <div class="order-history">
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

    <h3 class="order-history-title">최근 주문 내역</h3>

    <div
      v-if="groupedOrders.length === 0"
      class="no-orders"
    >
      주문 내역이 없습니다.
    </div>

    <div
      v-for="(orders, date) in groupedOrders"
      :key="date"
      class="order-group"
    >
      <h4 class="order-date">📅 {{ date }}</h4>
      <div
        v-for="order in orders"
        :key="order.orderId"
        class="order-item"
        @click="goToOrderDetail(order.orderId)"
      >
        <div class="order-details">
          <ul>
            <li
              v-for="item in order.orderItems"
              :key="item.itemId"
            >
              <img
                :src="item.mainPhoto"
                alt="상품 이미지"
                class="product-image"
              />
              <span class="item-name">{{
                item.itemName
              }}</span>
              <span class="item-info">
                {{
                  item.discountedPrice.toLocaleString()
                }}원 × {{ item.quantity }}개</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <button @click="goToAllOrders" class="view-all-btn">
      📜 주문 내역 전체보기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import mypageApi from '@/api/mypageApi';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const ordersData = ref([]);

//    날짜 배열을 변환하여 YYYY-MM-DD HH:mm 형식으로 표시
const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length < 3)
    return '날짜 정보 없음';
  return `${dateArray[0]}-${String(dateArray[1]).padStart(
    2,
    '0'
  )}-${String(dateArray[2]).padStart(2, '0')} ${String(
    dateArray[3]
  ).padStart(2, '0')}:${String(dateArray[4]).padStart(
    2,
    '0'
  )}`;
};

//    주문을 날짜별로 그룹화 (YYYY-MM-DD 기준)
const groupedOrders = computed(() => {
  const grouped = {};
  ordersData.value.forEach((order) => {
    const dateKey = formatDate(order.orderDate).split(
      ' '
    )[0]; // YYYY-MM-DD만 사용
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(order);
  });
  return grouped;
});

const fetchOrders = async () => {
  try {
    const response = await mypageApi.getRecentOrders(
      authStore.userNo
    );
    if (response) ordersData.value = response;
  } catch (error) {
    console.error('주문내역을 불러올 수 없습니다', error);
  }
};
const goToOrderDetail = (orderId) => {
  router.push({ name: 'OrderDetail', params: { orderId } });
};
const goToAllOrders = () => {
  router.push({ name: 'OrderList' });
};

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
  fetchOrders();
});
</script>

<style scoped>
/* 전체 컨테이너 */
.order-history {
  max-width: 700px;
  margin: 20px auto;
  padding: 15px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 제목 스타일 */
.order-history-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

/* 주문이 없을 경우 */
.no-orders {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #888;
}

/* 날짜별 그룹화 */
.order-group {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

/* 날짜 헤더 */
.order-date {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

/* 주문 목록 */
.order-item {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.order-item:last-child {
  border-bottom: none;
}

/* 상품 리스트 */
.order-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}
.order-details li {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
}

.item-name {
  font-weight: bold;
}

/* 전체 주문 내역 보기 버튼 */
.view-all-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.view-all-btn:hover {
  background-color: #0056b3;
}
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

/*    반응형 스타일 */
@media (max-width: 768px) {
  .order-history {
    max-width: 90%;
  }

  .order-group {
    padding: 8px;
  }

  .order-details li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
