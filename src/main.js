import Vue from 'vue';
//import Vuex from 'vuex';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import routes from './routes';
//import store from './store';

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history'
})

// Vue.use(Vuex);
// const store = new Vuex.Store({
//     store
// })

new Vue({
    vuetify: vuetify,
    router: router,
    //store: store,
    render: h => h(App),
}).$mount('#app')