<script setup lang="ts">
import type { FormField } from '@/types/forms'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps<{
  field: FormField
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
</script>

<template>
  <BaseInput
    v-if="field.type !== 'select'"
    :label="field.label"
    :type="field.type"
    :placeholder="field.placeholder"
    :required="field.required"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  />

  <BaseSelect
    v-else
    :label="field.label"
    :options="field.options ?? []"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
