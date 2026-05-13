import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import router from './routes';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; 
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';


import { 
    Button, 
    Card, 
    DataTable, 
    Column, 
    Select, 
    InputText, 
    Tag 
} from 'primevue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });

app.component('pv-button', Button);
app.component('pv-card', Card);
app.component('pv-data-table', DataTable);
app.component('pv-column', Column);
app.component('pv-select', Select);
app.component('pv-input-text', InputText);
app.component('pv-tag', Tag);

app.mount('#app');