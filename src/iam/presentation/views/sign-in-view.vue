<script setup>
import SignInForm from "../components/sign-in-form.vue";
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-white relative font-inter">

    <div class="w-full flex flex-column align-items-center" style="max-width: 450px; padding: 2rem;">

      <div class="flex align-items-center justify-content-center gap-3 mb-6">
        <h1 class="text-6xl font-bold m-0" style="color: #4B59B6;">
          Performily
        </h1>
      </div>

      <div class="w-full">
        <sign-in-form />
      </div>

    </div>

    <div class="fixed bottom-0 right-0 m-4 flex align-items-center gap-2">
      <span class="font-medium text-xl" style="color: #4A4A4B !important;">Flowboard</span>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>