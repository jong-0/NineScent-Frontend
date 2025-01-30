<template>
    <ul class="list-unstyled">
        <li v-for="item in items" :key="item.id" class="d-flex justify-content-between">
            <p>{{ item.title }}</p>
            <p>${{ (item.price * item.quantity).toFixed(2) }}</p>
        </li>
        <li class="d-flex justify-content-between">
            <h5>Total</h5>
            <h5>${{ total.toFixed(2) }}</h5>
        </li>
    </ul>
</template>

<script>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

export default {
    setup() {
        const cartStore = useCartStore();
        const items = computed(() => cartStore.items);
        const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

        return { items, total };
    },
};
</script>
