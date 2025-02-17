<template>
    <div class="signup-container">
        <h1 class="title">회원가입</h1>

        <!-- 입력 폼 -->
        <form @submit.prevent="handleSubmit" class="signup-form">
            <!-- 아이디 -->
            <div class="form-group">
                <label for="username">아이디 *</label>
                <input type="text" id="username" v-model="form.username" placeholder="영문 소문자/숫자, 4~16자" @blur="validateUsername" required />
            </div>
            <div class="error-message" v-show="showError.username" :class="{ hide: !showError.username }"><i class="fas fa-info-circle"></i> {{ usernameError }}</div>

            <!-- 비밀번호 -->
            <div class="form-group">
                <label for="password">비밀번호 *</label>
                <input type="password" id="password" v-model="form.password" placeholder="영문/숫자/특수문자 포함 10~16자" @input="validatePasswordMatch" required />
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
                <label for="passwordConfirm">비밀번호 확인 *</label>
                <input type="password" id="passwordConfirm" v-model="form.passwordConfirm" @input="validatePasswordMatch" required />
            </div>
            <div class="error-message" v-show="showError.password" :class="{ hide: !showError.password }"><i class="fas fa-info-circle"></i> {{ passwordError }}</div>

            <!-- 이름 -->
            <div class="form-group">
                <label for="name">이름 *</label>
                <input type="text" id="name" v-model="form.name" required />
            </div>

            <!-- 주소 입력 -->
            <!-- <div class="form-group">
                <label for="address" class="addressLabel">주소 </label>
                <DaumAddress @address-selected="updateAddress" />
            </div> -->

            <!-- 주소 입력 -->
            <div class="form-group address-group">
                <label for="address">주소 </label>
                <DaumAddress @address-selected="updateAddress" class="address-component" />
            </div>

            <!-- 일반전화 -->
            <div class="form-group phone-group">
                <label>일반전화</label>
                <div class="phone-input-group">
                    <select v-model="form.phone.prefix">
                        <option v-for="code in areaCodes" :key="code" :value="code">
                            {{ code }}
                        </option>
                    </select>
                    <input type="text" v-model="form.phone.middle" maxlength="4" />
                    <input type="text" v-model="form.phone.last" maxlength="4" />
                </div>
            </div>

            <!-- 휴대전화 -->
            <div class="form-group phone-group">
                <label>휴대전화 </label>
                <div class="phone-input-group">
                    <select v-model="form.mobile.prefix">
                        <option value="010">010</option>
                        <option value="011">011</option>
                    </select>
                    <input type="text" v-model="form.mobile.middle" maxlength="4" />
                    <input type="text" v-model="form.mobile.last" maxlength="4" />
                </div>
            </div>

            <!-- 이메일 -->

            <div class="form-group">
                <label for="email">이메일 *</label>
                <input type="email" id="email" v-model="form.email" @blur="validateEmail" required />
            </div>
            <div class="email-info"><i class="fas fa-info-circle"></i> 이메일 인증: 입력하신 이메일로 인증메일이 발송됩니다.</div>
            <div class="error-message" v-show="showError.email" :class="{ hide: !showError.email }"><i class="fas fa-info-circle"></i> {{ emailError }}</div>

            <!-- 생년월일 -->
            <div class="form-group">
                <label>생년월일 *</label>
                <div class="birth-group">
                    <input type="number" v-model="form.birth.year" placeholder="년 (ex. 1999)" />
                    <select v-model="form.birth.month">
                        <option value="">월</option>
                        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <input type="number" v-model="form.birth.day" placeholder="일" />
                </div>
            </div>
            <br />
            <!-- 회원가입 버튼 -->
            <div class="sbm-btn-container">
                <button type="submit" class="btn-submit" :disabled="!isFormValid">회원가입</button>
            </div>
        </form>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import DaumAddress from '@/components/user/DaumAddressFInd.vue';

//지역번호 리스트 (배열을 이용해 동적 생성)
const areaCodes = ref(['02', '031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064']);

const signupType = ref('personal');
const form = ref({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
    phone: { prefix: '02', middle: '', last: '' },
    mobile: { prefix: '010', middle: '', last: '' },
    email: '',
    birth: { year: '', month: '', day: '' },
});

// 주소 업데이터 함수
const updateAddress = (data) => {
    form.value.zipCode = data.addrZipcode;
    form.value.address = data.addrAddress;
    form.value.detailAddress = data.addrDetail;
    form.value.extraAddress = data.addrExtraDetail;
};

const usernameError = ref('');
const passwordError = ref('');
const emailError = ref('');
const showError = ref({
    username: false,
    password: false,
    email: false,
});

// 아이디 중복 검사
const validateUsername = async () => {
    if (!form.value.username.trim()) {
        usernameError.value = '아이디를 입력하세요.';
        showError.value.username = true;
    } else {
        try {
            const response = await axios.get(`/api/user/checkusername/${form.value.username}`);
            if (!response.data) {
                usernameError.value = ''; // 사용 가능
                showError.value.username = false;
            } else {
                usernameError.value = '이미 사용 중인 아이디입니다.';
                showError.value.username = true;
            }
        } catch (error) {
            console.error('아이디 중복 검사 오류:', error);
            usernameError.value = '아이디 확인 중 오류가 발생했습니다.';
            showError.value.username = true;
        }
    }
};

