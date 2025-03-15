<template>
    <div class="product-list-container">
        <h2>상품 목록</h2>

        <!--    카테고리 선택 -->
        <div class="filter-section">
            <label>카테고리:</label>
            <select v-model="selectedCategory" @change="fetchSubCategories">
                <option value="">전체</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>

            <label>하위 카테고리:</label>
            <select v-model="selectedSubCategory" @change="fetchProducts">
                <option value="">전체</option>
                <option v-for="sub in subCategories" :key="sub.id" :value="sub.id">
                    {{ sub.name }}
                </option>
            </select>
        </div>

        <!--    칼럼 필터링 -->
        <div class="column-selector">
            <label>추가할 컬럼 선택:</label>
            <div class="checkbox-group">
                <label v-for="(label, key) in optionalColumns" :key="key"> <input type="checkbox" v-model="visibleColumns[key]" /> {{ label }} </label>
            </div>
        </div>

        <!--    검색 필터 -->
        <div class="filter-section">
            <input type="text" v-model="filters.name" placeholder="상품명 검색" @input="filterProducts" />
            <input type="number" v-model="filters.minPrice" placeholder="최소 가격" @input="filterProducts" />
            <input type="number" v-model="filters.maxPrice" placeholder="최대 가격" @input="filterProducts" />
            <input type="number" v-model="filters.minStock" placeholder="최소 재고" @input="filterProducts" />
            <input type="number" v-model="filters.maxStock" placeholder="최대 재고" @input="filterProducts" />
        </div>

        <!--    상품 목록 테이블 -->
        <table>
            <thead>
                <tr>
                    <th v-for="col in displayedColumns" :key="col">{{ columnNames[col] }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in filteredProducts" :key="product.item_id">
                    <td v-for="col in displayedColumns" :key="col">{{ product[col] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

//    카테고리 관련 데이터
const categories = ref([]);
const subCategories = ref([]);
const selectedCategory = ref('');
const selectedSubCategory = ref('');

//    상품 리스트 및 필터링
const products = ref([]);
const filteredProducts = ref([]);
const filters = ref({ name: '', minPrice: null, maxPrice: null, minStock: null, maxStock: null });

//    기본 및 선택적 컬럼 설정
const visibleColumns = ref({
    item_id: true,
    item_name: true,
    item_size: true,
    price: true,
    stock: true,
    category: false,
    brand: false,
    created_at: false,
});
const columnNames = {
    item_id: '상품 ID',
    item_name: '상품명',
    item_size: '사이즈',
    price: '가격',
    stock: '재고',
    category: '카테고리',
    brand: '브랜드',
    created_at: '등록일',
};

//    사용자가 선택할 수 있는 추가 컬럼 목록
const optionalColumns = {
    category: '카테고리',
    brand: '브랜드',
    created_at: '등록일',
};

//    최종 표시할 컬럼 계산
const displayedColumns = computed(() => Object.keys(visibleColumns.value).filter((col) => visibleColumns.value[col]));

//    카테고리 조회
const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories');
        categories.value = response.data;
    } catch (error) {
        console.error('카테고리 불러오기 실패:', error);
    }
};

//    하위 카테고리 조회
const fetchSubCategories = async () => {
    if (!selectedCategory.value) {
        subCategories.value = [];
        return;
    }
    try {
        const response = await axios.get(`/api/categories/${selectedCategory.value}/subcategories`);
        subCategories.value = response.data;
    } catch (error) {
        console.error('하위 카테고리 불러오기 실패:', error);
    }
};

//    상품 리스트 조회
const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/products', {
            params: {
                categoryId: selectedCategory.value,
                subCategoryId: selectedSubCategory.value,
            },
        });
        products.value = response.data;
        filteredProducts.value = response.data;
    } catch (error) {
        console.error('상품 목록 불러오기 실패:', error);
    }
};

//    상품 필터링 로직
const filterProducts = () => {
    filteredProducts.value = products.value.filter((product) => {
        return (
            (!filters.value.name || product.item_name.includes(filters.value.name)) &&
            (!filters.value.minPrice || product.price >= filters.value.minPrice) &&
            (!filters.value.maxPrice || product.price <= filters.value.maxPrice) &&
            (!filters.value.minStock || product.stock >= filters.value.minStock) &&
            (!filters.value.maxStock || product.stock <= filters.value.maxStock)
        );
    });
};

//    초기 데이터 불러오기
fetchCategories();
fetchProducts();
</script>

<style scoped>
.product-list-container {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
}

h2 {
    text-align: center;
}

.filter-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.column-selector {
    margin-bottom: 15px;
}

.checkbox-group {
    display: flex;
    gap: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

th {
    background-color: #f4f4f4;
}
</style>
