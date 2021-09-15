export default {
  loginGuard: (to, from, next) => {
    if (to.path === '/login') {
      return next()
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
      return next('/login')
    }
    next()
  }
}
