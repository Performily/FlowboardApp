import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import router from './routes';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import i18n from './i18n.js';

import {
    Button,
    Card,
    DataTable,
    Column,
    Select,
    DatePicker,
    Dialog,
    InputText,
    Tag,
    Textarea,
    Password,
    Checkbox,
    Message,
    SelectButton
} from 'primevue';

const BluePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef2f6',
            100: '#d9e2ec',
            200: '#b6c8d9',
            300: '#8ba6c1',
            400: '#5c7fa6',
            500: '#3F51B5',
            600: '#32408f',
            700: '#25306b',
            800: '#1a224d',
            900: '#101430',
            950: '#080a18'
        }
    }
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: BluePreset,
        options: {
            darkModeSelector: '.app-dark-mode-off'
        }
    }
});
app.use(i18n);

app.component('pv-dialog',      Dialog);
app.component('pv-button',      Button);
app.component('pv-card',        Card);
app.component('pv-data-table',  DataTable);
app.component('pv-column',      Column);
app.component('pv-select',      Select);
app.component('pv-date-picker', DatePicker);
app.component('pv-input-text',  InputText);
app.component('pv-tag',         Tag);
app.component('pv-textarea',    Textarea);
app.component('pv-password', Password);
app.component('pv-checkbox', Checkbox);
app.component('pv-message',     Message);
app.component('pv-select-button', SelectButton)

// Error handler global para capturar errores no controlados
app.config.errorHandler = (err, instance, info) => {
    console.error('Error global:', err, info);
};

// Handler para promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no capturada:', event.reason);
    // Prevenir que el navegador maneje el error por defecto
    event.preventDefault();
});

app.mount('#app');