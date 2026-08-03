<script setup lang="ts">
import BaseSection from './baseSection.vue'
import type { FormSection } from '@/types/forms.ts'

defineProps<{
  schema: FormSection[]
  model: any
  errors?: Record<string, string>
}>()
</script>

<template>
  <div class="base-form">
    <!--
      BaseForm es el contenedor principal del formulario.
      Recibe schema, modelo y errores, y los propaga a cada sección.
    -->
    <BaseSection
      v-for="section in schema"
      :key="section.title"
      :section="section"
      :model="model"
      :errors="errors"
    />
  </div>
</template>

<style scoped>
.base-form {
  display: flex;

  flex-direction: column;

  gap: 35px;
}
</style>
