<script setup lang="ts">
const props = defineProps<{
  text: string
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button class="button" :type="props.type ?? 'button'">
    {{ props.text }}
  </button>
</template>

<style scoped>
.button {
  width: 100%;
  padding: 0.85rem;

  border: none;
  border-radius: var(--radius-sm);

  background: var(--color-primary);
  color: white;

  font-size: 0.95rem;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.button:hover {
  background: var(--color-primary-hover);
}

.button:active {
  transform: scale(0.98);
}
</style>
