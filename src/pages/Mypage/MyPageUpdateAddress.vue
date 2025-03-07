<template>
  <AddressForm
    mode="edit"
    :initialData="addressData"
    :submitFunction="submitAddress"
    :cancelFunction="cancelUpdate"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AddressForm from '@/components/Address/AddressForm.vue';
import addressApi from '@/api/addressApi';

const route = useRoute();
const router = useRouter();
const addrNo = route.params.addrNo;

const addressData = ref({
  addrNicName: '',
  addrName: '',
  addrContact: '',
  addrZipcode: '',
  addrAddress: '',
  addrDetail: '',
  addrExtraDetail: '',
  addrRequest: '',
  isDefault: false,
});

// 기존 주소 가져오기
const fetchAddress = async () => {
  try {
    const fetchedData = await addressApi.getAddress(addrNo);
    addressData.value = { ...fetchedData };
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};

// 주소 업데이트 API 호출
const submitAddress = async (updatedData) => {
  try {
    await addressApi.updateAddress(addrNo, updatedData);
    router.replace({ name: 'MyPageAddress' });
  } catch (error) {
    alert('주소 수정 실패.');
  }
};

const cancelUpdate = () => {
  router.push({ name: 'MyPageAddress' });
};

onMounted(() => {
  fetchAddress();
});
</script>
