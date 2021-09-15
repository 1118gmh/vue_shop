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
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: 'welcome',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () =>
          import(/* webpackChunkName: "welcome" */ '../views/Welcome.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () =>
          import(/* webpackChunkName: "user" */ '../views/user/Users.vue')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/power/Roles.vue')
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
