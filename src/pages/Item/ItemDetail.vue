<template>
    <div v-if="!isLoading">
        <div class="product-detail">
            <!-- 상품 정보 섹션 -->
            <div class="product-container">
                <div class="product-images">
                    <!-- 하드코딩 -->
                    <!-- <img :src="product.photo" alt="Product Image" class="main-image" /> -->
                    <!-- <img class="main-image" src="@/assets/images/product2.jpg" alt="" /> -->

                    <!--백엔 연동(수정중 지우지 말아주세요) -->
                    <!-- <img :src="generateImageUrl(product.categoryId, product.itemName, 'main')" class="main-image" alt="Product Image" /> -->
                    <!-- <img :src="encodeUrl(product.mainPhoto)" class="main-image" alt="Product Image" /> -->

                    <img v-if="product.mainPhoto" :src="product.mainPhoto" class="main-image" alt="Product Image" />
                    <!-- <img v-else src="@/assets/images/product1.jpg" class="main-image" alt="Default Image" /> -->
                </div>

                <div class="product-info">
                    <div class="product-info-wrapper">
                        <h1>{{ product.itemName }} {{ product.itemSize }}</h1>
                        <p class="price">{{ formatPrice(product.price) }}원</p>
                        <p>{{ product.itemTitle }}</p>
                        <p>{{ product.itemDescription }}</p>
                    </div>

                    <!-- 수량 선택 -->
                    <div class="quantity-selector">
                        <button @click="decreaseQuantity">-</button>
                        <input type="number" v-model.number="quantity" min="1" />
                        <button @click="increaseQuantity">+</button>
                    </div>

                    <!-- 총 가격 -->
                    <div class="price-summary">
                        <div class="total-price">
                            <span>총 상품금액</span>
                            <span>{{ formatPrice(calculateTotalPrice()) }}원</span>
                        </div>
                        <div class="total-price shipping-cost">
                            <span>배송비</span>
                            <span :class="{ free: shippingCost === 0 }">
                                {{ shippingCost === 0 ? '무료배송' : formatPrice(shippingCost) + '원 (10만원 이상 구매 시 무료)' }}
                            </span>
                        </div>
                    </div>

                    <!-- 장바구니 및 구매 버튼 -->
                    <div class="action-buttons">
                        <button class="buy-now" @click="buyNow">바로구매</button>
                        <button class="add-to-cart" @click="addToCart">장바구니</button>
                    </div>
                </div>
            </div>

            <!-- 상품 상세 정보 및 리뷰/Q&A 탭 -->
            <div class="product-tabs">
                <div class="tab-headers">
                    <a href="#detail">상세정보</a>
                    <a href="#review">리뷰</a>
                    <a href="#qna">Q&A</a>
                </div>

                <div class="tab-content">
                    <!-- 상세 정보 -->
                    <div id="detail" class="detail-info">
                        <p>{{ product.titleName }}</p>
                        <!-- <img v-if="product.detailPhoto" :src="product.detailPhoto" alt="Product Detail Image" /> -->
                        <!-- <img src="@/assets/images/product2.jpg" alt="" /> -->

                        <div class="detail-images">
                            <img v-for="(photo, index) in detailImages" :key="index" :src="encodeUrl(photo)" alt="Product Detail Image" class="detail-image" />
                        </div>
                    </div>

                    <div id="review" class="section">
                        <Review />
                    </div>
                    <div id="qna" class="section">
                        <Qna />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import itemApi from '@/api/itemApi';
import { cartApi } from '@/api/cartApi';
import Qna from '@/components/qnareview/Qna.vue';
import Review from '@/components/qnareview/Review.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userNo = authStore.userNo;
const isLoading = ref(true);

const product = ref({});
const quantity = ref(1);
const productId = route.params.id;

// ✅ URL 인코딩 함수
const encodeUrl = (url) => {
    return url ? encodeURI(url) : '@/assets/images/default.jpg';
};

// ✅ computed 속성 사용: 항상 배열 형태로 반환
const detailImages = computed(() => {
    console.log('product.detailPhoto 확인:', product.value.detailPhoto);
    return product.value.detailPhotos || []; // `null` 또는 `undefined`일 경우 빈 배열 반환
});

// ✅ watch()로 mainPhoto 변경 감지
watch(
    () => product.value.mainPhoto,
    (newVal) => {
        console.log('mainPhoto 변경 감지:', newVal);
    }
);

