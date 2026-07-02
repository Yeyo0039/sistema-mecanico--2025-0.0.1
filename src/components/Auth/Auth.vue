<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '../ui/BaseCard.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
const usuario = ref('')
const password = ref('')

function loguin() {}
</script>
<template>
  <BaseCard title="Iniciar Sesion">
    <BaseInput v-model="usuario" label="usuario" placeholder="Ingrese su usuario" type="text" />
    <BaseInput
      v-model="password"
      label="Contraseña"
      placeholder="Ingrese su contraseña"
      type="password"
    />
    <BaseButton text="Iniciar Sesión" type="submit" />
  </BaseCard>
</template>
