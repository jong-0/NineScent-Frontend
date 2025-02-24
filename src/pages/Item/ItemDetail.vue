<template>
  <div class="product-detail">
    <!-- 상품 정보 섹션 -->
    <div class="product-container">
      <div class="product-images">
        <img
          :src="'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/%E1%84%83%E1%85%B5%E1%86%B8+%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB+%E1%84%92%E1%85%A2%E1%86%AB%E1%84%83%E1%85%B3+%E1%84%87%E1%85%A1%E1%86%B7+50ml.jpg'"
          alt="Product Image"
          class="main-image"
        />
      </div>

      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">
          {{ formatPrice(product.price) }}원
        </p>
        <p>
          Deep Down Hand Balm 50ml <br />건강하고 소탈한
          모습, 내면의 숲을 탐색하는 자유로운 여행자를
          떠올립니다.<br />
          딥 다운의 향기를 핸드 밤으로 만나보세요.
        </p>
        <div class="product-options">
          <div
            class="option-group"
            v-for="option in product.options"
            :key="option.id"
          >
            <label>{{ option.name }}</label>
            <select v-model="selectedOptions[option.id]">
              <option
                v-for="choice in option.choices"
                :key="choice.id"
                :value="choice.id"
              >
                {{ choice.name }} (+{{
                  formatPrice(choice.additionalPrice)
                }}원)
              </option>
            </select>
          </div>
        </div>

        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <input
            type="number"
            v-model.number="quantity"
            min="1"
          />
          <button @click="increaseQuantity">+</button>
        </div>

        <div class="price-summary">
          <div class="total-price">
            <span>총 상품금액</span>
            <span class="price"
              >{{ formatPrice(finalProductPrice) }}원</span
            >
          </div>
          <div class="total-price shipping-cost">
            <span>배송비</span>
            <span :class="{ free: shippingCost === 0 }">
              {{
                shippingCost === 0
                  ? '무료배송'
                  : formatPrice(shippingCost) + '원'
              }}
            </span>
          </div>
        </div>
        <!-- <div class="total-price">
          <span>총 상품금액</span>
          <span
            >{{ formatPrice(finalProductPrice) }}원</span
          >
        </div>
        <div class="shipping-cost">
          <span>배송비</span>
          <span>{{ formatPrice(shippingCost) }}원</span>
        </div> -->
        <div class="action-buttons">
          <button class="buy-now" @click="buyNow()">
            바로구매
          </button>
          <button class="add-to-cart" @click="addToCart">
            장바구니
          </button>
        </div>
      </div>
    </div>

    <!-- 상품 상세 정보 탭 -->
    <div class="product-tabs">
      <div class="tab-headers">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- 상세정보 -->
        <div
          v-if="currentTab === 'detail'"
          class="detail-info"
        >
          <div class="product-description">
            <!-- <h2>About Hand Balm</h2> -->
            <p>{{ product.description }}</p>
          </div>
          <img
            v-for="img in product.detailImages"
            :key="img.id"
            :src="img.url"
            :alt="img.alt"
          />
        </div>

        <!-- 리뷰 섹션 -->
        <div
          v-if="currentTab === 'reviews'"
          class="reviews"
        >
          <div class="review-summary">
            <div class="rating">
              <span class="average">{{
                averageRating
              }}</span
              >/5
              <div class="stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  class="fas fa-star"
                  :class="{ filled: n <= averageRating }"
                ></i>
              </div>
            </div>
          </div>

          <div class="review-list">
            <div
              v-for="review in reviews"
              :key="review.id"
              class="review-item"
            >
              <div class="review-header">
                <span class="author">{{
                  review.author
                }}</span>
                <div class="stars">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="fas fa-star"
                    :class="{ filled: n <= review.rating }"
                  ></i>
                </div>
                <span class="date">{{
                  formatDate(review.date)
                }}</span>
              </div>
              <p class="review-content">
                {{ review.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Q&A 섹션 -->
        <!-- <div v-if="currentTab === 'qna'" class="qna">
          <div class="qna-list">
            <div
              v-for="qna in qnaList"
              :key="qna.id"
              class="qna-item"
            >
              <div class="question">
                <span class="q-mark">Q</span>
                <p>{{ qna.question }}</p>
                <span class="date">{{
                  formatDate(qna.date)
                }}</span>
              </div>
              <div class="answer" v-if="qna.answer">
                <span class="a-mark">A</span>
                <p>{{ qna.answer }}</p>
                <span class="date">{{
                  formatDate(qna.answerDate)
                }}</span>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import Review from '@/components/qnareview/Review.vue';
import Qna from '@/components/qnareview/Qna.vue';
import itemApi from '@/api/itemApi';
import { useAuthStore } from '@/stores/authStore';
export default {
  name: 'ProductDetail',
  components: {
    Review,
    Qna,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const userNo = authStore.userNo;
    return { route, router, userNo };
  },

  data() {
    return {
      logoUrl: '/src/assets/logo.png',
      product: {
        id: 1,
        name: '핸드 밤 50ml',
        price: 32000,
        mainImage: '/src/assets/product-main.jpg',
        description: '',
        detailImages: [
          {
            id: 1,
            url: 'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/detail/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A61.jpg',
            alt: 'Product Detail 1',
          },
          {
            id: 2,
            url: 'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/detail/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A62.jpg',
            alt: 'Product Detail 2',
          },
          {
            id: 3,
            url: 'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/detail/%E1%84%89%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A63.jpg',
            alt: 'Product Detail 3',
          },
        ],
        options: [
          {
            id: 'size',
            name: '용량',
            choices: [
              { id: 1, name: '50ml', additionalPrice: 0 },
              {
                id: 2,
                name: '100ml',
                additionalPrice: 10000,
              },
            ],
          },
        ],
      },
      selectedOptions: {},
      quantity: 1,
      currentTab: 'detail',
      tabs: [
        { id: 'detail', name: '상세정보' },
        { id: 'reviews', name: '리뷰' },
        { id: 'qna', name: 'Q&A' },
      ],
      reviews: [],
      qnaList: [],
    };
  },

  computed: {
    averageRating() {
      if (this.reviews.length === 0) return 0;
      const sum = this.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return (sum / this.reviews.length).toFixed(1);
    },
    // ✅ 개별 상품의 최종 가격 계산 (옵션 포함)
    finalProductPrice() {
      let basePrice = this.product.price;
      Object.entries(this.selectedOptions).forEach(
        ([optionId, choiceId]) => {
          const option = this.product.options.find(
            (opt) => opt.id === optionId
          );
          const choice = option.choices.find(
            (c) => c.id === choiceId
          );
          if (choice) {
            basePrice += choice.additionalPrice;
          }
        }
      );
      return basePrice * this.quantity;
    },

    // ✅ 개별 상품 배송비 계산 (10만 원 이상 무료 배송)
    shippingCost() {
      return this.finalProductPrice >= 100000 ? 0 : 3000;
    },
  },

  methods: {
    formatPrice(price) {
      return price.toLocaleString();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    // calculateTotalPrice() {
    //   let basePrice = this.product.price;
    //   // Add additional option prices
    //   Object.entries(this.selectedOptions).forEach(
    //     ([optionId, choiceId]) => {
    //       const option = this.product.options.find(
    //         (opt) => opt.id === optionId
    //       );
    //       const choice = option.choices.find(
    //         (c) => c.id === choiceId
    //       );
    //       if (choice) {
    //         basePrice += choice.additionalPrice;
    //       }
    //     }
    //   );
    //   return basePrice * this.quantity;
    // },

    increaseQuantity() {
      this.quantity++;
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    async addToCart() {
      const userNo = this.userNo;
      try {
        const cartItemDTO = {
          itemId: this.product.id,
          quantity: this.quantity,
        };

        const response = await fetch(
          `/api/cart/add/${userNo}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItemDTO),
          }
        );
        if (!response.ok)
          throw new Error('장바구니 추가 실패');

        // 장바구니 추가 성공 후 알림창
        const goToCart = confirm(
          '장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?'
        );
        if (goToCart) {
          this.$router.push({ name: 'Cart' });
        }
      } catch (error) {
        console.error('Error add to cart', error);
      }
    },

    async buyNow() {
      const itemId = this.product.id;
      const quantity = this.quantity; // 선택한 수량 반영

      sessionStorage.setItem('itemId', itemId); // 세션 스토리지에 저장
      sessionStorage.setItem('orderType', 'item'); // 주문 타입 저장

      try {
        // 주문 데이터 백엔드에서 불러오기
        const response = await fetch(
          `/api/items/${itemId}`
        );
        const itemData = await response.json();
        itemData.quantity = quantity; // 데이터에 수량 추가

        // 주문 데이터 sessionStorage에 저장
        sessionStorage.setItem(
          'itemData',
          JSON.stringify(itemData)
        );
        sessionStorage.setItem(
          'shippingCost',
          this.shippingCost
        );

        // 페이지 이동
        this.$router.push({ name: 'Checkout' });
      } catch (error) {
        console.error('Error ordering', error);
      }
    },
  },

  async created() {
    try {
      // Fetch product details
      const productId = this.$route.params.id;
      console.log('productId: ', productId);

      // const [productData] = await Promise.all([
      //   this.$api.products.getDetail(productId),
      //   this.$api.reviews.getList({ productId }),
      //   this.$api.qna.getList({ productId }),
      // ]);

      const productData = await itemApi.getItemById(
        productId
      );
      console.log('productData: ', productData);
      // const [productData, reviewsData, qnaData] = await Promise.all([
      //   this.$api.products.getDetail(productId),
      //   this.$api.reviews.getList({ productId }),
      //   this.$api.qna.getList({ productId }),
      // ]);

      // this.product = productData;
      // this.reviews = reviewsData.items;
      // this.qnaList = qnaData.items;

      // Initialize selected options
      this.product.options.forEach((option) => {
        this.selectedOptions[option.id] =
          option.choices[0].id;
      });
    } catch (error) {
      console.error('Error data loading', error);
    }
  },
};
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

.main-image {
  width: 100%;
  height: auto;
}

.product-info {
  padding: 20px;
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

.price-summary {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
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

.tab-headers button {
  padding: 15px 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.tab-headers button.active {
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
</style>
