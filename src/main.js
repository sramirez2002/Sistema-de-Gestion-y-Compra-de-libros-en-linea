import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueAxios from 'vue-axios'
import Axios from 'axios'
import VCreditCard from 'v-credit-card'
import './plugins/google-maps';

Vue.component('v-credit-card', VCreditCard);
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, Axios)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/Estilos/global.css';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
