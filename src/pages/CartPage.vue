<template>
    <div class="container mt-5">
        <h5 class="mb-4 text-center">장바구니</h5>
        <h6 class="text-center mb-5">
            {{ cartProducts.length > 0 ? '' : '장바구니가 비어 있습니다.' }}
        </h6>

        <!-- ✅ 전체 선택 & 선택 삭제 버튼 -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
                <input type="checkbox" v-model="isAllSelected" @change="toggleAllSelection" aria-label="select-all-items" class="me-2" />
                <label for="select-all-items" class="mb-0">전체 선택</label>
            </div>

            <!-- ✅ 선택 삭제 버튼 -->
            <button class="delete-selected-button" :disabled="selectedItemCount === 0" @click="removeSelectedItems">선택 삭제</button>
        </div>

        <!-- 구분선 -->
        <hr class="divider" />

        <div class="row gx-5">
            <!-- 상품 목록 -->
            <div class="col-12 col-lg-7">
                <template v-if="cartProducts.length > 0">
                    <template v-for="(product, index) in cartProducts" :key="index">
                        <hr v-if="index !== 0" class="horizontal dark my-3" />
                        <ProductCartItem
                            :thumbSrc="product.thumbSrc"
                            :thumbAlt="product.thumbAlt"
                            :title="product.title"
                            :color="product.color"
                            :size="product.size"
                            :price="product.price"
                            :stock="product.stock"
                            :quantity="product.quantity"
                            :discount="product.discount"
                            :selected="product.selected"
                            @update-selected="updateSelected(index, $event)"
                            @update-quantity="updateQuantity(index, $event)"
                            @remove-item="removeItem(index)"
                        />
                    </template>
                </template>
                <div v-else class="text-center text-muted py-4">
                    <p>현재 장바구니에 담긴 상품이 없습니다.</p>
                </div>
            </div>

            <!-- 주문 요약 -->
            <div class="col-12 col-lg-5 mt-4 mt-lg-0">
                <OrderSummary
                    :totalPrice="subtotal"
                    :totalDiscount="totalDiscount"
                    :shippingCost="shipping"
                    :itemCount="selectedItemCount"
                    :cartProducts="cartProducts"
                    @order-selected="orderSelected"
                    @order-all="orderAll"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCartItem from '../components/cart/ProductCartItem.vue';
import OrderSummary from '../components/cart/OrderSummary.vue';

// ✅ 장바구니 데이터 (샘플 데이터)
const cartProducts = ref([
    {
        thumbSrc: new URL('../assets/images/product1.jpg', import.meta.url).href,
        thumbAlt: 'Product 1',
        title: 'Classic T-Shirt',
        color: 'Black',
        size: 'M',
        price: 25000,
        discount: 5000,
        stock: 3,
        quantity: 1,
        selected: false,
    },
    {
        thumbSrc: new URL('../assets/images/product2.jpg', import.meta.url).href,
        thumbAlt: 'Product 2',
        title: 'Denim Jacket',
        color: 'Blue',
        size: 'L',
        price: 75000,
        discount: 10000,
        stock: 5,
        quantity: 1,
        selected: false,
    },
]);

// ✅ 전체 선택 상태
const isAllSelected = computed({
    get: () => cartProducts.value.length > 0 && cartProducts.value.every((product) => product.selected),
    set: (value) => {
        cartProducts.value.forEach((product) => (product.selected = value));
    },
});

// ✅ 선택된 상품 개수
const selectedItemCount = computed(() => cartProducts.value.filter((product) => product.selected).length);

// ✅ 총 상품 금액 계산 (선택된 상품만)
const subtotal = computed(() => cartProducts.value.filter((product) => product.selected).reduce((acc, product) => acc + product.price * product.quantity, 0));

// ✅ 총 할인 금액 계산 (선택된 상품만)
const totalDiscount = computed(() => cartProducts.value.filter((product) => product.selected).reduce((acc, product) => acc + product.discount * product.quantity, 0));

// ✅ 배송비 계산 (10만 원 이상 무료 배송)
const shipping = computed(() => (subtotal.value >= 100000 ? 0 : 3000));

// ✅ 선택된 상품 삭제
function removeSelectedItems() {
    cartProducts.value = cartProducts.value.filter((product) => !product.selected);
}

// ✅ 개별 상품 선택 상태 업데이트
function updateSelected(index, isSelected) {
    cartProducts.value[index].selected = isSelected;
}

// ✅ 수량 업데이트 (최소값 1 보장)
function updateQuantity(index, newQuantity) {
    cartProducts.value[index].quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
}

// ✅ 개별 상품 제거
function removeItem(index) {
    cartProducts.value.splice(index, 1);
}

// ✅ 선택 주문 (선택된 상품만 주문)
function orderSelected() {
    const selectedItems = cartProducts.value.filter((product) => product.selected);
    if (selectedItems.length === 0) {
        alert('선택된 상품이 없습니다.');
    } else {
        alert('선택된 상품 주문: ' + JSON.stringify(selectedItems));
    }
}

// ✅ 전체 주문 (모든 상품 주문)
function orderAll() {
    if (cartProducts.value.length === 0) {
        alert('장바구니가 비어 있습니다.');
    } else {
        alert('전체 상품 주문: ' + JSON.stringify(cartProducts.value));
    }
}
</script>

<style scoped>
/* 전체 선택 체크박스 스타일 */
.select-all-container {
    display: flex;
    align-items: center;
    padding: 10px 0;
}

/* 전체 선택 & 선택 삭제 버튼 스타일 */
.d-flex.align-items-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 선택 삭제 버튼 */
.delete-selected-button {
    background-color: black;
    color: white;
    border: none;
    padding: 4px 10px; /* 버튼 크기 축소 */
    font-size: 12px; /* 글자 크기 줄이기 */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    /* 위치 조정 */
    position: relative;
    top: 5px; /* 버튼을 아래로 살짝 이동 */
}

/* 선택 삭제 버튼 - 비활성화 */
.delete-selected-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* 선택 삭제 버튼 - 호버 */
.delete-selected-button:hover:not(:disabled) {
    background-color: black;
}

/* 구분선 */
.divider {
    border: none;
    height: 1px;
    background-color: #ccc; /* 선 색상 */
    margin-bottom: 20px;
}

/* 상품 이미지 크기 축소 */
.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
}

/* 상품 리스트 간격 조정 */
.product-list-item {
    font-size: 0.9rem;
}

/* 주문 요약 크기 축소 */
.order-summary {
    font-size: 0.8rem;
    padding: 0.9rem;
}

.order-summary p {
    margin-bottom: 0.5rem;
}

/* 주문 버튼 스타일 */
.order-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>
