<template>
    <div class="container mt-5">
        <h2 class="mb-3 text-center">Shopping Cart</h2>
        <h5 class="text-center mb-5">You are eligible for Free Shipping.</h5>
        <div class="row">
            <div class="col-12 col-lg-7">
                <ProductCartItem
                    v-for="product in cartItems"
                    :key="product.id"
                    :thumb_src="product.thumb_src"
                    :thumb_alt="product.thumb_alt"
                    :title="product.title"
                    :color="product.color"
                    :size="product.size"
                    :price="product.price"
                    :stock="product.stock"
                />
                <hr v-if="cartItems.length > 1" class="horizontal dark my-4" />
            </div>
            <div class="col-12 col-lg-5 mt-5 mt-lg-0">
                <div class="card shadow-xs border bg-gray-100">
                    <div class="card-body p-lg-5">
                        <h5 class="mb-4">Order Summary</h5>
                        <OrderSummary :subtotal="subtotal" />
                        <button class="btn btn-dark btn-lg w-100 mt-3">Checkout</button>
                        <button class="btn btn-white btn-lg w-100 mt-2">Continue Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import ProductCartItem from './ProductCartItem.vue';
import OrderSummary from './OrderSummary.vue';
export default {
    components: { ProductCartItem, OrderSummary },
    setup() {
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

        return { cartItems, subtotal };
    },
};
</script>
