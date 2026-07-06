<script setup lang="ts"></script>

<template>
  <section class="dashboard-grid">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

  gap: 1.5rem;

  width: 100%;
}
</style>