// 비밀번호 일치 검사
const validatePasswordMatch = () => {
    const { password, passwordConfirm } = form.value;

    if (!password.trim()) {
        passwordError.value = '비밀번호를 입력하세요.';
        showError.value.password = true;
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,16}$/.test(password)) {
        passwordError.value = '영문/숫자/특수문자 포함 10~16자로 입력하세요.';
        showError.value.password = true;
    } else if (!passwordConfirm.trim()) {
        passwordError.value = '비밀번호 확인을 입력하세요.';
        showError.value.password = true;
    } else if (password !== passwordConfirm) {
        passwordError.value = '비밀번호가 일치하지 않습니다.';
        showError.value.password = true;
    } else {
        passwordError.value = '';
        showError.value.password = false;
    }

    // setTimeout(() => (showError.value.password = false), 3000);
};

// 이메일 중복 검사
const validateEmail = async () => {
    const email = form.value.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailError.value = '이메일을 입력하세요.';
        showError.value.email = true;
    } else if (!emailPattern.test(email)) {
        emailError.value = '올바른 이메일 형식이 아닙니다.';
        showError.value.email = true;
    } else {
        try {
            const response = await axios.get(`/api/user/checkemail/${email}`);
            if (!response.data) {
                emailError.value = ''; // 사용 가능
                showError.value.email = false;
            } else {
                emailError.value = '이미 사용 중인 이메일입니다.';
                showError.value.email = true;
            }
        } catch (error) {
            console.error('이메일 중복 검사 오류:', error);
            emailError.value = '이메일 확인 중 오류가 발생했습니다.';
            showError.value.email = true;
        }
    }

    // setTimeout(() => (showError.value.email = false), 3000);
};

// 회원가입 버튼 활성화 조건
const isFormValid = computed(() => {
    return (
        form.value.username.trim() &&
        form.value.password.trim() &&
        form.value.name.trim() &&
        form.value.email.trim() &&
        !usernameError.value &&
        !emailError.value &&
        !passwordError.value
    );
});

const handleSubmit = async () => {
    try {
        const response = await axios.post('/api/member/join', form.value);
        console.log('회원가입 성공:', response.data);
        alert('회원가입이 완료되었습니다.');
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입에 실패하였습니다.');
    }
};
</script>

<style scoped>
.signup-container {
    max-width: 700px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}

.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 50px;
}

/* form-group 기본 설정 */
.signup-form .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

/* 라벨 왼쪽 정렬 + 크기 조정 */
.signup-form label {
    width: 100px;
    margin-right: 40px;
    text-align: right;
}

/* 입력 필드 길이 확장 */
.signup-form input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 2px;
    width: 100%;
}

/* 주소 입력 필드 조정 */
.address-group {
    align-items: flex-start; /* 주소 입력 필드를 위로 정렬 */
}

.address-component {
    flex: 1;
}

/* 우편번호 필드 크기 조정 */
.address-component .zipcode-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.address-component .zipcode-input {
    width: 30%;
}

/* 생년월일 필드 길이 조정 */
.birth-group {
    display: flex;
    gap: 10px;
    flex: 1;
}

/* 생년월일 입력 필드 */
.birth-group input,
.birth-group select {
    width: 100px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 2px;
    text-align: center;
}

/* 이메일 안내 문구 정렬 */
.email-info {
    font-size: 12px;
    color: #555;
    margin-left: 140px;
    margin-bottom: 20px;
}

/* 전화번호 입력 스타일 */
.phone-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    width: 100%; /* 가로 정렬을 위해 전체 너비 지정 */
}

/* 전화번호 입력 필드 가로 정렬 */
.phone-input-group {
    display: flex;
    gap: 10px;
    flex: 1;
}

/* 전화번호 select & input 스타일 */
.phone-input-group select,
.phone-input-group input {
    width: 33%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 2px;
    text-align: center;
}

/* 회원가입 버튼 컨테이너 중앙 정렬 */
.sbm-btn-container {
    display: flex;
    justify-content: center;
}

/* 회원가입 버튼 크기 및 정렬 */
.btn-submit {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    max-width: 180px;
    display: block;
    text-align: center;
    margin: 20px auto;
}

.btn-submit:hover {
    background-color: #555;
}

.btn-submit:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* 에러 메시지 스타일 (email-info와 유사한 위치) */
.error-message {
    font-size: 12px;
    color: red;
    margin-left: 140px;
    margin-bottom: 20px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
}

.email-info {
    font-size: 12px;
    color: #555;
    margin-left: 140px;
    margin-bottom: 20px;
}

/* 에러 메시지 숨김 처리 */
.error-message.hide {
    opacity: 0;
}
</style>
