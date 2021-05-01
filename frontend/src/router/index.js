import Vue from 'vue'
import VueRouter from 'vue-router'
import Graphics from '../views/Graphics.vue'
import Orders from '../views/Orders.vue'
import Import from '../views/Import.vue'
import Users from '../views/Users.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

Vue.use(VueRouter)

const routes = [
  {
    path: '/import',
    name: 'import',
    component: Import
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders
  },
  {
    path: '/graphics',
    name: 'graphics',
    component: Graphics
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  },
  { 
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
