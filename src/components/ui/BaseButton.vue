<script setup lang="ts">
const props = defineProps<{
  text: string
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button :tyupe="props.type ?? 'button'">
    {{ props.text }}
  </button>
</template>
