import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import VModal from 'vue-js-modal'
import VueRouter from 'vue-router'
import 'vue-material/dist/vue-material.min.css'
import ChessGame from './pages/ChessGame.vue'

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(VModal, {dialog: true})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: ChessGame }
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

