<template>
    <div class="product-item d-block d-md-flex align-items-center position-relative">
        <!-- 체크박스 -->
        <div class="checkbox-container">
            <input type="checkbox" :checked="selected" @change="$emit('update-selected', $event.target.checked)" aria-label="select-item" />
        </div>

        <!-- 이미지 -->
        <div class="product-image-container me-3">
            <img class="product-image" :src="mainPhoto" :alt="thumbAlt" />
        </div>

        <!-- 상품 정보 -->
        <div class="w-100 w-md-50 ps-md-4">
            <h6 class="text-lg mb-1">{{ title }}</h6>
            <div class="d-flex">
                <p class="pe-3 mb-0">{{ size }}</p>
                <!-- <p class="border-start ps-3 mb-0">{{ size }}</p> -->
            </div>
            <!-- 재고 상태 표시 -->
            <div class="stock-message-container">
                <i :class="stockIcon" class="text-sm" style="font-size: 12px"></i>
                <p class="text-muted mb-0 ms-2 stock-message">
                    {{ stockMessage }}
                </p>
            </div>

            <!-- 상품 금액 -->
            <p class="text-muted mt-2">{{ formattedPrice }} 원</p>
        </div>

        <!-- 수량 입력 영역 -->
        <div class="quantity-input me-3">
            <input type="number" :value="quantity" @input="handleQuantityChange" min="1" :max="stock" class="form-control" placeholder="1" aria-label="amount" />
        </div>

        <!-- 총 금액 영역 -->
        <div class="price-area ms-3 flex-grow-1 text-end position-relative">
            <!-- 삭제 버튼 (금액 위쪽) -->
            <button class="delete-button" @click.prevent="removeItem">
                <i class="fas fa-trash-alt" style="font-size: 12px"></i>
                삭제
            </button>
            <h6 class="mb-1">{{ totalPrice }} 원</h6>
            <p class="text-muted small mt-1">- {{ formattedDiscount }} 원</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { cartApi } from '@/api/cartApi';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// Props 선언
const props = defineProps({
    itemId: { type: Number, required: true }, // 상품 ID
    imageUrl: { type: String, required: true },
    thumbAlt: { type: String, required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    selected: { type: Boolean, default: false }, // 선택 여부
});

const mainPhoto = computed(() => props.imageUrl);

// Emits 선언
const emit = defineEmits(['update-quantity', 'remove-item']);

// 계산된 속성
const formattedPrice = computed(() => props.price.toLocaleString());
const totalPrice = computed(() => (props.price * props.quantity).toLocaleString());
const formattedDiscount = computed(() => (props.discount * props.quantity).toLocaleString());

// 재고 메시지 설정
const stockMessage = computed(() => {
    if (props.stock === 0) {
        return '재고 없음';
    } else if (props.stock < 5) {
        return `재고 수량: ${props.stock}개`;
    }
    return '';
});

// 재고 아이콘 설정
const stockIcon = computed(() => {
    return props.stock === 0 ? 'fas fa-minus-circle text-danger' : 'fas fa-check text-success';
});

// 수량 변경
const handleQuantityChange = (event) => {
    let newQuantity = parseInt(event?.target?.value, 10) || 1;

    //재고 초과 방지
    if (newQuantity > props.stock) {
        newQuantity = props.stock;
    }
    console.log('🔄 수량 변경 이벤트 발생:', newQuantity, event); // 디버깅 로그
    emit('update-quantity', newQuantity);
};

// 개별 상품 제거 (API 요청)
const removeItem = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        await cartApi.removeItem(authStore.userNo, props.itemId);
        emit('remove-item', props.itemId);
    } catch (error) {
        alert('상품 삭제에 실패했습니다.');
    }
};
</script>

<style scoped>
/* 상품 아이템 컨테이너 */
.product-item {
    padding: 5px;
    /* border-bottom: 1px solid #ddd; */
}

/* 체크박스 컨테이너 */
.checkbox-container {
    align-self: flex-start;
    margin-top: 5px;
    margin-right: 15px;
}

/* 이미지 컨테이너 */
.product-image-container {
    width: 200px;
    height: 100px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 이미지 */
.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 재고 상태 메시지 컨테이너 */
.stock-message-container {
    display: flex;
    align-items: center;
    height: 20px; /* 고정 높이로 공간 유지 */
}

/* 재고 상태 메시지 스타일 */
.stock-message {
    font-size: 14px;
    visibility: hidden; /* 기본적으로 보이지 않음 */
}

/* 재고가 5개 미만일 때만 메시지를 보이도록 설정 */
.stock-message-container:not(:empty) .stock-message {
    visibility: visible;
}

/* 수량 입력 영역 */
.quantity-input {
    width: 60px;
    min-width: 60px;
    flex-shrink: 0;
}

/* 수량 입력 필드 스타일 */
.quantity-input .form-control {
    padding: 0.25em 0.5em;
    text-align: center;
}

/* 총 금액 영역 */
.price-area {
    min-width: 120px;
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
    position: relative;
}

.price-area h6 {
    margin-top: 15px;
}

/* 삭제 버튼 스타일 */
.delete-button {
    position: absolute;
    top: -20px; /* 금액 위쪽으로 이동 */
    right: -5px;

    background-color: transparent;
    border: none;
    color: #888;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
}

.delete-button i {
    font-size: 16px;
}

.delete-button:hover {
    color: red;
}

.small-icon {
    font-size: 5px; /* 원하는 크기로 조절 */
}

.medium-icon {
    font-size: 16px;
}

.large-icon {
    font-size: 24px;
}

@media (max-width: 767px) {
    /* ✅ 상품 아이템을 줄바꿈 없이 유지 */
    .product-item {
        flex-wrap: nowrap; /* ✅ 한 줄 유지 */
        align-items: center;
        gap: 8px;
    }

    /* ✅ 이미지 크기 축소 */
    .product-image-container {
        width: 70px;
        height: 70px;
    }

    .product-image {
        width: 100%;
        height: 100%;
    }

    /* ✅ 상품 정보 크기 조정 */
    .product-info {
        min-width: 90px;
        flex-grow: 1;
        text-align: left;
    }

    /* ✅ 수량 입력 필드 크기 조정 */
    .quantity-input {
        width: 40px;
        min-width: 40px;
    }

    /* ✅ 가격 및 삭제 버튼 정렬 */
    .price-area {
        min-width: 80px;
        text-align: right;
    }

    /* ✅ 삭제 버튼 크기 및 정렬 */
    .delete-button {
        font-size: 12px;
        width: auto;
        text-align: right;
    }
}
</style>
