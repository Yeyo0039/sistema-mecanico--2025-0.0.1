<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  {{ props.title }}
  <div>
    <slot> </slot>
  </div>
</template>
