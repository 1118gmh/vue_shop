export default {
  loginGuard: (to, from, next) => {
    console.log(to)
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
