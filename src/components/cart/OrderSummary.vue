<template>
    <div class="order-summary-container p-4 rounded shadow-sm">
        <!-- 상품 금액 -->
        <div class="d-flex justify-content-between">
            <p>상품 금액</p>
            <p>{{ formattedTotalPrice }} 원</p>
        </div>

        <!-- 총 할인 금액 -->
        <div class="d-flex justify-content-between">
            <p>총 할인</p>
            <p>{{ formattedTotalDiscount }} 원</p>
        </div>

        <!-- 배송비 -->
        <div class="d-flex justify-content-between border-bottom pb-2">
            <p>배송비</p>
            <p>{{ formattedShipping }} 원</p>
        </div>

        <!-- 결제 예정 금액 -->
        <div class="d-flex justify-content-between mt-3">
            <h5>결제 예정 금액</h5>
            <h5>{{ formattedFinalTotal }} 원</h5>
        </div>

        <!-- 구매하기 버튼 -->
        <!-- <button class="btn btn-success w-100 mt-4">구매하기 ({{ itemCount }})</button> -->

        <!-- 주문 버튼 -->
        <div class="order-buttons">
            <button class="selected-order" @click="$emit('order-selected')">선택 주문 ({{ itemCount }})</button>
            <button class="all-order" @click="$emit('order-all')">전체 주문</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// ✅ Props로 전달받는 데이터
const props = defineProps({
    totalPrice: { type: Number, required: true }, // 총 상품 금액
    totalDiscount: { type: Number, required: true }, // 총 할인 금액
    shippingCost: { type: Number, default: 0 }, // 배송비
    itemCount: { type: Number, required: true }, // 선택된 상품 수
});

// ✅ 최종 결제 금액 계산
const finalTotal = computed(() => props.totalPrice - props.totalDiscount + props.shippingCost);

// ✅ 통화 형식 변환
const formattedTotalPrice = computed(() => props.totalPrice.toLocaleString());
const formattedTotalDiscount = computed(() => props.totalDiscount.toLocaleString());
const formattedShipping = computed(() => props.shippingCost.toLocaleString());
const formattedFinalTotal = computed(() => finalTotal.value.toLocaleString());
</script>

<style scoped>
/* 주문 요약 컨테이너 스타일 */
.order-summary-container {
    background-color: #f7f6f0;
    border: 1px solid #d6d3cb;
}

/* 기본 텍스트 스타일 */
p,
h5 {
    margin: 0;
}

/* 주문 버튼 스타일 */
.order-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 10px;
}

.order-buttons button {
    flex: 1;
    padding: 10px 10px;
    border: none;
    border-radius: 5px;
    font-size: 0.8rem;
    cursor: pointer;
}

/* 선택 주문 버튼 */
.order-buttons .selected-order {
    background-color: #969696;
    color: white;
}

/* 전체 주문 버튼 */
.order-buttons .all-order {
    background-color: #1a1a1a;
    color: white;
}
</style>
