import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
// components 
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/users/Main'
import QuickPlay from './pages/users/QuickPlay'

Vue.use(VueCookies)
Vue.use(VueRouter)
// set default config
Vue.$cookies.config('1d')

import auth from './auth'

// redirect to main if logged in, and to login if not logged in
function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
function isLoggedIn (to,from,next){
  if (auth.loggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/login', component: Login , beforeEnter: isLoggedIn},
    { path: '/signup', component: Signup },
    { path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout()
        next('/login')
      }
    },
    { path: '/', component: Main, beforeEnter: requireAuth },
    { path: '/quickPlay', component: QuickPlay, beforeEnter: requireAuth}
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
