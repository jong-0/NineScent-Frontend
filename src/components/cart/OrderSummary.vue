<template>
    <ul class="list-unstyled">
        <li class="mt-2">
            <div class="d-flex justify-content-between">
                <p :style="{ color: textColor }">Subtotal</p>
                <p :style="{ color: textColor, fontWeight: 'bold' }">${{ formattedSubtotal }}</p>
            </div>
        </li>
        <li class="mt-2">
            <div class="d-flex justify-content-between">
                <p :style="{ color: textColor }">
                    Shipping estimate
                    <span data-bs-toggle="tooltip" data-bs-placement="top" title="More information related to shipping" data-container="body" data-animation="true">
                        <i class="fas fa-question-circle text-sm"></i>
                    </span>
                </p>
                <p :style="{ color: textColor, fontWeight: 'bold' }">${{ formattedShipping }}</p>
            </div>
        </li>
        <li class="border-bottom mt-2">
            <div class="d-flex justify-content-between">
                <p :style="{ color: textColor }">
                    Tax estimate
                    <span data-bs-toggle="tooltip" data-bs-placement="top" title="This may vary depending on the country you are in" data-container="body" data-animation="true">
                        <i class="fas fa-question-circle text-sm"></i>
                    </span>
                </p>
                <p :style="{ color: textColor, fontWeight: 'bold' }">${{ formattedTax }}</p>
            </div>
        </li>
        <li class="mt-4">
            <div class="d-flex justify-content-between">
                <h5 :style="{ color: textColor }">Total</h5>
                <h5 :style="{ color: textColor }">${{ formattedTotal }}</h5>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { computed } from 'vue';
import { ref } from 'vue';

// Props
defineProps({
    subtotal: {
        type: Number,
        required: true,
    },
    textColor: {
        type: String,
        default: 'black',
    },
});

// Constants
const tax = 7;
const shipping = computed(() => (props.subtotal >= 100 ? 0 : 25));
const total = computed(() => props.subtotal + shipping.value + tax);

// Computed properties for formatted values
const formattedSubtotal = computed(() => props.subtotal.toLocaleString());
const formattedShipping = computed(() => shipping.value.toLocaleString());
const formattedTax = computed(() => tax.toLocaleString());
const formattedTotal = computed(() => total.value.toLocaleString());
</script>
