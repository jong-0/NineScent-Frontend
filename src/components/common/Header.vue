<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
<template>
    <header class="header">
        <div class="logo">NINESCENT</div>
        <nav class="navigation">
            <ul>
                <li><a href="/">BEST</a></li>
                <li><a href="#">PERFUME</a></li>
                <li><a href="#">ETC</a></li>
                <li><a href="#">ABOUT</a></li>
            </ul>
        </nav>
        <nav class="navigation-icon">
            <ul>
                <li>
                    <a href="/mypage/:id">
                        <font-awesome-icon :icon="['fas', 'user']" />
                    </a>
                </li>
                <li>
                    <a href="/cart">
                        <font-awesome-icon :icon="['fas', 'cart-shopping']" />
                    </a>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
.header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px; /* 패딩을 조정 */
    background-color: #f8f8f8;
}
.logo {
    font-size: 16px;
    font-weight: bold;
}
.navigation ul {
    list-style: none;
    display: flex;
    gap: 15px;
    padding: 0px;
    padding-top: 10px;
}
.navigation a {
    text-decoration: none;
    color: #333;
    font-size: 14px; /* 폰트 크기 축소 */
    padding: 8px;
    position: relative;
}

/* 마우스 오버 시 부드러운 밑줄 효과 */
.navigation a::after {
    content: ''; /* 가상 요소 생성 */
    position: absolute;
    left: 0;
    bottom: -16px; /* 링크 아래쪽에 밑줄 생성 */
    width: 0;
    height: 1.5px; /* 밑줄의 두께 */
    background-color: #333; /* 밑줄 색상 */
    transition: width 0.3s ease; /* 부드러운 트랜지션 */
}

.navigation a:hover::after {
    width: 100%; /* 마우스 오버 시 밑줄을 전체 너비로 확장 */
}

.navigation-icon ul {
    list-style: none;
    display: flex;
    gap: 15px;
    padding: 0px;
    padding-top: 10px;
}
.navigation-icon a {
    text-decoration: none;
    color: #333;
    font-size: 15px; /* 폰트 크기 축소 */
    padding: 8px;
}
</style>
