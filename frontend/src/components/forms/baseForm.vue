<script setup lang="ts">
import BaseSection from './baseSection.vue'
import type { FormSection } from '@/types/forms.ts'

defineProps<{
  schema: FormSection[]

  model: any
}>()
</script>

<template>
  <div class="base-form">
    <BaseSection v-for="section in schema" :key="section.title" :section="section" :model="model" />
  </div>
</template>

<style scoped>
.base-form {
  display: flex;

  flex-direction: column;

  gap: 35px;
}
</style>
