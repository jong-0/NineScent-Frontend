<template>
  <div>
    <h1>Qna</h1>
    <div>
      <ul>
        <div>
          <li v-for="qna in qnas" :key="qna.qnaId" class="qna">
            <div class="question-header" @click="toggleAnswer(qna.questionId)">
              <div>
                <p>userNo: {{ qna.userNo }}</p>
                <p>category: {{ qna.qnaCategory }}</p>
                <p>content: {{ qna.content }}</p>
                <p>attachment: {{ qna.attachment }}</p>
                <p>date: {{ formatDate(qna.createdDate) }}</p>
                <p>
                  isDone:
                  <span>
                    {{ qna.done ? '답변 완료' : '답변 대기중' }}
                  </span>
                </p>
              </div>
              <div>
                <span class="update" @click="editQna(qna)"
                  ><i class="fa-regular fa-pen-to-square"></i
                ></span>
                <span class="delete" @click.stop="deleteQna(qna.questionId)"
                  ><i class="fa-solid fa-x"></i
                ></span>
              </div>
              <div>
                <button v-if="!qna.done" @click.stop="toggleAnswerForm(qna.questionId)">
                  답변하기
                </button>
                <i
                  v-if="qna.done"
                  :class="['fa-solid', 'fa-chevron-down', { rotated: openStates[qna.questionId] }]"
                ></i>
              </div>
            </div>

            <!-- 답변 작성 폼 -->
            <div v-if="answerFormStates[qna.questionId]" class="answer-form">
              <textarea
                v-model="newAnswers[qna.questionId]"
                placeholder="답변을 입력하세요..."
              ></textarea>
              <div class="button-group">
                <button @click="submitAnswer(qna.questionId)" class="submit-btn">제출</button>
                <button @click="cancelAnswer(qna.questionId)" class="cancel-btn">취소</button>
              </div>
            </div>

            <!-- 기존 답변 표시 -->
            <div v-if="qna.done && openStates[qna.questionId]" class="answer-section">
              <div>
                <p>답변: {{ getAnswerContent(qna.questionId) }}</p>
                <p>답변 날짜: {{ formatDate(getAnswerDate(qna.questionId)) }}</p>
              </div>
              <div>
                <button @click="deleteAnswer(qna.questionId)">삭제</button>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
  <div>
    <button @click="addQna(itemId)">글쓰기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import faqnaReviewApi from '@/api/faqnaReviewApi';

const route = useRoute();
const router = useRouter();
const qnas = ref([]);
const answers = ref([]);
const openStates = ref({});
const newAnswers = ref({});
const answerFormStates = ref({}); // 답변 폼의 표시 여부를 관리

const qnaId = route.params.qnaId;
const itemId = route.params.itemId;

const fetchQnaData = async () => {
  if (!itemId) return;
  try {
    const response = await faqnaReviewApi.getQnaByItemId(itemId);
    qnas.value = response;
    answers.value = [];

    for (const qna of response) {
      if (qna.done) {
        const answer = await getAnswerByQnaId(qna.questionId);
        answers.value.push(...answer);
      }
    }
  } catch (error) {
    console.error('Error fetching qna data', error);
  }
};

const getAnswerByQnaId = async (qnaId) => {
  try {
    const response = await faqnaReviewApi.getAnswerByQnaId(qnaId);
    return response;
  } catch (error) {
    console.error('Error fetching answer data', error);
  }
};

const getAnswerContent = (questionId) => {
  const answer = answers.value.find((answer) => answer.questionId === questionId);
  return answer ? answer.answer : 'N/A';
};

const getAnswerDate = (questionId) => {
  const answer = answers.value.find((answer) => answer.questionId === questionId);
  return answer ? answer.createdDate : 'N/A';
};

const toggleAnswer = (questionId) => {
  openStates.value[questionId] = !openStates.value[questionId];
};

const toggleAnswerForm = (questionId) => {
  answerFormStates.value[questionId] = !answerFormStates.value[questionId];
  if (!answerFormStates.value[questionId]) {
    newAnswers.value[questionId] = ''; // 폼을 닫을 때 입력값 초기화
  }
};

const submitAnswer = async (questionId) => {
  try {
    const answerData = {
      questionId: questionId,
      answer: newAnswers.value[questionId],
    };
    await faqnaReviewApi.postAnswer(answerData);
    answerFormStates.value[questionId] = false; // 폼 닫기
    newAnswers.value[questionId] = ''; // 입력값 초기화
    await fetchQnaData(); // 데이터 새로고침
  } catch (error) {
    console.error('Error submitting answer', error);
  }
};

const cancelAnswer = (questionId) => {
  answerFormStates.value[questionId] = false;
  newAnswers.value[questionId] = '';
};

const formatDate = (date) => {
  if (!date || date.length < 6) return 'N/A';
  return date.slice(0, 3).join('-');
};

const addQna = (itemId) => {
  router.push({ name: 'AddQna', params: { itemId } });
};

const editQna = (qna) => {
  router.push({
    name: 'UpdateQna',
    params: {
      itemId: itemId,
      questionId: qna.questionId,
    },
  });
};

const deleteQna = async (questionId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await faqnaReviewApi.deleteQna(questionId);
    fetchQnaData();
  } catch (error) {
    console.error('Error deleting qna', error);
  }
};

const deleteAnswer = async (questionId) => {
  const answer = answers.value.find((answer) => answer.questionId === questionId);
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await faqnaReviewApi.deleteAnswer(answer.answerId);
    fetchQnaData();
  } catch (error) {
    console.error('Error deleting answer', error);
  }
};

onMounted(() => {
  fetchQnaData();
});
</script>

<style scoped>
.qna {
  list-style: none;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.answer-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.answer-form {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.answer-form textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.submit-btn,
.cancel-btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  color: black;
  border: none;
}

.submit-btn:hover,
.cancel-btn:hover {
  background-color: #e96161;
  color: white;
}

.cancel-btn {
  color: black;
  border: none;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
}

.fa-chevron-down.rotated {
  transform: rotate(180deg);
}
</style>
