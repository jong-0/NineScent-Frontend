<template>
    <div class="signup-container">
        <h1 class="title">회원가입</h1>

        <!-- 입력 폼 -->
        <form @submit.prevent="handleSubmit" class="signup-form">
            <!-- 아이디 -->
            <div class="form-group">
                <label for="username">아이디 *</label>
                <input type="text" id="username" v-model="form.username" placeholder="영문 소문자/숫자, 4~16자" required />
            </div>

            <!-- 비밀번호 -->
            <div class="form-group">
                <label for="password">비밀번호 *</label>
                <input type="password" id="password" v-model="form.password" placeholder="영문/숫자/특수문자 포함 10~16자" required />
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
                <label for="passwordConfirm">비밀번호 확인 *</label>
                <input type="password" id="passwordConfirm" v-model="form.passwordConfirm" required />
            </div>

            <!-- 이름 -->
            <div class="form-group">
                <label for="name">이름 *</label>
                <input type="text" id="name" v-model="form.name" required />
            </div>

            <!-- 주소 -->
            <div class="form-group">
                <label>주소 *</label>
                <div class="address-group">
                    <input type="text" v-model="form.zipCode" placeholder="우편번호" />
                    <button type="button" @click="searchAddress">우편번호</button>
                </div>
                <input type="text" v-model="form.address" placeholder="기본 주소" />
                <input type="text" v-model="form.detailAddress" placeholder="상세 주소" />
            </div>

            <!-- 전화번호 -->
            <div class="form-group phone-group">
                <label>일반전화</label>
                <select v-model="form.phone.prefix">
                    <option value="02">02</option>
                    <option value="031">031</option>
                </select>
                <input type="text" v-model="form.phone.number" placeholder="전화번호" />
            </div>

            <!-- 휴대전화 -->
            <div class="form-group phone-group">
                <label>휴대전화 *</label>
                <select v-model="form.mobile.prefix">
                    <option value="010">010</option>
                    <option value="011">011</option>
                </select>
                <input type="text" v-model="form.mobile.number" placeholder="전화번호" />
            </div>

            <!-- 이메일 -->
            <div class="form-group">
                <label for="email">이메일 *</label>
                <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="email-info"><i class="fas fa-info-circle"></i> 이메일 인증: 입력하신 이메일로 인증메일이 발송됩니다.</div>

            <!-- 생년월일 -->
            <div class="form-group">
                <label>생년월일 *</label>
                <div class="birth-group">
                    <input type="number" v-model="form.birth.year" placeholder="연(4자리)" />
                    <select v-model="form.birth.month">
                        <option value="">월</option>
                        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <input type="number" v-model="form.birth.day" placeholder="일" />
                </div>
            </div>

            <!-- 성별 -->
            <div class="form-group">
                <label>성별 *</label>
                <div>
                    <input type="radio" id="male" value="남자" v-model="form.gender" />
                    <label for="male">남자</label>
                    <input type="radio" id="female" value="여자" v-model="form.gender" />
                    <label for="female">여자</label>
                </div>
            </div>

            <!-- 회원가입 버튼 -->
            <button type="submit" class="btn-submit">회원가입</button>
        </form>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const signupType = ref('personal');
const form = ref({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    phone: { prefix: '02', number: '' },
    mobile: { prefix: '010', number: '' },
    email: '',
    birth: { year: '', month: '', day: '' },
    gender: '',
});

const handleSubmit = () => {
    console.log('회원가입 데이터', form.value);
};

const searchAddress = () => {
    alert('주소 검색 기능 구현 예정!');
};
</script>
<style scoped>
.signup-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}

.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.signup-type {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.signup-type button {
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: none;
    cursor: pointer;
}

.signup-type .active {
    background-color: #333;
    color: white;
}

.email-info {
    font-size: 12px;
    color: #555;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input,
select,
button {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.btn-submit {
    background-color: #333;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-submit:hover {
    background-color: #555;
}

.title {
    margin-top: 30px;
    margin-bottom: 50px;
}
</style>
