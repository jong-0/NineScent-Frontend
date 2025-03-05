//장바구니, 주문, 결제
export default [
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/pages/order/CartPage.vue'),
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@/pages/order/Checkout.vue'),
    },
    {
        path: '/complete',
        name: 'OrderComplete',
        component: () => import('@/pages/order/OrderComplete.vue'),
    },
];
