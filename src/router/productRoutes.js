//상품관련
export default [
    {
        path: '/items/:id',
        name: 'ItemDetail',
        component: () => import('@/pages/Item/ItemDetail.vue'),
    },
    {
        path: '/items',
        name: 'ItemList',
        component: () => import('@/pages/Item/ItemList.vue'),
    },
    {
        path: '/perfume',
        name: 'Perfume',
        component: () => import('@/pages/Item/Perfume.vue'),
    },
];
