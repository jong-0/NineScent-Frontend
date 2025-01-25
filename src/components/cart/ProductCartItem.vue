<template>
    <div class="d-block d-md-flex">
        <!-- src를 computed로 전달 -->
        <img class="w-50 w-md-30 rounded-3" :src="imageSrc" :alt="thumbAlt" />
        <div class="w-100 w-md-50 ps-md-4">
            <h6 class="text-lg mb-1">{{ title }}</h6>
            <div class="d-flex">
                <p class="pe-3 mb-0">{{ color }}</p>
                <p class="border-start ps-3 mb-0">{{ size }}</p>
            </div>
            <div class="d-flex align-items-center mt-6">
                <template v-if="stock">
                    <i class="fas fa-check text-lg text-success"></i>
                    <p class="mb-0 ms-2 text-sm">In Stock</p>
                </template>
                <template v-else>
                    <i class="fas fa-minus-circle text-lg"></i>
                    <p class="mb-0 ms-2 text-sm">Out of Stock</p>
                </template>
            </div>
        </div>
        <div class="w-20 w-md-10 mt-4 mt-md-0">
            <input type="number" min="0" class="form-control" placeholder="1" aria-label="amount" />
        </div>
        <h4 class="ms-3">${{ formattedPrice }}</h4>
        <div class="w-10 text-end">
            <a href="#">
                <i class="fas fa-times ms-3"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
defineProps({
    thumbSrc: {
        type: String,
        required: true,
    },
    thumbAlt: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Boolean,
        required: true,
    },
});

// Computed properties
const formattedPrice = computed(() => price.toLocaleString());

// 이미지 URL 계산
const imageSrc = computed(() => `${import.meta.env.BASE_URL}${thumbSrc}`);
</script>
