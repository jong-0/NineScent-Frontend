import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import ItemDetail from '@/pages/Item/ItemDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/items/:id',
      name: 'ItemDetail',
      component: ItemDetail,
    },
  ],
});

export default router;
