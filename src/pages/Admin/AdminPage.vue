<template>
    <section class="user-info-wrapper">
        <div class="user-info">
            <div class="user-profile">
                <div class="profile-image">
                    <FontAwesomeIcon :icon="['fas', 'user']" />
                </div>
                <div class="profile-details">
                    <h2>{{ authStore.userName }} 님</h2>
                    <p>현재 처리해야할 QnA는 00건 입니다.</p>
                    <small>현재 가능한 기능은 <strong>상품 추가</strong>입니다.</small>
                </div>
            </div>
        </div>
    </section>

    <div class="admin-container">
        <div class="main-content">
            <!-- 사이드 메뉴 -->
            <aside class="sidebar">
                <ul>
                    <li><a style="font-size: 17px; font-weight: bold">상품 관리</a></li>
                    <button @click="changeComponent('ProductList')" class="all-button">상품 조회</button>
                    <button @click="changeComponent('ProductAdd')" class="all-button">상품 등록</button>
                    <li><a href="#">재고 관리</a></li>
                    <br />
                    <li>
                        <a style="font-size: 17px; font-weight: bold">주문 관리</a>
                    </li>
                    <li><a href="#">관심상품</a></li>
                    <li><a href="#">게시글 관리</a></li>
                    <br />
                    <li>
                        <a style="font-size: 17px; font-weight: bold">배송 관리</a>
                    </li>
                    <li><a href="#">회원정보수정</a></li>
                    <button @click="goToAddress" class="all-button">배송 주소록</button>
                    <br />
                    <br />
                    <li>
                        <a style="font-size: 17px; font-weight: bold">QnA 관리</a>
                    </li>
                    <li>
                        <button @click.prevent="logout" class="all-button">로그아웃</button>
                    </li>
                </ul>
            </aside>

            <section class="component-box">
                <p>DashBoard</p>

                <section class="recent-orders"></section>
            </section>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { ref, shallowRef } from 'vue';

import AdminDashboard from '@/components/Admin/AdminDashboard.vue';
import ProductList from '@/components/Admin/ProductList.vue';
import ProductAdd from '@/components/Admin/ProductAdd.vue';

const router = useRouter();
const authStore = useAuthStore();

const selectedComponent = shallowRef(AdminDashboard);

const changeComponent = (componentName) => {
    const components = {
        ProductList,
        ProductAdd,
    };

    selectedComponent.value = components[componentName] || AdminDashboard;
};

const logout = async () => {
    try {
        await authStore.logout();
        router.push('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
    } catch (error) {
        console.error('로그아웃 실패:', error);
    }
};
const goToAllOrders = () => {
    router.push({ name: 'OrderList' });
};
const goToAddress = () => {
    router.push({
        name: 'Address',
        query: { source: 'mypage' },
    });
};
</script>

<style scoped>
body,
html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.user-info-wrapper {
    background-color: #f7f6f0;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 60px;
    padding: 50px 0;
    display: flex;
    justify-content: flex-start;
}

.mypage-container {
    width: 80%;
    margin: auto;
    max-width: 1200px;
}

.user-info {
    max-width: 100%;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 120px;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #888;
}

.profile-details h2 {
    margin: 0;
}

.profile-details h2 span {
    font-size: 14px;
    color: #007bff;
    cursor: pointer;
}

.profile-details p {
    margin: 5px 0;
}

.user-points {
    display: flex;
    gap: 20px;
}

.point-box,
.coupon-box {
    text-align: center;
}

/* 메인 콘텐츠 레이아웃 */
.main-content {
    display: flex;
    margin-top: 20px;
    gap: 20px;
}

/* 사이드 메뉴 */
.sidebar {
    flex: 1;
    max-width: 200px;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar ul li {
    margin: 10px 0;
}

.sidebar ul li a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
}

/* 주문 및 최근 주문 내역 */
.order-and-recent {
    flex: 3;
}
.recent-orders {
    border-top: 1px solid #ddd;
    padding-top: 20px;
}

.all-button {
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    padding: 0; /* 내부 여백 제거 */
    margin: 0; /* 외부 여백 제거 */
    color: #333; /* 텍스트 색상 */
    font-size: 14px; /* 폰트 크기 */
    text-decoration: none; /* 밑줄 제거 */
    cursor: pointer; /* 클릭 가능하도록 변경 */
    display: inline; /* 리스트 스타일과 동일하게 설정 */
}

.logout-button:hover {
    color: #007bff; /* 마우스 오버 시 링크와 동일한 효과 */
}
</style>
