<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 90vh; background-color: white">
        <div class="card border-0" style="width: 24rem; background-color: white">
            <div class="card-body">
                <h2 class="text-center fw-bold" style="margin-bottom: 60px">로그인</h2>
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="username" class="form-label">아이디</label>
                        <input id="username" v-model="username" type="text" class="form-control" placeholder="아이디" />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">패스워드</label>
                        <input id="password" v-model="password" type="password" class="form-control" placeholder="패스워드" />
                    </div>
                    <div class="mb-3 form-check d-flex align-items-center">
                        <input id="remember" type="checkbox" v-model="rememberMe" class="form-check-input me-2" />
                        <label for="remember" class="form-check-label">아이디 저장</label>
                        <div class="ms-auto d-flex align-items-center">
                            <i class="fas fa-lock text-danger me-1"></i>
                            <a href="#" class="text-decoration-none text-black"> 보안접속</a>
                        </div>
                    </div>
                    <button type="submit" class="login-btn btn btn-dark w-100 mb-3">로그인</button>
                </form>
                <div class="link-container d-flex justify-content-between text-muted mt-3" style="margin-bottom: 60px">
                    <a href="#" class="text-decoration-none">아이디 찾기</a>
                    <span>|</span>
                    <a href="#" class="text-decoration-none">비밀번호 찾기</a>
                    <span>|</span>
                    <a href="#" class="text-decoration-none">회원 가입</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const rememberMe = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    const success = await authStore.login(username.value, password.value);
    if (success) {
        alert('로그인 성공');
        router.push('/');
    } else {
        alert('로그인 실패');
    }
};
</script>

<style>
.login-btn {
    margin-top: 20px;
    margin-bottom: 50px;
}

.link-container a {
    color: black !important;
}

.link-container span {
    color: black;
}
</style>
