<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="dashboard-header">
    <div>
      <h1>{{ title }}</h1>
      <p v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.5rem 2rem;

  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

h1 {
  margin: 0;
}

p {
  margin-top: 0.4rem;
  color: var(--color-text-secondary);
}
</style>
