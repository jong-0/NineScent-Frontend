<template>
    <div class="product-add-container">
        <h2>상품 등록</h2>

        <form @submit.prevent="handleSubmit">
            <!-- 카테고리 선택 -->
            <div class="form-group">
                <label>카테고리</label>
                <select v-model="form.categoryId" @change="fetchSubCategories">
                    <option value="">카테고리 선택</option>
                    <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                        {{ category.categoryName }}
                    </option>
                </select>

                <select v-model="form.subCategoryId">
                    <option value="">하위 카테고리 선택</option>
                    <option v-for="sub in subCategories" :key="sub.id" :value="sub.id">
                        {{ sub.subCategoryName }}
                    </option>
                </select>
            </div>

            <!-- 상품명 & 사이즈 -->
            <div class="form-group">
                <label>상품명</label>
                <input type="text" v-model="form.itemName" required />

                <label>사이즈</label>
                <input type="text" v-model="form.itemSize" />
            </div>

            <!-- 가격 & 재고 -->
            <div class="form-group">
                <label>가격</label>
                <input type="number" v-model="form.price" required />

                <label>재고</label>
                <input type="number" v-model="form.stock" required />
            </div>

            <!--  상품 제목 -->
            <div class="form-group">
                <label>상품 제목</label>
                <input type="text" v-model="form.itemTitle" required />
            </div>

            <!--  상품 설명 -->
            <div class="form-group">
                <label>상품 설명</label>
                <textarea v-model="form.itemDescription" required></textarea>
            </div>

            <!-- 대표 이미지 -->
            <div class="form-group">
                <label>대표 이미지</label>
                <input type="file" ref="mainPhotoInput" @change="handleMainPhotoUpload" accept="image/*" />
            </div>
            <div class="file-preview-container" v-if="previewMainPhoto">
                <div class="file-preview">
                    <span>{{ mainPhotoName }}</span>
                    <button @click.prevent="removeMainPhoto">❌</button>
                </div>
            </div>

            <!-- 상세 이미지 -->
            <div class="form-group">
                <label>상세 이미지</label>
                <input type="file" ref="detailPhotosInput" multiple @change="handleDetailPhotosUpload" accept="image/*" />
            </div>
            <div class="file-preview-container" v-if="previewDetailPhotos.length">
                <div v-for="(photo, index) in previewDetailPhotos" :key="index" class="file-preview">
                    <span>{{ detailPhotoNames[index] }}</span>
                    <button @click.prevent="removeDetailPhoto(index)">❌</button>
                </div>
            </div>

            <!-- 추가 옵션 -->
            <div class="toggle-button-container">
                <button type="button" @click="showExtraOptions = !showExtraOptions" class="toggle-button">
                    <span class="toggle-icon" :class="{ expanded: showExtraOptions }">▶</span>
                    추가 옵션
                </button>
            </div>

            <div v-if="showExtraOptions">
                <div class="form-group">
                    <label>할인율</label>
                    <input type="number" v-model="form.discountRate" @input="calculateDiscountedPrice" />
                </div>
                <div class="form-group">
                    <label>할인가</label>
                    <input type="number" v-model="form.discountedPrice" readonly />
                </div>
                <div class="form-group">
                    <label>할인 기간</label>
                    <input type="date" v-model="form.discountStart" />
                    <input type="date" v-model="form.discountEnd" />
                </div>
                <div class="form-group">
                    <label>할인 설명</label>
                    <textarea v-model="form.discountDescription"></textarea>
                </div>
            </div>

            <!-- ✅ 큰 이미지 미리보기 (추가 옵션 아래, 등록 버튼 위) -->
            <div class="image-preview-large-container" v-if="previewMainPhoto || previewDetailPhotos.length">
                <h3>미리보기</h3>
                <div class="large-preview">
                    <p>메인 이미지</p>
                    <img v-if="previewMainPhoto" :src="previewMainPhoto" alt="대표 이미지 미리보기" class="large-preview-image" />
                    <p>디테일 이미지</p>
                    <div class="image-preview-container">
                        <img v-for="(photo, index) in previewDetailPhotos" :key="index" :src="photo" alt="상세 이미지 미리보기" class="large-preview-image" />
                    </div>
                </div>
            </div>

            <!-- ✅ 등록 버튼 -->
            <button type="submit" class="submit-button">상품 등록</button>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';

// 상태 관리
const form = ref({
    categoryId: '',
    subCategoryId: '',
    itemName: '',
    itemSize: '',
    itemTitle: '',
    itemDescription: '',
    price: '',
    stock: '',
    mainPhoto: null,
    detailPhotos: [],
    discountRate: '',
    discountedPrice: '',
    discountStart: '',
    discountEnd: '',
    discountDescription: '',
});
const mainPhotoInput = ref(null);
const detailPhotosInput = ref(null);

// 카테고리 및 서브카테고리 데이터
const categories = ref([]);
const subCategories = ref([]);

//    추가 옵션 토글
const showExtraOptions = ref(false);

//    이미지 미리보기
const previewMainPhoto = ref(null);
const previewDetailPhotos = ref([]);
const mainPhotoName = ref('');
const detailPhotoNames = ref([]);

// 카테고리 불러오기
const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories');
        console.log('카테고리 데이터:', response.data);
        categories.value = response.data;
    } catch (error) {
        console.error('카테고리 불러오기 실패:', error);
    }
};

