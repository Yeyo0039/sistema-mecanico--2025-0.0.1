<script setup lang="ts">
import { computed, onMounted } from 'vue'

import type { SelectDatabaseOption, SelectOption } from '@/types/forms'
import { loadSelectOptions } from '../forms/schemas/LoadSelects'

const props = defineProps<{
  id: string
  label: string

  /*
  --------------------------------------------------------
  SOPORTA LOS DOS FORMATOS
  --------------------------------------------------------

  ['Admin', 'Usuario']

  ó

  [
    {
      value: 1,
      label: 'Honda',
    }
  ]

  */

  options: (string | SelectOption | SelectDatabaseOption)[]
  modelValue?: string | number | null

  readonly?: boolean
  disabled?: boolean
  required?: boolean

  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

/*
--------------------------------------------------------
NORMALIZA LAS OPCIONES
--------------------------------------------------------

Convierte automáticamente los string en:

{
    value: string
    label: string
}

*/
const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((option) => {
    // STRING
    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
      }
    }

    // OBJETOS DE LA BASE DE DATOS
    if ('id' in option && 'nombre' in option) {
      return {
        value: option.id,
        label: option.nombre,
      }
    }

    // OBJETOS YA NORMALIZADOS
    if ('value' in option && 'label' in option) {
      return option
    }

    // FALLBACK
    return {
      value: '',
      label: 'Opción inválida',
    }
  })
})
/*
--------------------------------------------------------
HANDLE CHANGE
--------------------------------------------------------
*/

function handleChange(event: Event) {
  if (props.readonly === true) return

  const value = (event.target as HTMLSelectElement).value

  emit('update:modelValue', value || null)
}
onMounted(loadSelectOptions(props.id))
</script>

<template>
  <div class="select-group">
    <label class="select-label">
      {{ props.label }}
    </label>

    <select
      class="select"
      :id="props.id"
      :class="{ 'select-error': props.error }"
      :value="props.modelValue ?? ''"
      :disabled="props.disabled"
      :required="props.required"
      @change="handleChange"
    >
      <option disabled value="">Seleccione una opción</option>

      <option v-for="option in normalizedOptions" :key="option.value" :value="option.value">
        {{ option.label }}
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
