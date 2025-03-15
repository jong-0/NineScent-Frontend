<template>
    <div class="container">
        <h3>환영합니다.</h3>
        <p>회원가입이 완료되었습니다.</p>

        <br />
        <div class="button-container">
            <button class="home-button" @click="goHome">홈으로</button>
            <button class="login-button" @click="goLogin">로그인</button>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
// const authStore = useAuthStore();

const goHome = () => {
    router.push('/');
};
const goLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
    text-align: center;
}

/* 버튼 컨테이너 */
.button-container {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    width: 300px;
}

/* 버튼 스타일 */
button {
    flex: 1;
    padding: 10px 20px;
    border: none;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

/* 홈 버튼 */
.home-button {
    background-color: #969696;
    color: white;
}

.home-button:hover {
    background-color: #1a1a1aa1;
}

/* 마이페이지 버튼 */
.orderList-button {
    background-color: #1a1a1a;
    color: white;
}

.orderList-button:hover {
    background-color: #1a1a1aa1;
}
</style>
