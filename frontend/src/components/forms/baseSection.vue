<script setup lang="ts">
import BaseField from './baseField.vue'
import type { FormSection } from '@/types/forms'

defineProps<{
  section: FormSection

  model: any
}>()
</script>

<template>
  <div class="section">
    <h3>
      {{ section.title }}
    </h3>

    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${section.columns ?? 2},1fr)`,
      }"
    >
      <BaseField
        v-for="field in section.fields"
        :key="field.name"
        :field="field"
        v-model="model[field.name]"
      />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;

  flex-direction: column;

  gap: 20px;
}

.grid {
  display: grid;

  gap: 20px;
}
</style>
