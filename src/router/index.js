import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
// import Login from '@/pages/Login.vue';
// import Signup from '@/pages/Signup.vue';
// import Category from '@/pages/Category.vue';
// import ProductDetail from '@/pages/ProductDetail.vue';
// import Cart from '@/pages/CartPage.vue';
// import Checkout from '@/pages/Checkout.vue';
// import OrderComplete from '@/pages/OrderComplete.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    // { path: '/login', component: Login },
    // { path: '/signup', component: Signup },
    // { path: '/category/:id', component: Category },
    // { path: '/product/:id', component: ProductDetail },
    // { path: '/cart', component: Cart },
    // { path: '/checkout', component: Checkout },
    // { path: '/order-complete', component: OrderComplete },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
