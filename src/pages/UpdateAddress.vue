<template>
  <div class="address-form-container">
    <h1 class="title">배송지 수정</h1>

    <div class="address-form">
      <input
        type="text"
        v-model="addressData.addrNicName"
        placeholder="주소지 별칭"
        class="input-field"
      />
      <input
        type="text"
        v-model="addressData.addrName"
        placeholder="받는 사람"
        class="input-field"
      />
      <input
        type="text"
        v-model="addressData.addrContact"
        placeholder="연락처"
        class="input-field"
      />

      <div class="zipcode-container">
        <input
          type="text"
          id="addrZipcode"
          v-model="addressData.addrZipcode"
          placeholder="우편번호"
          class="input-field zipcode"
        />
        <button
          class="btn zipcode-btn"
          @click="execDaumPostcode"
        >
          우편번호 찾기
        </button>
      </div>

      <input
        type="text"
        id="addrAddress"
        v-model="addressData.addrAddress"
        placeholder="주소"
        class="input-field"
      />
      <input
        type="text"
        id="addrDetail"
        v-model="addressData.addrDetail"
        placeholder="상세주소"
        class="input-field"
      />
      <input
        type="text"
        id="addrExtraDetail"
        v-model="addressData.addrExtraDetail"
        placeholder="참고주소"
        class="input-field"
      />

      <input
        type="text"
        v-model="addressData.addrRequest"
        placeholder="배송관련 요청사항"
        class="input-field"
      />

      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="addressData.isDefault"
        />
        기본 배송지로 설정
      </label>

      <div class="button-group">
        <button
          class="btn cancel-btn"
          @click="cancelUpdate"
        >
          취소
        </button>
        <button
          class="btn submit-btn"
          @click="submitAddress"
        >
          수정 완료
        </button>
      </div>
    </div>

    <!-- 우편번호 찾기 -->
    <div id="wrap" class="zipcode-modal">
      <img
        src="//t1.daumcdn.net/postcode/resource/images/close.png"
        id="btnFoldWrap"
        class="close-btn"
        @click="foldDaumPostcode"
        alt="접기 버튼"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import addressApi from '@/api/addressApi';

const address = ref('');

const route = useRoute();
const router = useRouter();
const addrNo = route.params.addrNo;
const userNo = localStorage.getItem('userNo'); // Local Storage에서 가져오기

const fetchAddress = async () => {
  try {
    const fetchedData = await addressApi.getAddress(addrNo); // 주소 데이터를 API에서 가져옴
    // addressData에 데이터 채우기
    addressData.value = {
      addrNicName: fetchedData.addrNicName || '',
      addrName: fetchedData.addrName || '',
      addrContact: fetchedData.addrContact || '',
      addrZipcode: fetchedData.addrZipcode || '',
      addrAddress: fetchedData.addrAddress || '',
      addrDetail: fetchedData.addrDetail || '',
      addrExtraDetail: fetchedData.addrExtraDetail || '',
      addrRequest: fetchedData.addrRequest || '',
      isDefault: fetchedData.isDefault || false,
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    alert('주소 정보를 가져오는 데 실패했습니다.');
  }
};

// 주소 데이터
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

// Daum 우편번호 찾기
const execDaumPostcode = () => {
  const element = document.getElementById('wrap');
  const currentScroll = Math.max(
    document.body.scrollTop,
    document.documentElement.scrollTop
  );

  new daum.Postcode({
    oncomplete: function (data) {
      let addr = ''; // 주소 변수
      let addrExtraDetail = ''; // 참고항목 변수

      // 선택한 주소 타입에 따라 값 설정
      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (
          data.bname !== '' &&
          /[동|로|가]$/g.test(data.bname)
        ) {
          addrExtraDetail += data.bname;
        }
        if (
          data.buildingName !== '' &&
          data.apartment === 'Y'
        ) {
          addrExtraDetail +=
            addrExtraDetail !== ''
              ? ', ' + data.buildingName
              : data.buildingName;
        }
        if (addrExtraDetail !== '') {
          addrExtraDetail = ' (' + addrExtraDetail + ')';
        }
      }

      // 데이터 업데이트
      addressData.value.addrZipcode = data.zonecode;
      addressData.value.addrAddress = addr;
      addressData.value.addrExtraDetail = addrExtraDetail;

      // 상세주소 필드로 포커스 이동
      document.getElementById('addrDetail').focus();

      // iframe 숨김
      if (element) element.style.display = 'none';

      // 스크롤 복원
      document.body.scrollTop = currentScroll;
    },
    onresize: function (size) {
      if (element)
        element.style.height = size.height + 'px';
    },
    width: '100%',
    height: '100%',
  }).embed(element);

  if (element) element.style.display = 'block';
};

// iframe 닫기
const foldDaumPostcode = () => {
  const element = document.getElementById('wrap');
  if (element) element.style.display = 'none';
};

const cancelUpdate = () => {
  router.push({ name: 'Address', params: { userNo } }); // Address 페이지로 이동
};
// 백엔드로 주소 데이터 저장
const submitAddress = async () => {
  console.log(addressData.value);

  if (
    !addressData.value.addrNicName ||
    !addressData.value.addrName ||
    !addressData.value.addrContact ||
    !addressData.value.addrZipcode ||
    !addressData.value.addrAddress
  ) {
    alert('모든 필수 정보를 입력해주세요.');
    return;
  }

  try {
    await addressApi.updateAddress(
      addrNo,
      addressData.value
    );
    alert('주소가 성공적으로 수정되었습니다.'); // 성공 메시지 표시
    localStorage.setItem('userNo', userNo); // Local Storage에 저장
    router.push({ name: 'Address', params: { userNo } }); // Address 페이지로 이동
  } catch (error) {
    alert('주소 저장에 실패했습니다. 다시 시도해주세요.');
  }
};

onMounted(() => {
  fetchAddress();
});
</script>

<style scoped>
/* 전체 컨테이너 */
.address-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f7f6f0;
  border-radius: 10px;
  border: 1px solid #d6d3cb;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

/* 입력 폼 스타일 */
.address-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* 우편번호 검색 */
.zipcode-container {
  display: flex;
  gap: 10px;
}

.zipcode {
  flex: 2;
}

.zipcode-btn {
  flex: 1;
  background: #008cba;
  color: white;
}

/* 체크박스 스타일 */
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 8px;
}

/* 버튼 스타일 */
.btn {
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn {
  background: #1a1a1a;
  color: white;
}

.cancel-btn {
  background: #d9534f;
  color: white;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

/* 우편번호 찾기 모달 */
.zipcode-modal {
  display: none;
  border: 1px solid #ccc;
  width: 500px;
  height: 300px;
  margin: 5px 0;
  position: relative;
}

.close-btn {
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: -1px;
  z-index: 1;
}

/* 반응형 */
@media (max-width: 600px) {
  .zipcode-container {
    flex-direction: column;
  }
  .zipcode-btn {
    width: 100%;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>