// ✅ 백엔드 API에서 데이터 가져오기
const fetchProduct = async () => {
    isLoading.value = true;
    try {
        const data = await itemApi.getItemById(productId);
        console.log('📌 백엔드에서 받은 상품 데이터:', data);
        product.value = data;
        console.log('📌 product 상태 확인:', product.value);
    } catch (error) {
        console.error('❌ 상품 데이터 로딩 실패:', error);
    } finally {
        isLoading.value = false;
    }
};

// 가격 포맷
const formatPrice = (price) => price.toLocaleString();

// 가격 계산
const calculateTotalPrice = () => {
    return product.value.price * quantity.value;
};

const shippingCost = computed(() => {
    return calculateTotalPrice() > 100000 ? 0 : 3000;
});

// 날짜 포맷
const formatDate = (date) => new Date(date).toLocaleDateString();

// 수량 조절
const increaseQuantity = () => quantity.value++;
const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--;
};

// 장바구니 추가
const addToCart = async () => {
    try {
        const itemId = product.value.itemId;
        const quant = quantity.value;

        await cartApi.addItem(userNo, itemId, quant);
        const goToCart = confirm('장바구니에 상품이 추가되었습니다. 장바구니로 이동하시겠습니까?');
        if (goToCart) {
            router.push({ name: 'Cart' });
        }
    } catch (error) {
        console.error('Error add to cart', error);
    }
};

// 즉시 구매
const buyNow = async () => {
    try {
        const itemId = product.value.itemId;
        const quant = quantity.value;

        sessionStorage.setItem('itemId', itemId);
        sessionStorage.setItem('orderType', 'item');

        const itemData = await itemApi.getItemById(itemId);
        itemData.quantity = quant;

        console.log(itemData);

        sessionStorage.setItem('itemData', JSON.stringify(itemData));
        sessionStorage.setItem('shippingCost', shippingCost.value);

        router.push({ name: 'Checkout' });
    } catch (error) {
        console.error('Error ordering', error);
    }
};

// ✅ 페이지 로드 시 상품 데이터 가져오기
onMounted(() => {
    fetchProduct();
});
</script>

<style scoped>
.product-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}

.nav-menu {
    display: flex;
    gap: 30px;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
}

.product-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    margin-top: 50px;
}

.product-images {
    width: 500px;
    height: 500px;
    /* margin-right: 10px; */
    overflow: hidden;
}
.main-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
}

.product-info {
    padding: 20px;
}

.product-info-wrapper {
    margin-bottom: 90px;
}

.product-info h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

.price {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
}

.option-group {
    margin-bottom: 20px;
}

.option-group select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
}

.quantity-selector {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

.quantity-selector button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: #fff;
}

.quantity-selector input {
    width: 50px;
    height: 30px;
    text-align: center;
    border: 1px solid #ddd;
    margin: 0 5px;
}

.total-price {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}

.total-price span {
    font-weight: 500;
}

.total-price .price {
    font-size: 18px;
    font-weight: 600;
}

.shipping-cost span {
    color: #ff5a5f;
}

.shipping-cost .free {
    color: #2ecc71; /* 무료배송일 때 강조 */
    font-weight: 600;
}

.action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.action-buttons button {
    padding: 15px;
    border: none;
    cursor: pointer;
}

.buy-now {
    background-color: #333;
    color: white;
}

.add-to-cart {
    background-color: #eee;
    color: #333;
}

.product-tabs {
    margin-top: 50px;
}

.tab-headers {
    display: flex;
    border-bottom: 1px solid #eee;
}

.tab-headers a {
    padding: 15px 30px;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: none;
    color: #333;
}

.tab-headers a:active {
    font-weight: bold;
    border-bottom: 2px solid #333;
}

.tab-headers a:hover {
    font-weight: bold;
    border-bottom: 2px solid #333;
}

.tab-content {
    padding: 30px 0;
}

.review-item,
.qna-item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}

.stars {
    color: #ffd700;
}

.stars i.filled {
    color: #ffd700;
}

.stars i:not(.filled) {
    color: #ddd;
}

.question,
.answer {
    display: flex;
    gap: 15px;
    margin: 10px 0;
}

.q-mark,
.a-mark {
    font-weight: bold;
    color: #333;
}

.date {
    color: #999;
    font-size: 14px;
}

.detail-info img {
    max-width: 800px;
    width: 100%;
    height: auto;
    margin: 20px auto;
    display: block;
}

.product-info p {
    line-height: 1.6;
    color: #666;
    margin: 20px 0;
}

.main-image {
    max-width: 500px;
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
}

.product-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    padding: 40px 20px;
}

.section {
    margin-top: 70px;
}

.price-summary {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
}
</style>
