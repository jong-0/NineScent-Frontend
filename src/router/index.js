import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import authRoutes from './authRoutes';
import mypageRoutes from './mypageRoutes';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import csRoutes from './csRoutes';
import addrRoutes from './addrRoutes';
import adminRoutes from './adminRoutes';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
  },

  ...authRoutes,
  ...mypageRoutes,
  ...orderRoutes,
  ...productRoutes,
  ...csRoutes,
  ...addrRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 저장된 토큰을 불러와 인증 상태를 유지
  if (!authStore.isAuthenticated) {
    authStore.loadStoredToken();
  }

  // 인증이 필요한 페이지 (예: MyPage)
  const requiresAuth = to.matched.some((record) => record.path.startsWith('/mypage'));

  if (requiresAuth && !authStore.isAuthenticated) {
    // 인증이 필요한 페이지에 접근했지만 로그인되지 않은 경우
    return next('/login');
  }

  // 관리자 접근 제한
  if (to.meta.requiresAdmin && authStore.role !== 'ROLE_ADMIN') {
    alert('관리자 권한이 필요합니다.');
    return next('/');
  }

  next();
});

export default router;
