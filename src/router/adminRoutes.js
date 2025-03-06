//관리자 페이지

export default [
    {
        path: '/admin',
        name: 'AdminPage',
        component: () => import('@/pages/Admin/AdminPage.vue'),
        meta: { requiresAdmin: true },
    },
];
