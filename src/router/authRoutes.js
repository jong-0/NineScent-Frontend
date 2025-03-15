//인증 관련
export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/member/Login.vue'),
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/pages/member/Signup.vue'),
    },
    {
        path: '/joinComplete',
        name: 'JoinComplete',
        component: () => import('@/pages/member/JoinComplete.vue'),
    },
    {
        path: '/findId',
        name: 'FindId',
        component: () => import('@/pages/member/FindId.vue'),
    },
    {
        path: '/findPw',
        name: 'FindPw',
        component: () => import('@/pages/member/FindPw.vue'),
    },
];
