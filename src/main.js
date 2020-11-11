import Vue from 'vue'
import App from './App.vue'
// import Vue2TouchEvents from 'vue2-touch-events'
import Vuebar from 'vuebar'
import './registerServiceWorker'
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

Vue.use(Vuebar)
// Vue.use(Vue2TouchEvents)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
