<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { SelectOptionSource, SelectOption } from '@/types/forms'
import { loadSelectOptions } from '../forms/schemas/LoadSelects'

/*
--------------------------------------------------------
STATE
--------------------------------------------------------
*/

const internalOptions = ref<SelectOption[]>([])

/*
--------------------------------------------------------
PROPS
--------------------------------------------------------
*/

const props = defineProps<{
  id: string
  label: string
  options?: unknown[]
  modelValue?: string | number | null | Array<string | number>
  type?: 'select' | 'checkbox'

  readonly?: boolean
  disabled?: boolean
  required?: boolean

  error?: string
}>()

/*
--------------------------------------------------------
EMITS
--------------------------------------------------------
*/

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | Array<string | number>): void
}>()

/*
--------------------------------------------------------
INITIALIZE SELECT
--------------------------------------------------------
*/

async function iniciarSelect() {
  const options = props.options ?? []

  // El padre envió opciones.
  if (options.length > 0) {
    internalOptions.value = normalizeOptions(options, props.type === 'checkbox')
    return
  }

  // Consultar el loader.
  const loadedOptions = await loadSelectOptions(props.id)

  internalOptions.value = normalizeOptions(loadedOptions, props.type === 'checkbox')
}
/*
--------------------------------------------------------
NORMALIZA LAS OPCIONES
--------------------------------------------------------
*/

function normalizeOptions(options: unknown[] = [], isCheckbox = false): SelectOption[] {
  // No es un array.
  if (!Array.isArray(options)) {
    return []
  }

  // Select vacío.
  if (options.length === 0) {
    return isCheckbox
      ? []
      : [
          {
            value: '',
            label: 'Sin opciones disponibles',
          },
        ]
  }

  return options.map((option): SelectOption => {
    /*
    ------------------------------------
    STRING
    ------------------------------------
    */

    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
      }
    }

    /*
    ------------------------------------
    VALIDAR OBJETO
    ------------------------------------
    */

    if (typeof option === 'object' && option !== null) {
      /*
      BASE DE DATOS
      */

      if ('id' in option && 'nombre' in option) {
        return {
          value: option.id as string | number,
          label: String(option.nombre),
        }
      }

      /*
      YA NORMALIZADO
      */

      if ('value' in option && 'label' in option) {
        return {
          value: option.value as string | number,
          label: String(option.label),
        }
      }
    }

    /*
    ------------------------------------
    FALLBACK
    ------------------------------------
    */

    return {
      value: '',
      label: 'Opción inválida',
    }
  })
}

/*
--------------------------------------------------------
HANDLE CHANGE
--------------------------------------------------------
*/

function handleChange(event: Event) {
  if (props.readonly) return

  const value = (event.target as HTMLSelectElement).value

  emit('update:modelValue', value || null)
}

function handleCheckboxChange(event: Event, optionValue: string | number) {
  if (props.readonly) return

  const checkbox = event.target as HTMLInputElement
  const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []

  if (checkbox.checked) {
    if (!currentValue.includes(optionValue)) {
      currentValue.push(optionValue)
    }
  } else {
    const index = currentValue.indexOf(optionValue)
    if (index >= 0) {
      currentValue.splice(index, 1)
    }
  }

  emit('update:modelValue', currentValue)
}

function optionIsChecked(value: string | number) {
  return Array.isArray(props.modelValue) && props.modelValue.includes(value)
}

/*
--------------------------------------------------------
LIFECYCLE
--------------------------------------------------------
*/

onMounted(iniciarSelect)
</script>
<template>
  <div class="select-group">
    <label class="select-label">
      {{ props.label }}
    </label>

    <div v-if="props.type === 'checkbox'" class="checkbox-group">
      <div v-if="internalOptions.length === 0" class="checkbox-empty">
        Sin opciones disponibles.
      </div>

      <label v-for="option in internalOptions" :key="option.value" class="checkbox-option">
        <input
          type="checkbox"
          :value="option.value"
          :checked="optionIsChecked(option.value)"
          :disabled="props.disabled || props.readonly"
          @change="(event) => handleCheckboxChange(event, option.value)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>

    <select
      v-else
      class="select"
      :id="props.id"
      :class="{ 'select-error': props.error }"
      :value="props.modelValue ?? ''"
      :disabled="props.disabled"
      :required="props.required"
      @change="handleChange"
    >
      <option value="">Seleccione una opción</option>

      <option v-for="option in internalOptions" :key="option.value" :value="option.value">
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

.checkbox-group {
  display: grid;
  gap: 0.75rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-light);
}

.checkbox-option input {
  width: 1rem;
  height: 1rem;
}

.checkbox-empty {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--color-border);
  background: var(--color-surface-light);
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
}
</style>
