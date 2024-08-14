import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Login from '../views/Login.vue';
import ShoppingCart from '../views/ShoppingCart.vue';
import ComparisonList from '../views/ComparisonList.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/login', component: Login },
  { 
    path: '/cart', 
    component: ShoppingCart,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next({ path: '/login', query: { redirect: to.fullPath } });
      }
    }
  },
  {
    path: '/comparison',
    component: ComparisonList,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next({ path: '/login', query: { redirect: to.fullPath } });
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
