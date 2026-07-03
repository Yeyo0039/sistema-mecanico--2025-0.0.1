<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '../ui/BaseCard.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
const usuario = ref('')
const password = ref('')

function login() {
  console.log(usuario.value)
  console.log(password.value)
  if (!usuario.value && !password.value) {
    console.log('error')
    return
  }
}
</script>
<template>
  <BaseCard title="Iniciar Sesión">
    <form title="Iniciar Sesion" @submit.prevent="login">
      <BaseInput v-model="usuario" label="Usuario" placeholder="Ingrese su usuario" type="text" />
      <BaseInput
        v-model="password"
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        type="password"
      />
      <BaseButton text="Iniciar Sesión" type="submit" />
    </form>
  </BaseCard>
</template>
