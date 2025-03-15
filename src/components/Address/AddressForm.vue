<template>
  <div class="address-form-container">
    <h1 class="title">
      {{ mode === 'add' ? '배송지 추가' : '배송지 수정' }}
    </h1>

    <div class="address-form">
      <input
        type="text"
        v-model="addressData.addrNicName"
        placeholder="주소지 별칭"
        class="input-field"
        required
      />
      <input
        type="text"
        v-model="addressData.addrName"
        placeholder="받는 사람"
        class="input-field"
        required
      />
      <input
        type="text"
        id="numberInput"
        v-model="addressData.addrContact"
        placeholder="연락처"
        class="input-field"
        @input="formatPhoneNumber"
        required
      />

      <div class="zipcode-container">
        <input
          type="text"
          v-model="addressData.addrZipcode"
          placeholder="우편번호"
          class="input-field zipcode"
          disabled
        />
        <button
          class="btn zipcode-btn"
          @click="execDaumPostcode"
        >
          우편번호 찾기
        </button>
      </div>
      <!-- 우편번호 찾기 -->
      <div id="wrap" class="zipcode-modal">
        <img
          src="//t1.daumcdn.net/postcode/resource/images/close.png"
          class="close-btn"
          @click="foldDaumPostcode"
          alt="닫기"
        />
      </div>

      <input
        type="text"
        v-model="addressData.addrAddress"
        placeholder="주소"
        class="input-field"
        disabled
      />
      <input
        type="text"
        v-model="addressData.addrDetail"
        id="addrDetail"
        placeholder="상세주소"
        class="input-field"
        required
      />
      <input
        type="text"
        v-model="addressData.addrExtraDetail"
        placeholder="참고주소"
        class="input-field"
        disabled
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
        <button class="btn submit-btn" @click="submitForm">
          {{ mode === 'add' ? '추가 완료' : '수정 완료' }}
        </button>
        <button
          class="btn cancel-btn"
          @click="cancelAction"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  mode: { type: String, required: true }, // "add" or "edit"
  initialData: { type: Object, required: true }, // 기존 데이터
  submitFunction: { type: Function, required: true }, // API 호출 함수
  cancelFunction: { type: Function, required: true }, // 취소 버튼 함수
});

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

const formatPhoneNumber = () => {
  let phone = addressData.value.addrContact.replace(
    /\D/g,
    ''
  ); // 숫자만 남기기
  if (phone.length > 3 && phone.length <= 7) {
    phone = `${phone.slice(0, 3)}-${phone.slice(3)}`;
  } else if (phone.length > 7) {
    phone = `${phone.slice(0, 3)}-${phone.slice(
      3,
      7
    )}-${phone.slice(7, 11)}`;
  }
  addressData.value.addrContact = phone;
};

watch(
  () => props.initialData,
  (newData) => {
    addressData.value = { ...newData };
  },
  { deep: true }
);

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

// 필수 입력값 검사 후 제출
const submitForm = async () => {
  const requiredFields = [
    'addrNicName',
    'addrName',
    'addrContact',
    'addrZipcode',
    'addrDetail',
  ];
  const isValid = requiredFields.every(
    (field) => addressData.value[field]
  );

  if (!isValid) {
    alert('모든 필수 정보를 입력해주세요.');
    return;
  }

  console.log('🚀 제출 데이터:', addressData.value);
  await props.submitFunction(addressData.value);

  alert('주소가 성공적으로 저장되었습니다.');
};

// 취소
const cancelAction = () => {
  props.cancelFunction();
};
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
