//주소 관련
export default [
    {
        path: '/address',
        name: 'Address',
        component: () => import('@/pages/Address/Address.vue'),
    },
    {
        path: '/addaddress',
        name: 'AddAddress',
        component: () => import('@/pages/Address/AddAddress.vue'),
    },
    {
        path: '/updateaddress/:addrNo',
        name: 'UpdateAddress',
        component: () => import('@/pages/Address/UpdateAddress.vue'),
    },
];
