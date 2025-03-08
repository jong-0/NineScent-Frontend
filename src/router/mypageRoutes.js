//마이페이지 관련

import { useAuthStore } from '@/stores/authStore';

export default [
  {
    path: '/mypage/:id',
    name: 'MyPage',
    component: () => import('@/pages/Mypage/MyPage.vue'),
    children: [
      {
        path: '', // 기본적으로 보여줄 컴포넌트 (예: 최근 주문 내역)
        name: 'MypageHome',
        component: () =>
          import('@/pages/Mypage/OrderHistory.vue'),
      },
      {
        path: 'orders', // 주문 조회 페이지
        name: 'OrderList',
        component: () =>
          import('@/pages/Mypage/OrderList.vue'),
      },
      {
        path: 'addaddress', // 배송지 추가 페이지
        name: 'MyPageAddAddress',
        component: () =>
          import('@/pages/Mypage/MyPageAddAddress.vue'),
      },
      {
        path: 'updateaddress/:addrNo', // 배송지 수정 페이지
        name: 'MyPageUpdateAddress',
        component: () =>
          import('@/pages/Mypage/MyPageUpdateAddress.vue'),
      },
      {
        path: 'address', // 배송지 관리 페이지
        name: 'MyPageAddress',
        component: () =>
          import('@/pages/Mypage/MyPageAddress.vue'),
      },
      {
        path: 'orderdetail/:orderId',
        name: 'OrderDetail',
        component: () =>
          import('@/pages/Mypage/OrderDetail.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        next('/login');
      } else if (to.params.id !== authStore.userId) {
        next(`/mypage/${authStore.userId}`);
      } else {
        next();
      }
    },
  },
];
