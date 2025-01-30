import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Checkout from '@/pages/Checkout.vue';
import Address from '@/pages/Address.vue';
import AddAddress from '@/pages/AddAddress.vue';
import UpdateAddress from '@/pages/UpdateAddress.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  ],
});

export default router;
