<script setup>

import { useRoute } from 'vue-router';

import AppLayout from './shared/presentation/app.layout.vue';

const route = useRoute();

</script>

<template>

  <template v-if="route.meta.layout === 'auth'">

    <router-view />

  </template>

  <template v-else>

    <app-layout />

  </template>

</template>