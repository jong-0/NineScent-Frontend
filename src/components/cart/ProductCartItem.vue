<template>
    <div class="d-flex align-items-center">
        <img :src="thumb_src" :alt="thumb_alt" class="rounded-3 me-3" />
        <div class="flex-grow-1">
            <h6 class="mb-0">{{ title }}</h6>
            <p class="text-muted">{{ color }} / {{ size }}</p>
            <p>{{ formatCurrency(price) }}</p>
        </div>
        <button @click="$emit('remove', productId)" class="btn btn-danger btn-sm">Remove</button>
    </div>
</template>

<script>
export default {
    props: {
        thumb_src: String,
        thumb_alt: String,
        title: String,
        color: String,
        size: String,
        price: Number,
        stock: Boolean,
    },
    methods: {
        formatCurrency(value) {
            return `$${value.toFixed(2)}`;
        },
    },
};
</script>
