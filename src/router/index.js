import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Checkout from '@/pages/Checkout.vue';
import Address from '@/pages/Address.vue';
import AddAddress from '@/pages/AddAddress.vue';
import UpdateAddress from '@/pages/UpdateAddress.vue';
import CSCenter from '@/pages/CSCenter.vue';
import AddFaq from '@/pages/AddFaq.vue';
import ItemList from '@/pages/ItemList.vue';
import Item from '@/pages/Item.vue';
import AddQna from '@/pages/AddQna.vue';
import AddReview from '@/pages/AddReview.vue';
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
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
  },
  {
    path: '/address/:userNo',
    name: 'Address',
    component: Address,
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
    path: '/faq/add/:faqId',
    name: 'UpdateFaq',
    component: AddFaq,
  },
  {
    path: '/itemlist',
    name: 'ItemList',
    component: ItemList,
  },
  {
    path: '/item/:itemId',
    name: 'Item',
    component: Item,
  },
  {
    path: '/qna/:itemId/add',
    name: 'AddQna',
    component: AddQna,
  },
  {
    path: '/qna/:itemId/add/:questionId',
    name: 'UpdateQna',
    component: AddQna,
  },
  {
    path: '/review/:itemId/add/',
    name: 'AddReview',
    component: AddReview,
  },
  {
    path: '/review/:itemId/add/:reviewId',
    name: 'UpdateReview',
    component: AddReview,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
