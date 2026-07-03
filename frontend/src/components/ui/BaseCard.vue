<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      {{ props.title }}
    </div>
    <div class="card-body">
      <slot> </slot>
    </div>
  </div>
</template>
<style scoped>
.card {
  width: 100%;
  max-width: 420px;

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}
.card-header {
  font-size: 1.4rem;
  font-weight: 600;
  align-content: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  border-bottom: 1px solid var(--color-border);
}
.card-body {
  display: flex;
  flex-direction: column;
  align-content: center;
}
</style>
