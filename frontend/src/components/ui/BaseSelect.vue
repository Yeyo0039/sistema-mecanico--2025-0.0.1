<script setup lang="ts">
const props = defineProps<{
  label: string
  options: string[]
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
    <select
      :value="props.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in props.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>
