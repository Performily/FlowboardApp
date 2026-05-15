<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { label: 'EN', value: 'en' },
  { label: 'ES', value: 'es' }
];

const currentLanguage = computed({
  get: () => locale.value,
  set: (value) => {
    if (value) {
      locale.value = value;
    }
  }
});
</script>

<template>
  <pv-select-button
      v-model="currentLanguage"
      :options="languages"
      optionLabel="label"
      optionValue="value"
      aria-labelledby="language-switcher"
  />
</template>