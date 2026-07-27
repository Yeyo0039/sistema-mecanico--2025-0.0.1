<script setup lang="ts">
import type { FormField } from '@/types/forms'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseImageLoader from '@/components/ui/BaseImageLoader.vue'

const props = defineProps<{
  field: FormField
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()
</script>

<template>
  <div class="base-field" :class="`field-${field.name}`" :id="`field-${field.name}`">
    <!-- INPUTS GENERICOS -->

    <BaseInput
      v-if="
        field.type === 'text' ||
        field.type === 'number' ||
        field.type === 'email' ||
        field.type === 'password' ||
        field.type === 'textarea' ||
        field.type === 'date'
      "
      :id="field.name"
      :label="field.label"
      :type="field.type"
      :placeholder="field.placeholder"
      :required="field.required"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />

    <!-- SELECT -->

    <BaseSelect
      v-else-if="field.type === 'select'"
      :id="field.name"
      :label="field.label"
      :options="field.options ?? []"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
    <!-- IMAGE -->

    <BaseImageLoader
      v-else-if="field.type === 'file'"
      :id="field.name"
      :label="field.label"
      :required="field.required"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>
