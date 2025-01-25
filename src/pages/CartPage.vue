<template>
    <div class="container mt-5">
        <h5 class="mb-4 text-center">장바구니</h5>
        <h6 class="text-center mb-7">You are eligible for Free Shipping.</h6>

        <div v-if="mockProducts.length > 0" class="row">
            <div class="col-12 col-lg-7">
                <template v-for="(product, i) in mockProducts" :key="i">
                    <hr v-if="i !== 0" class="horizontal dark my-4" />
                    <ProductCartItem
                        :thumbSrc="product.thumb_src"
                        :thumbAlt="product.thumb_alt"
                        :title="product.title"
                        :color="product.color"
                        :size="product.size"
                        :price="product.price"
                        :stock="product.stock"
                    />
                </template>
            </div>
            <div class="col-12 col-lg-5 mt-5 mt-lg-0">
                <div class="card shadow-xs border bg-gray-100">
                    <div class="card-body p-lg-5">
                        <h5 class="mb-4">Order Summary</h5>
                        <OrderSummary :subtotal="subtotal" />
                        <button class="btn btn-dark btn-lg w-100">Checkout</button>
                        <button class="btn btn-white btn-lg w-100">Continue Shopping</button>
                        <p class="text-center">Tax included. Shipping calculated at checkout.</p>
                    </div>
                </div>
                <!-- <p class="d-flex align-items-center justify-content-center text-body mt-4">
                    <svg class="me-2" width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.21652 6.14286H7.78795V4.42857C7.78795 3.79762 7.56473 3.25893 7.1183 2.8125C6.67188 2.36607 6.13318 2.14286 5.50223 2.14286C4.87128 2.14286 4.33259 2.36607 3.88616 2.8125C3.43973 3.25893 3.21652 3.79762 3.21652 4.42857V6.14286ZM10.6451 7V12.1429C10.6451 12.381 10.5618 12.5833 10.3951 12.75C10.2284 12.9167 10.026 13 9.78795 13H1.21652C0.978423 13 0.776042 12.9167 0.609375 12.75C0.442708 12.5833 0.359375 12.381 0.359375 12.1429V7C0.359375 6.7619 0.442708 6.55952 0.609375 6.39286C0.776042 6.22619 0.978423 6.14286 1.21652 6.14286H1.50223V4.42857C1.50223 3.33333 1.89509 2.39286 2.6808 1.60714C3.46652 0.821428 4.40699 0.428571 5.50223 0.428571C6.59747 0.428571 7.53795 0.821428 8.32366 1.60714C9.10938 2.39286 9.50223 3.33333 9.50223 4.42857V6.14286H9.78795C10.026 6.14286 10.2284 6.22619 10.3951 6.39286C10.5618 6.55952 10.6451 6.7619 10.6451 7Z"
                            fill="#495057"
                        />
                    </svg>
                    Secured Payment with:
                </p>
                <div class="d-flex justify-content-center">
                    <svg v-for="index in 3" :key="index" class="me-2" width="31" height="21" viewBox="0 0 31 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1 L30 1 L30 20 L1 20 Z" stroke="#495057" fill="none" />
                    </svg>
                </div> -->
            </div>
        </div>
        <div v-else>장바구니가 비어 있습니다.</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCartItem from '../components/cart/ProductCartItem.vue';
import OrderSummary from '../components/cart/OrderSummary.vue';

// Mock 데이터 생성
const mockProducts = ref([
    {
        thumb_src: new URL('../assets/images/product1.jpg', import.meta.url).href,
        thumb_alt: 'Product 1',
        title: 'Classic T-Shirt',
        color: 'Black',
        size: 'M',
        price: 25,
        stock: true,
    },
    {
        thumb_src: new URL('../assets/images/product2.jpg', import.meta.url).href,
        thumb_alt: 'Product 2',
        title: 'Denim Jacket',
        color: 'Blue',
        size: 'L',
        price: 75,
        stock: true,
    },
    {
        thumb_src: new URL('../assets/images/product3.jpg', import.meta.url).href,
        thumb_alt: 'Product 3',
        title: 'Sneakers',
        color: 'White',
        size: '42',
        price: 120,
        stock: false,
    },
]);

// 총합 계산
const subtotal = computed(() => mockProducts.value.reduce((acc, product) => acc + (product.price || 0), 0));
</script>
