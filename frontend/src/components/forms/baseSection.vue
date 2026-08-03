<script setup lang="ts">
import BaseField from './baseField.vue'
import type { FormSection } from '@/types/forms'

defineProps<{
  section: FormSection
  model: any
  errors?: Record<string, string>
}>()
</script>

<!--
  BaseSection recibe una sección del schema y el modelo actual.
  Además de propagar los errores para que cada campo pueda mostrar
  su mensaje específico y aplicar el estilo de error.
-->

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
        :errors="errors"
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
