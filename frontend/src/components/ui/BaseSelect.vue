<script setup lang="ts">
const props = defineProps<{
  label: string
  options: string[]
  modelValue: string

  readonly?: boolean
  disabled?: boolean
  required?: boolean

  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleChange(event: Event) {
  if (props.readonly) return

  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="select-group">
    <label class="select-label">
      {{ props.label }}
    </label>

    <select
      class="select"
      :class="{ 'select-error': props.error }"
      :value="props.modelValue"
      :disabled="props.disabled"
      :required="props.required"
      @change="handleChange"
    >
      <option disabled value="">Seleccione una opción</option>

      <option v-for="option in props.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <span v-if="props.error" class="error-text">
      {{ props.error }}
    </span>
  </div>
</template>

<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.select-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.select {
  width: 100%;
  padding: 0.75rem 1rem;

  background: var(--color-surface-light);
  color: var(--color-text);

  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);

  outline: none;
  transition: 0.2s;
}

.select:focus {
  border-color: var(--color-primary);
}

.select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
}
</style>
