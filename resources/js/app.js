/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

// Adding moment
import moment from 'moment';

// Adding sweetAlert
import swal from 'sweetalert2';
window.swal = swal;

const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

window.Toast = Toast;

// Adding vform
import { Form, HasError, AlertError } from 'vform';
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
window.Form = Form;

// Adding vue router
import VueRouter from 'vue-router';
import { Verify, createDecipher } from 'crypto';
Vue.use(VueRouter);

// Vue progressbar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color:'rgb(143,255,199)',
    failedColor: 'red',
    height: '3px'
});

// Vue routes
let routes = [
    {path: '/dashboard', component: require('./components/Dashboard.vue').default},
    {path: '/profile', component: require('./components/Profile.vue').default},
    {path: '/users', component: require('./components/Users.vue').default},
]

const router = new VueRouter({
    mode: 'history',
    routes // short for 'routes': 'route'
})

// Vue filters
Vue.filter('upText', function(text) {
    return text.toUpperCase();
});

Vue.filter('date', function(date) {
    return moment(date).format('L');
});

window.Fire = new Vue();

// Tells vue what the user id is
Vue.prototype.$userId = document.querySelector("meta[name='user-id']").getAttribute('content');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
});