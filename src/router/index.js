import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './hooks'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: 'welcome',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/Users.vue')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import(/* webpackChunkName: "rights_roles" */ '../views/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "rights_roles" */ '../views/power/Roles.vue')
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import(/* webpackChunkName: "categories_params_goods_add" */ '../views/good/Categories.vue')
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import(/* webpackChunkName: "categories_params_goods_add" */ '../views/good/Params.vue')
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import(/* webpackChunkName: "categories_params_goods_add" */ '../views/good/Goods.vue')
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: () => import(/* webpackChunkName: "categories_params_goods_add" */ '../views/good/Add.vue')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName: "orders" */ '../views/orders/Orders.vue')
      },
      {
        path: '/edit/:id',
        name: 'Edit',
        component: () => import(/* webpackChunkName: "categories_params_goods_add" */ '../views/good/Edit.vue')
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import(/* webpackChunkName: "reports" */ '../views/report/Report.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
Object.values(hooks).forEach(hook => {
  router.beforeEach(hook.bind(router))
})
export default router
