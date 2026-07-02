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
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
