<template>
  <div class="address-container">
    <h1 class="title">배송지 선택</h1>

    <div
      v-if="addresses && addresses.length"
      class="address-list"
    >
      <h3 class="subtitle">배송지 리스트</h3>
      <div
        v-for="address in addresses"
        :key="address.addrNo"
        class="address-card"
      >
        <div class="address-info">
          <p class="nickname">{{ address.addrNicName }}</p>
          <p>{{ address.addrName }}</p>
          <p>
            {{ address.addrAddress }}
            {{ address.addrDetail }}
          </p>
          <p>{{ address.addrContact }}</p>
        </div>

        <p v-if="address.isDefault" class="default-address">
          기본 배송지입니다. (삭제할 수 없습니다)
        </p>

        <div class="button-group">
          <button
            class="btn select"
            @click="selectAddress(address.addrNo)"
          >
            선택
          </button>
          <button
            class="btn edit"
            @click="goUpdateAddress(address.addrNo)"
          >
            수정
          </button>
          <button
            class="btn delete"
            @click="deleteAddress(address.addrNo)"
            :disabled="address.isDefault"
          >
            삭제
          </button>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button class="btn add" @click="goAddAddress">
        배송지 추가
      </button>
      <button
        v-if="addresses && addresses.length"
        class="btn back"
        @click="selectAddress(null)"
      >
        돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import addressApi from '@/api/addressApi';

// const route = useRoute();
const router = useRouter();
const userNo = localStorage.getItem('userNo'); // Local Storage에서 가져오기
const addresses = ref({});

const fetchAddressList = async () => {
  try {
    const response = await addressApi.getAddressList(
      userNo
    );
    addresses.value = response;
  } catch (error) {
    console.error('Error fetching list', error);
  }
};

const goAddAddress = () => {
  localStorage.setItem('userNo', userNo); // Local Storage에 저장
  router.push({ name: 'AddAddress' }); // state 대신 params 없이 이동
};

const goUpdateAddress = (addrNo) => {
  localStorage.setItem('userNo', userNo); // Local Storage에 저장
  router.push({
    name: 'UpdateAddress',
    params: { addrNo },
  }); // state 대신 params 없이 이동
};

const deleteAddress = async (addrNo) => {
  const addressToDelete = addresses.value.find(
    (address) => address.addrNo === addrNo
  );
  if (addressToDelete.isDefault) {
    alert('기본 배송지는 삭제할 수 없습니다');
    return;
  }
  try {
    await addressApi.deleteAddress(addrNo);
    addresses.value = addresses.value.filter(
      (address) => address.addrNo !== addrNo
    );
  } catch (error) {
    console.error('Error deleting address', error);
  }
};

// 선택한 주소 업데이트
const selectAddress = async (addrNo) => {
  if (!addrNo) {
    const defaultAddress = addresses.value.find(
      (address) => address.isDefault === true
    );
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

.subtitle {
  font-size: 1.4rem;
  margin-bottom: 15px;
}

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
