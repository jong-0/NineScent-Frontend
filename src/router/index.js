import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import Perfume from '@/pages/Perfume.vue';
import ItemDetail from '@/pages/Item/ItemDetail.vue';
import ItemList from '@/pages/Item/ItemList.vue';

import Home from '@/pages/Home.vue';
import Login from '@/pages/member/Login.vue';
import Signup from '@/pages/member/Signup.vue';
import JoinComplete from '@/pages/member/JoinComplete.vue';
import FindId from '@/pages/member/FindId.vue';
import FindPw from '@/pages/member/FindPw.vue';

import Checkout from '@/pages/order/Checkout.vue';
import Address from '@/pages/Address/Address.vue';
import AddAddress from '@/pages/Address/AddAddress.vue';
import UpdateAddress from '@/pages/Address/UpdateAddress.vue';
import CSCenter from '@/pages/CS/CSCenter.vue';
import AddFaq from '@/pages/CS/AddFaq.vue';

import Item from '@/pages/Item.vue';
import AddQna from '@/pages/CS/AddQna.vue';
import AddReview from '@/pages/CS/AddReview.vue';

import MyPage from '@/pages/Mypage/MyPage.vue';
import Cart from '@/pages/order/CartPage.vue';

import OrderComplete from '@/pages/order/OrderComplete.vue';
import OrderDetail from '@/pages/Mypage/OrderDetail.vue';
import OrderList from '@/pages/Mypage/OrderList.vue';

const routes = [
    // { path: '/category/:id', component: Category },
    // { path: '/product/:id', component: ProductDetail },
    // { path: '/order-complete', component: OrderComplete },
    {
        path: '/items/:id',
        name: 'ItemDetail',
        component: ItemDetail,
    },
    {
        path: '/items',
        name: 'ItemList',
        component: ItemList,
    },
    {
        path: '/',
        name: 'home',
        component: Home,
    },

    {
        path: '/login',
        name: 'Login',
        component: Login,
    },

    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
    },
    {
        path: '/joinComplete',
        name: 'JoinComplete',
        component: JoinComplete,
    },

    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout,
    },
    {
        path: '/address',
        name: 'Address',
        component: Address,
        props: { source: 'mypage' },
    },
    {
        path: '/address',
        name: 'Address',
        component: Address,
        props: { source: 'checkout' },
    },
    {
        path: '/addaddress',
        name: 'AddAddress',
        component: AddAddress,
    },
    {
        path: '/updateaddress/:addrNo',
        name: 'UpdateAddress',
        component: UpdateAddress,
    },
    {
        path: '/cscenter',
        name: 'CSCenter',
        component: CSCenter,
    },
    {
        path: '/faq/add',
        name: 'AddFaq',
        component: AddFaq,
    },
    {
        path: '/faq/update/:faqId',
        name: 'UpdateFaq',
        component: AddFaq,
    },
    {
        path: '/perfume',
        name: 'Perfume',
        component: Perfume,
    },
    {
        path: '/item/:itemId',
        name: 'Item',
        component: Item,
    },
    {
        path: '/qna/:id/add',
        name: 'AddQna',
        component: AddQna,
    },
    {
        path: '/qna/:id/add/:questionId',
        name: 'UpdateQna',
        component: AddQna,
    },
    {
        path: '/review/:id/add/',
        name: 'AddReview',
        component: AddReview,
    },
    {
        path: '/review/:id/add/:reviewId',
        name: 'UpdateReview',
        component: AddReview,
    },

    {
        path: '/itemDetail/:id',
        name: 'ItemDetail2',
        component: Item,
    },

    {
        path: '/findId',
        name: 'FindId',
        component: FindId,
    },

    {
        path: '/findPw',
        name: 'FindPw',
        component: FindPw,
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
    },
    {
        path: '/complete',
        name: 'OrderComplete',
        component: OrderComplete,
    },

    {
        path: '/cscenter',
        name: 'CSCenter',
        component: CSCenter,
    },
    {
        path: '/faq/add',
        name: 'AddFaq',
        component: AddFaq,
    },
    {
        path: '/faq/update/:faqId',
        name: 'UpdateFaq',
        component: AddFaq,
    },

    {
        path: '/mypage/:id',
        name: 'MyPage',
        component: MyPage,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();

            if (!authStore.isAuthenticated) {
                // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
                next('/login');
            } else if (to.params.id !== authStore.userId) {
                // URL의 ID와 로그인된 사용자의 ID가 다를 경우 수정
                next(`/mypage/${authStore.userId}`);
            } else {
                next(); // 정상적으로 MyPage로 이동
            }
        },
    },
    {
        path: '/orderdetail/:orderId',
        name: 'OrderDetail',
        component: OrderDetail,
        props: true, // ✅ params를 props로 자동 전달
    },
    {
        path: '/orderList',
        name: 'OrderList',
        component: OrderList,
    },
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

    next();
});

export default router;
