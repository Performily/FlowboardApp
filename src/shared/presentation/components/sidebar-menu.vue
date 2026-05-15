<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const menuItems = computed(() => [
  { label: t('sidebar.home'), icon: 'pi pi-home', routeName: 'home' },
  { label: t('sidebar.workInfo'), icon: 'pi pi-id-card', routeName: 'info' },
  { label: t('sidebar.requests'), icon: 'pi pi-file-edit', routeName: 'requests' },
  { label: t('sidebar.attendance'), icon: 'pi pi-calendar-times', routeName: 'attendance' },
  { label: t('sidebar.management'), icon: 'pi pi-chart-line', routeName: 'management' },
  { label: t('sidebar.payments'), icon: 'pi pi-credit-card', routeName: 'payroll' }
]);

const navigate = (routeName) => {
  if (router.hasRoute(routeName)) {
    router.push({ name: routeName });
  } else {
    console.warn(`Ruta ${routeName} no definida aún.`);
  }
};

const isActive = (routeName) => route.name === routeName;
</script>

<template>
  <div class="flex flex-column h-full bg-white border-right-1 surface-border w-16rem">
    
    <div class="flex align-items-center justify-content-center py-4 border-bottom-1 surface-border mb-4">
      <h2 class="text-primary font-bold text-2xl m-0">Performily</h2>
    </div>

    <ul class="list-none p-0 m-0 flex flex-column gap-2 px-3">
      <li 
        v-for="item in menuItems" 
        :key="item.label"
        @click="navigate(item.routeName)"
        class="flex align-items-center gap-3 p-3 border-round cursor-pointer transition-colors transition-duration-150"
        :class="isActive(item.routeName) ? 'bg-primary-50 text-primary font-semibold' : 'text-700 hover:surface-100'"
      >
        <i :class="[item.icon, 'text-xl']"></i>
        <span>{{ item.label }}</span>
      </li>
    </ul>

  </div>
</template>