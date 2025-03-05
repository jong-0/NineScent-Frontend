<template>
    <div class="address-container">
        <h1 class="title">배송지 선택</h1>

        <div v-if="addresses && addresses.length" class="address-list">
            <!-- <h3 class="subtitle">배송지 리스트</h3> -->
            <div v-for="address in addresses" :key="address.addrNo" class="address-card">
                <div class="address-info">
                    <p class="nickname">{{ address.addrNicName }}</p>
                    <p>{{ address.addrName }}</p>
                    <p>
                        {{ address.addrAddress }}
                        {{ address.addrDetail }}
                    </p>
                    <p>{{ address.addrContact }}</p>
                    <p>요청사항: {{ address.addrRequest }}</p>
                </div>

                <div class="button-group">
                    <!--    체크아웃 페이지에서는 '선택' 버튼 표시 -->

                    <button v-if="source === 'checkout'" class="btn select" @click="selectAddress(address.addrNo)">선택</button>
                    <button class="btn edit" @click="goUpdateAddress(address.addrNo)">수정</button>
                    <button class="btn delete" @click="deleteAddress(address.addrNo)" :disabled="address.isDefault">삭제</button>
                    <span v-if="address.isDefault" class="default-address"> 기본 배송지입니다. (삭제할 수 없습니다) </span>
                </div>
            </div>
        </div>

        <div class="button-container">
            <button class="btn add" @click="goAddAddress">배송지 추가</button>
            <!-- 마이페이지에서는 '돌아가기'를 마이페이지로 -->
            <button v-if="source === 'mypage'" class="btn back" @click="goBack">돌아가기</button>

            <!-- 체크아웃 페이지에서는 '돌아가기'를 체크아웃으로 -->
            <button v-if="source === 'checkout'" class="btn back" @click="goToCheckout">돌아가기</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import addressApi from '@/api/addressApi';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// `query.source`에서 값을 가져오도록 수정 (기본값: 'mypage')
const source = ref(route.query.source);
const userNo = authStore.userNo;
const addresses = ref({});

const fetchAddressList = async () => {
    try {
        const response = await addressApi.getAddressList(userNo);
        addresses.value = response;
    } catch (error) {
        console.error('Error fetching list', error);
    }
};

// 주소 추가
const goAddAddress = () => {
    router.push({ name: 'AddAddress' });
};
// 주소 수정
const goUpdateAddress = (addrNo) => {
    router.push({
        name: 'UpdateAddress',
        params: { addrNo },
    });
};

const deleteAddress = async (addrNo) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const addressToDelete = addresses.value.find((address) => address.addrNo === addrNo);
    if (addressToDelete.isDefault) {
        alert('기본 배송지는 삭제할 수 없습니다');
        return;
    }
    try {
        await addressApi.deleteAddress(addrNo);
        addresses.value = addresses.value.filter((address) => address.addrNo !== addrNo);
    } catch (error) {
        console.error('Error deleting address', error);
    }
};

// 선택한 주소 업데이트
const selectAddress = async (addrNo) => {
    if (source.value !== 'checkout') return; // 마이페이지에서는 선택 X

    if (!addrNo) {
        const defaultAddress = addresses.value.find((address) => address.isDefault === true);
        if (defaultAddress) {
            addrNo = defaultAddress.addrNo;
        } else {
            console.error('기본 배송지를 찾을 수 없습니다.');
            return;
        }
    }
    try {
        sessionStorage.setItem('selectedAddress', addrNo);
        router.replace({ name: 'Checkout' });
    } catch (error) {
        console.error('Error updating order address:', error);
    }
};
// 마이페이지에서 돌아가기
const goBack = () => {
    if (authStore.isAuthenticated) {
        router.push(`/mypage/${authStore.userId}`);
    } else {
        alert('로그인이 필요합니다.');
        router.push('/login');
    }
};

// 체크아웃에서 돌아가기
const goToCheckout = () => {
    router.push({ name: 'Checkout' });
};
onMounted(() => {
    fetchAddressList();
});
</script>

<style scoped>
/* 전체 컨테이너 */
.address-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
}

/* .subtitle {
  font-size: 1.4rem;
  margin-bottom: 15px;
} */

/* 배송지 리스트 */
.address-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 개별 배송지 카드 */
.address-card {
    background: #f7f6f0;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #d6d3cb;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.address-info p {
    margin: 0;
    font-size: 1rem;
}

.nickname {
    font-weight: bold;
    font-size: 1.1rem;
}

.default-address {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #ff5733;
}

/* 버튼 그룹 */
.button-group {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 10px 12px;
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
}

/* 버튼 스타일 */
.select {
    background: #1a1a1a;
    color: white;
}

.edit {
    background: #969696;
    color: white;
}

.delete {
    background: #d9534f;
    color: white;
}

.delete:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* 추가 및 뒤로 가기 버튼 */
.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
}

.add {
    background: #008cba;
    color: white;
}

.back {
    background: #333;
    color: white;
}

/* 반응형 */
@media (max-width: 600px) {
    .button-group {
        flex-direction: column;
    }
    .btn {
        width: 100%;
    }
}
</style>