//    하위 카테고리 불러오기
const fetchSubCategories = async () => {
    console.log('✔️ fetchSubCategories 실행됨! 선택된 카테고리 ID:', form.value.categoryId);

    if (!form.value.categoryId) {
        console.log('❌ 카테고리가 선택되지 않았습니다.');
        subCategories.value = [];
        return;
    }

    try {
        const response = await axios.get(`/api/categories/${form.value.categoryId}/subcategories`);
        subCategories.value = response.data;

        console.log('   서브 카테고리 데이터:', subCategories.value);
    } catch (error) {
        console.error('❌ 하위 카테고리 불러오기 실패:', error);
    }
};

//    할인율 적용
const calculateDiscountedPrice = () => {
    if (form.value.discountRate && form.value.price) {
        form.value.discountedPrice = (form.value.price * (1 - form.value.discountRate / 100)).toFixed(2);
    }
};

// 대표 이미지 업로드
const handleMainPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.mainPhoto = file;
        previewMainPhoto.value = URL.createObjectURL(file);
        mainPhotoName.value = file.name;
    }
};

// 대표 이미지 삭제
const removeMainPhoto = () => {
    form.value.mainPhoto = null;
    previewMainPhoto.value = null;
    mainPhotoName.value = '';
    mainPhotoInput.value.value = ''; // input 초기화
};

// 상세 이미지 업로드
const handleDetailPhotosUpload = (event) => {
    form.value.detailPhotos = Array.from(event.target.files);
    previewDetailPhotos.value = form.value.detailPhotos.map((file) => URL.createObjectURL(file));
    detailPhotoNames.value = form.value.detailPhotos.map((file) => file.name);
};

// 상세 이미지 삭제
const removeDetailPhoto = (index) => {
    form.value.detailPhotos.splice(index, 1);
    previewDetailPhotos.value.splice(index, 1);
    detailPhotoNames.value.splice(index, 1);

    if (form.value.detailPhotos.length === 0) {
        detailPhotosInput.value.value = ''; // input 초기화
    }
};

//    상품 등록 요청
const handleSubmit = async () => {
    try {
        const formData = new FormData();
        Object.keys(form.value).forEach((key) => {
            if (form.value[key]) formData.append(key, form.value[key]);
        });

        const response = await axios.post('/api/items/create', formData);
        alert('상품이 등록되었습니다.');
        console.log(response.data);
    } catch (error) {
        console.error('상품 등록 실패:', error);
        alert('상품 등록에 실패했습니다.');
    }
};

// 카테고리 데이터 로드
fetchCategories();
</script>

<style scoped>
.product-add-container {
    width: 100%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
}

/* 입력 폼 기본 스타일 */
form {
    display: flex;
    flex-direction: column;
}

/* 폼 그룹 스타일 */
.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

/* 라벨 스타일 */
.form-group label {
    width: 120px;
    font-weight: bold;
    text-align: right;
    margin-right: 20px;
    color: #444;
}

/* 입력 필드 스타일 */
.form-group input,
.form-group select,
.form-group textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    transition: border 0.3s ease-in-out;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border: 1px solid #007bff;
    outline: none;
}

/* 파일 업로드 입력 필드 스타일 */
input[type='file'] {
    border: none;
}

/* 이미지 미리보기 스타일 */
.image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.image-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ddd;
}

/* 파일 목록 스타일 */

.file-preview-container {
    margin-left: 150px;
    margin-top: 10px;
    max-width: 100%;
}

.file-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: #f7f6f0;
    padding: 5px 12px;
    margin-bottom: 15px;
    border-radius: 5px;
    width: 100%;
    max-width: 500px;
    word-break: break-word;
    overflow: hidden;
}

.file-preview span {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
}

.file-preview button {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
}

/* 큰 이미지 미리보기 (추가 옵션 아래, 등록 버튼 위) */
.image-preview-large-container {
    margin-top: 20px;
    text-align: center;
}

.image-preview-large-container h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.large-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.large-preview-image {
    width: 300px;
    height: auto;
    border-radius: 5px;
    border: 1px solid #ddd;
}

/*    "추가 옵션" 토글 버튼 우측 정렬 */
.toggle-button-container {
    display: flex;
    justify-content: flex-end; /* 우측 정렬 */
    margin-top: 10px;
}

.toggle-button {
    background: none;
    border: none;
    color: black;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
}

.toggle-button:hover {
    color: gray;
}

/* 아이콘 애니메이션 */
.toggle-icon {
    transition: transform 0.3s ease-in-out;
}

/* 옵션이 열렸을 때 아이콘 회전 */
.expanded {
    transform: rotate(90deg);
}

/* 등록 버튼 스타일 */
.submit-button {
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    max-width: 200px;
    display: block;
    text-align: center;
    margin: 20px auto;
    transition: background 0.3s ease-in-out;
}

.submit-button:hover {
    background-color: #555;
}

.submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .product-add-container {
        padding: 15px;
    }

    .form-group {
        flex-direction: column;
        align-items: flex-start;
    }

    .form-group label {
        width: 100%;
        text-align: left;
        margin-bottom: 5px;
    }

    .sbm-btn-container {
        justify-content: center;
    }
}
</style>
