<template>
    <div class="address-container">
        <!-- 우편번호 입력 + 버튼 -->
        <div class="zipcode-container">
            <input type="text" v-model="addrZipcode" placeholder="우편번호" readonly class="zipcode-input" />
            <button type="button" class="zip-code-button" @click="openAddressPopup">우편번호</button>
        </div>

        <!-- 기본 주소 -->
        <input type="text" v-model="addrAddress" placeholder="기본 주소" readonly class="address-input" />

        <!-- 상세 주소 -->
        <input type="text" v-model="addrDetail" placeholder="나머지 주소" class="address-input" />

        <!-- 참고 주소 -->
        <input type="text" v-model="addrExtraDetail" placeholder="참고 주소" readonly class="address-input" />
    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const emit = defineEmits(['address-selected']);

//    Vue 반응형 데이터
const addrZipcode = ref('');
const addrAddress = ref('');
const addrDetail = ref('');
const addrExtraDetail = ref('');

//    Daum API를 스크립트로 로드 (onMounted에서 실행)
onMounted(() => {
    if (window.daum && window.daum.Postcode) {
        return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => console.log('Daum 우편번호 API 로드 완료');
    document.head.appendChild(script);
});

//    Daum 우편번호 검색 팝업 실행
const openAddressPopup = () => {
    if (!window.daum || !window.daum.Postcode) {
        alert('주소 검색 API가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    new window.daum.Postcode({
        oncomplete: function (data) {
            let addr = ''; // 주소
            let extraAddr = ''; // 참고항목

            // 사용자가 선택한 주소 타입에 따라 주소 설정
            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            // 참고 항목 (법정동, 건물명 등 추가 정보)
            if (data.userSelectedType === 'R') {
                if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName && data.apartment === 'Y') {
                    extraAddr += extraAddr ? `, ${data.buildingName}` : data.buildingName;
                }
                if (extraAddr) {
                    extraAddr = ` (${extraAddr})`;
                }
            }

            //    Vue 반응형 데이터에 값 저장
            addrZipcode.value = data.zonecode;
            addrAddress.value = addr;
            addrExtraDetail.value = extraAddr;

            //    부모 컴포넌트로 데이터 전달
            emit('address-selected', {
                addrZipcode: data.zonecode,
                addrAddress: addr,
                addrDetail: '',
                addrExtraDetail: extraAddr || '',
            });
        },
    }).open();
};
</script>

<style scoped>
/*    전체 컨테이너 */
.address-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

/*    우편번호 입력과 버튼을 가로 정렬 */
.zipcode-container {
    display: flex;
    gap: 10px;
}

/*    우편번호 입력 필드 */
.zipcode-input {
    flex: none;
    width: 25%; /* 더 작은 크기로 조정 */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 2px;
    background-color: #f7f7f7;
    cursor: not-allowed;
}

/*    우편번호 버튼 */
.zip-code-button {
    padding: 10px 15px;
    border: 1px solid #333;
    background-color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
}

.zip-code-button:hover {
    background-color: #ddd;
}

/*    주소 입력 필드 */
.address-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 2px;
    background-color: #f7f7f7;
    cursor: not-allowed;
}

/*    상세 주소만 활성화 */
.address-input:not([readonly]) {
    background-color: white;
    cursor: text;
}

/*    기본 주소, 나머지 주소, 참고 주소 필드 크기 확장 */
.full-width {
    flex: 1;
    width: 100%;
}
</style>
