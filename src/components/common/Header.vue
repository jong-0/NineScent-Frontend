<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// 마이페이지 이동 로직
const goToMyPage = () => {
  if (authStore.isAuthenticated) {
    router.push(`/mypage/${authStore.userId}`);
  } else {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }
};

onMounted(() => {
  document.querySelector('.logo').addEventListener('mouseenter', () => {
    document.body.style.cursor = 'default'; // 기본 커서 초기화
    document.querySelector('.logo').style.cursor = 'pointer'; // 클릭 가능하게 유지
  });

  document.querySelector('.logo').addEventListener('mousemove', (e) => {
    const emoji = ' 🧸';
    const cursorElement = document.createElement('div');

    cursorElement.style.position = 'absolute';
    cursorElement.style.left = `${e.pageX}px`;
    cursorElement.style.top = `${e.pageY}px`;
    cursorElement.style.fontSize = '24px';
    cursorElement.style.pointerEvents = 'none';
    cursorElement.style.zIndex = '9999';
    cursorElement.innerText = emoji;

    document.body.appendChild(cursorElement);

    setTimeout(() => {
      cursorElement.remove();
    }, 150); // 100ms 후 삭제
  });

  document.querySelector('.logo').addEventListener('mouseleave', () => {
    document.body.style.cursor = 'default';
  });
});
</script>

<template>
  <header class="header">
    <router-link to="/" class="logo">NINESCENT</router-link>
    <nav class="navigation">
      <ul>
        <li><a href="/">BEST</a></li>
        <!-- <li><a href="#" @click="perfumeList">PERFUME</a></li> -->
        <li><a href="/items">PERFUME</a></li>
        <!-- <li><a href="#" @click="etc">ETC</a></li> -->
        <li><a href="/etc">ETC</a></li>
        <li><a href="#">ABOUT</a></li>
      </ul>
    </nav>
    <nav class="navigation-icon">
      <ul>
        <li>
          <a href="javascript:void(0);" @click="goToMyPage">
            <font-awesome-icon :icon="['fas', 'user']" />
          </a>
        </li>
        <li>
          <a href="/cart">
            <font-awesome-icon :icon="['fas', 'cart-shopping']" />
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background-color: #f8f8f8;
}
.logo {
  font-size: 16px;
  font-weight: bold;
  cursor: inherit;
  text-decoration: none;
  color: inherit;
}
.navigation ul {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 0px;
  padding-top: 10px;
}
.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  padding: 8px;
  position: relative;
}

/* 마우스 오버 시 부드러운 밑줄 효과 */
.navigation a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -16px;
  width: 0;
  height: 1.5px;
  background-color: #333;
  transition: width 0.3s ease;
}

.navigation a:hover::after {
  width: 100%;
}

.navigation-icon ul {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 0px;
  padding-top: 10px;
}
.navigation-icon a {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  padding: 8px;
}
</style>
