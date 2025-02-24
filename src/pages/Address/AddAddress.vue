<template>
  <AddressForm
    mode="add"
    :initialData="addressData"
    :submitFunction="submitAddress"
    :cancelFunction="cancelAdd"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddressForm from '@/components/Address/AddressForm.vue';
import addressApi from '@/api/addressApi';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

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

// 주소 추가 API 호출
const submitAddress = async (addressData) => {
  console.log(addressData);

  try {
    await addressApi.addAddress(
      authStore.userNo,
      addressData
    );
    router.replace({ name: 'Address' });
  } catch (error) {
    alert('주소 추가 실패.');
  }
};

const cancelAdd = () => {
  router.push({ name: 'Address' });
};
</script>
