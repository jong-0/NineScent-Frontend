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

        <!-- 주문 버튼 -->
        <div class="order-buttons">
            <button class="selected-order" @click="$emit('order-selected')">선택 주문 ({{ selectedItemCount }})</button>
            <button class="all-order" @click="$emit('order-all')">전체 주문</button>
        </div>
    </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue';

// ✅ Props로 전달받는 데이터
const props = defineProps({
    cartProducts: { type: Array, required: true }, // 장바구니 상품 목록
    shippingCost: { type: Number, default: 0 }, // 배송비
});

// ✅ 선택된 상품만 필터링
const selectedProducts = computed(() => props.cartProducts.filter((product) => product.selected));

// ✅ 선택된 상품 개수
const selectedItemCount = computed(() => selectedProducts.value.length);

// ✅ 선택된 상품만 반영한 총 상품 금액 (subtotal)
const subtotal = computed(() => selectedProducts.value.reduce((acc, product) => acc + product.price * product.quantity, 0));

// ✅ 선택된 상품만 반영한 총 할인 금액 (totalDiscount)
const totalDiscount = computed(() => selectedProducts.value.reduce((acc, product) => acc + product.discount * product.quantity, 0));

// ✅ 선택된 상품만 반영한 최종 결제 금액
const finalTotal = computed(() => subtotal.value - totalDiscount.value + props.shippingCost);

// ✅ 통화 형식 변환
const formattedTotalPrice = computed(() => subtotal.value.toLocaleString());
const formattedTotalDiscount = computed(() => totalDiscount.value.toLocaleString());
const formattedShipping = computed(() => props.shippingCost.toLocaleString());
const formattedFinalTotal = computed(() => finalTotal.value.toLocaleString());

// ✅ 변경 사항 감지 및 디버깅 로그 출력
watchEffect(() => {
    console.log('🛒 선택된 상품만 반영된 OrderSummary 업데이트:', {
        선택된상품수: selectedItemCount.value,
        선택된상품총금액: subtotal.value,
        선택된상품총할인: totalDiscount.value,
        최종결제금액: finalTotal.value,
    });
});
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
