<template>
  <h1>Address Page</h1>
  <div v-if="addresses && addresses.length">
    <h3>배송지 리스트</h3>
    <div v-for="address in addresses" :key="address.addrNo">
      <p>{{ address.addrNicName }}</p>
      <p>{{ address.addrName }}</p>
      <p>{{ address.addrAddress }}</p>
      <p>{{ address.addrDetail }}</p>
      <p>{{ address.addrContact }}</p>

      <p v-if="address.isDefault">
        <br />기본 배송지입니다.(삭제할 수 없습니다)
      </p>
      <button @click="selectAddress(address.addrNo)">
        선택
      </button>
      <button @click="goUpdateAddress(address.addrNo)">
        수정
      </button>
      <button @click="deleteAddress(address.addrNo)">
        삭제
      </button>
    </div>
  </div>
  <div>
    <button @click="goAddAddress">배송지 추가</button>
  </div>
  <div v-if="addresses && addresses.length">
    <button @click="selectAddress(null)">돌아가기</button>
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
