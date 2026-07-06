<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string
    type?: 'button' | 'submit' | 'reset'

    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'

    icon?: string

    loading?: boolean
    disabled?: boolean

    fullWidth?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    :type="props.type"
    class="button"
    :class="[
      `button--${props.variant}`,
      `button--${props.size}`,
      {
        'button--full': props.fullWidth,
        'button--loading': props.loading,
      },
    ]"
    :disabled="props.disabled || props.loading"
    @click="emit('click')"
  >
    <span v-if="props.icon" class="material-symbols-rounded button-icon">
      {{ props.icon }}
    </span>

    <span v-if="props.text">
      {{ props.text }}
    </span>

    <span v-if="props.loading" class="spinner" />
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  border: none;
  border-radius: 10px;

  cursor: pointer;

  transition: 0.25s;

  font-weight: 600;

  user-select: none;
}

/*=========================
    Width
=========================*/

.button--full {
  width: 100%;
}

/*=========================
      Sizes
=========================*/

.button--sm {
  padding: 0.55rem 0.9rem;
  font-size: 0.85rem;
}

.button--md {
  padding: 0.75rem 1.2rem;
  font-size: 0.95rem;
}

.button--lg {
  padding: 0.95rem 1.5rem;
  font-size: 1rem;
}

/*=========================
      Variants
=========================*/

.button--primary {
  background: var(--color-primary);
  color: white;
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button--secondary {
  background: var(--color-surface-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.button--secondary:hover {
  border-color: var(--color-primary);
}

.button--danger {
  background: #dc2626;
  color: white;
}

.button--danger:hover {
  background: #b91c1c;
}

.button--ghost {
  background: transparent;
  color: var(--color-text);
}

.button--ghost:hover {
  background: rgba(255, 255, 255, 0.06);
}

/*=========================
      Icon
=========================*/

.button-icon {
  font-size: 20px;
}

/*=========================
      Disabled
=========================*/

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/*=========================
      Loading
=========================*/

.spinner {
  width: 16px;
  height: 16px;

  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top: 2px solid white;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
