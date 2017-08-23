// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import routes from './routes'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// mock
// import Mock from './mock'
// Mock.bootstrap();

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueLazyload, {
  preload: 1.3,
  error: '',
  loading: '',
  attempt: 1
})
Vue.use(VueAwesomeSwiper)
// 过滤器

Vue.filter('currencyFilter', function (val) {
  return (val + '').split("").reverse().join("").replace(/(\d{3})(?=[^$])/g, "$1,").split("").reverse().join("");
})
Vue.filter('spaceReplace', function (str) {
  return (str + '').replace(/\n/g,"\n")
})

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  let routes = router.options.routes
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
