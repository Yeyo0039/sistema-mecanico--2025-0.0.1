<script setup lang="ts">
const props = defineProps<{
  label: string
  placeholder?: string
  type?: string
  modelValue: string

  readonly?: boolean
  disabled?: boolean
  required?: boolean
  variant?: 'default' | 'search'
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
// imput base general
<template>
  <div class="input-group">
    <label class="input-label">
      {{ props.label }}
    </label>

    <input
      class="input"
      :class="{ 'input-error': props.error, 'input-search': props.variant === 'search' }"
      :type="props.type ?? 'text'"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :required="props.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="props.error" class="error-text">
      {{ props.error }}
    </span>
  </div>
</template>

<style scoped>
.input-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}
.input:read-only {
  background: var(--color-surface);
  cursor: default;
}
.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.input-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
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
.input-search {
  padding: 1rem 1.5rem;

  border-radius: 999px;

  font-size: 1rem;
}
.input:focus {
  border-color: var(--color-primary);
}
</style>
