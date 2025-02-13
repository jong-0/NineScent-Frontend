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
        <p class="price">{{ formatPrice(product.price) }}원</p>
        <p>
          Deep Down Hand Balm 50ml <br />건강하고 소탈한 모습, 내면의 숲을
          탐색하는 자유로운 여행자를 떠올립니다.<br />
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
                {{ choice.name }} (+{{ formatPrice(choice.additionalPrice) }}원)
              </option>
            </select>
          </div>
        </div>

        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increaseQuantity">+</button>
        </div>

        <div class="total-price">
          <span>총 상품금액</span>
          <span>{{ formatPrice(calculateTotalPrice()) }}원</span>
        </div>

        <div class="action-buttons">
          <button class="buy-now" @click="buyNow">바로구매</button>
          <button class="add-to-cart" @click="addToCart">장바구니</button>
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
        <div v-if="currentTab === 'detail'" class="detail-info">
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
        <div v-if="currentTab === 'reviews'" class="reviews">
          <div class="review-summary">
            <div class="rating">
              <span class="average">{{ averageRating }}</span
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
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <span class="author">{{ review.author }}</span>
                <div class="stars">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="fas fa-star"
                    :class="{ filled: n <= review.rating }"
                  ></i>
                </div>
                <span class="date">{{ formatDate(review.date) }}</span>
              </div>
              <p class="review-content">{{ review.content }}</p>
            </div>
          </div>
        </div>

        <!-- Q&A 섹션 -->
        <div v-if="currentTab === 'qna'" class="qna">
          <div class="qna-list">
            <div v-for="qna in qnaList" :key="qna.id" class="qna-item">
              <div class="question">
                <span class="q-mark">Q</span>
                <p>{{ qna.question }}</p>
                <span class="date">{{ formatDate(qna.date) }}</span>
              </div>
              <div class="answer" v-if="qna.answer">
                <span class="a-mark">A</span>
                <p>{{ qna.answer }}</p>
                <span class="date">{{ formatDate(qna.answerDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',

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
              { id: 2, name: '100ml', additionalPrice: 10000 },
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
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / this.reviews.length).toFixed(1);
    },
  },

  methods: {
    formatPrice(price) {
      return price.toLocaleString();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    calculateTotalPrice() {
      let basePrice = this.product.price;
      // Add additional option prices
      Object.entries(this.selectedOptions).forEach(([optionId, choiceId]) => {
        const option = this.product.options.find((opt) => opt.id === optionId);
        const choice = option.choices.find((c) => c.id === choiceId);
        if (choice) {
          basePrice += choice.additionalPrice;
        }
      });
      return basePrice * this.quantity;
    },

    increaseQuantity() {
      this.quantity++;
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    async addToCart() {
      try {
        await this.$store.dispatch('cart/addItem', {
          productId: this.product.id,
          quantity: this.quantity,
          options: this.selectedOptions,
        });
        this.$toast.success('장바구니에 추가되었습니다');
      } catch (error) {
        this.$toast.error('장바구니 추가 실패');
      }
    },

    async buyNow() {
      try {
        await this.$store.dispatch('order/createOrder', {
          items: [
            {
              productId: this.product.id,
              quantity: this.quantity,
              options: this.selectedOptions,
            },
          ],
        });
        this.$router.push('/checkout');
      } catch (error) {
        this.$toast.error('주문 처리 실패');
      }
    },
  },

  async created() {
    try {
      // Fetch product details
      const productId = this.$route.params.id;
      const [productData, reviewsData, qnaData] = await Promise.all([
        this.$api.products.getDetail(productId),
        this.$api.reviews.getList({ productId }),
        this.$api.qna.getList({ productId }),
      ]);

      this.product = productData;
      this.reviews = reviewsData.items;
      this.qnaList = qnaData.items;

      // Initialize selected options
      this.product.options.forEach((option) => {
        this.selectedOptions[option.id] = option.choices[0].id;
      });
    } catch (error) {
      this.$toast.error('데이터 로딩 실패');
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

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
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
