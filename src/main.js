import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from './router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import '/Users/jmj/NineScent-Frontend/src/config/icons.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faCartShopping);

const app = createApp(App);

app.use(createPinia());

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);

app.mount('#app');
