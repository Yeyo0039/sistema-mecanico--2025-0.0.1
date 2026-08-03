<script setup lang="ts">
import type { FormField } from '@/types/forms'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseImageLoader from '@/components/ui/BaseImageLoader.vue'

const props = defineProps<{
  field: FormField
  modelValue: any
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()
</script>

<!--
  BaseField recibe el campo del schema, su valor actual y el objeto errors.
  El mensaje específico de error se extrae con props.errors?.[props.field.name]
  para que cada input muestre su propio feedback visual.
-->

<template>
  <div class="base-field" :class="`field-${props.field.name}`" :id="`field-${props.field.name}`">
    <!-- INPUTS GENERICOS -->

    <BaseInput
      v-if="
        props.field.type === 'text' ||
        props.field.type === 'number' ||
        props.field.type === 'email' ||
        props.field.type === 'password' ||
        props.field.type === 'textarea' ||
        props.field.type === 'date'
      "
      :id="props.field.name"
      :label="props.field.label"
      :type="props.field.type"
      :placeholder="props.field.placeholder"
      :required="props.field.required"
      :disabled="props.field.disabled"
      :readonly="props.field.readonly"
      :modelValue="props.modelValue"
      :error="props.errors?.[props.field.name] ?? ''"
      @update:modelValue="emit('update:modelValue', $event)"
    />

    <!-- SELECT -->

    <BaseSelect
      v-else-if="props.field.type === 'select' || props.field.type === 'checkbox'"
      :id="props.field.name"
      :type="props.field.type"
      :label="props.field.label"
      :options="props.field.options ?? []"
      :modelValue="props.modelValue"
      :required="props.field.required"
      :disabled="props.field.disabled"
      :readonly="props.field.readonly"
      :error="props.errors?.[props.field.name] ?? ''"
      @update:modelValue="emit('update:modelValue', $event)"
    />
    <!-- IMAGE -->

    <BaseImageLoader
      v-else-if="props.field.type === 'file'"
      :id="props.field.name"
      :label="props.field.label"
      :required="props.field.required"
      :disabled="props.field.disabled"
      :readonly="props.field.readonly"
      :modelValue="props.modelValue"
      :error="props.errors?.[props.field.name] ?? ''"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>
