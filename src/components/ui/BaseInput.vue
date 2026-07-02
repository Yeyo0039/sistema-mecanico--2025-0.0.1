<script setup lang="ts">
const props = defineProps<{
  label: string
  placeholder: string
  type: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div>
    <label>
      {{ props.label }}
    </label>

    <input
      class="input"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: colum;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.input-label {
  font-size: 0.9rem;
  color: var (--color-text-secondary);
  font-weight: 500;
}
.input {
  width: 100%;
  padding: 0.75rem 1rem;

  background: var(--color-surface-light);
  color: var(--color-text);

  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);

  outline: none;

  transition: 0.2s;
}
.input::placeholder {
  color: var(--color-text-secondary);
}
.input:focus {
  border-color: var(--color-primary);
}
</style>
