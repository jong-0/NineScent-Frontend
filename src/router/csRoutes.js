//고객센터 관련
export default [
    {
        path: '/cscenter',
        name: 'CSCenter',
        component: () => import('@/pages/CS/CSCenter.vue'),
    },
    {
        path: '/faq/add',
        name: 'AddFaq',
        component: () => import('@/pages/CS/AddFaq.vue'),
    },

    {
        path: '/faq/update/:faqId',
        name: 'UpdateFaq',
        component: () => import('@/pages/CS/AddFaq.vue'),
    },
    {
        path: '/qna/:id/add',
        name: 'AddQna',
        component: () => import('@/pages/CS/AddQna.vue'),
    },
    {
        path: '/review/:id/add/',
        name: 'AddReview',
        component: () => import('@/pages/CS/AddReview.vue'),
    },
];
