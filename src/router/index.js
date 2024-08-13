import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Login from '../views/Login.vue';
import ShoppingCart from '../views/ShoppingCart.vue';

/**
 * @typedef {Object} Route
 * @property {string} path - The path of the route.
 * @property {Object} component - The component to be rendered for the route.
 * @property {string} [name] - The name of the route.
 * @property {boolean} [props] - Whether the route accepts props.
 */

/**
 * @type {Route[]}
 */
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
