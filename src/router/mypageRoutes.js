//마이페이지 관련

import { useAuthStore } from '@/stores/authStore';

export default [
    {
        path: '/mypage/:id',
        name: 'MyPage',
        component: () => import('@/pages/Mypage/MyPage.vue'),
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
    {
        path: '/orderdetail/:orderId',
        name: 'OrderDetail',
        component: () => import('@/pages/Mypage/OrderDetail.vue'),
        props: true,
    },
    {
        path: '/orderList',
        name: 'OrderList',
        component: () => import('@/pages/Mypage/OrderList.vue'),
    },
];
