<script setup lang="ts">
import Auth from '@/components/forms/Auth.vue'
</script>

<template>
  <main class="login-page">
    <Auth />
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
