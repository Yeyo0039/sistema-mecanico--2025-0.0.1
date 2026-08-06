<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { SelectOptionSource, SelectOption } from '@/types/forms'
import { loadSelectOptions } from '../forms/schemas/LoadSelects'
import BaseButton from './BaseButton.vue'
import type { AddSelectOptionPayload } from './BaseSelectHelpers'
import { normalizeOptions, buildAddOptionPayload } from './BaseSelectHelpers'

/*
--------------------------------------------------------
STATE
--------------------------------------------------------
*/

const internalOptions = ref<SelectOption[]>([])
const selectLogs = ref<Array<{ event: string; payload: unknown; timestamp: string }>>([])

/*
--------------------------------------------------------
PROPS
--------------------------------------------------------
*/

const props = defineProps<{
  id: string
  label: string
  options?: SelectOptionSource
  modelValue?: string | number | null | Array<string | number>
  type?: 'select' | 'checkbox'
  source?: string

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
  (e: 'add-option', payload: AddSelectOptionPayload): void
  (e: 'select-log', log: { event: string; payload: unknown; timestamp: string }): void
}>()

/*
--------------------------------------------------------
INITIALIZE SELECT
--------------------------------------------------------
*/

async function iniciarSelect() {
  const options = Array.isArray(props.options) ? props.options : []

  // El padre envió opciones.
  if (options.length > 0) {
    internalOptions.value = normalizeOptions(options, props.type === 'checkbox')
    return
  }

  // Consultar el loader.
  const loadedOptions = await loadSelectOptions(props.id)

  internalOptions.value = normalizeOptions(loadedOptions, props.type === 'checkbox')
  logEvent('init', {
    field: props.id,
    source: props.source ?? props.id,
    type: props.type ?? 'select',
    options: internalOptions.value,
  })
}

/*
--------------------------------------------------------
HANDLE CHANGE
--------------------------------------------------------
*/

function logEvent(event: string, payload: unknown) {
  const logEntry = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  }

  selectLogs.value.push(logEntry)
  emit('select-log', logEntry)
  console.log('BaseSelect log:', logEntry)
}

function handleChange(event: Event) {
  if (props.readonly) return

  const value = (event.target as HTMLSelectElement).value
  const normalizedValue = value || null

  emit('update:modelValue', normalizedValue)
  logEvent('update:modelValue', {
    value: normalizedValue,
    field: props.id,
    source: props.source ?? props.id,
  })
}

function agregarOpcion() {
  if (props.readonly || props.disabled) return

  const value = window.prompt('Nueva opción:')?.trim()
  if (!value) return

  const payload = buildAddOptionPayload(
    props.source ?? props.id,
    props.id,
    props.type ?? 'select',
    value,
  )

  internalOptions.value.push({ value, label: value })
  emit('update:modelValue', value)
  emit('add-option', payload)
  logEvent('add-option', payload)

  console.log('BaseSelect: opción agregada', payload)
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
  logEvent('update:modelValue', {
    value: currentValue,
    field: props.id,
    source: props.source ?? props.id,
    type: props.type ?? 'checkbox',
  })
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

    <div class="select-add-button">
      <BaseButton type="button" icon="add" text="Agregar" @click="agregarOpcion" />
    </div>
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
