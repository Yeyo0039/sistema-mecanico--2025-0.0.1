<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseCard from '../ui/BaseCard.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

import { loginUser } from '@/services/UserServices'

const router = useRouter()

const usuario = ref('')
const password = ref('')

const error = ref('')

async function login() {
  error.value = ''

  if (!usuario.value || !password.value) {
    error.value = 'Debe completar todos los campos'
    return
  }

  try {
    const response = await loginUser(usuario.value, password.value)

    console.log(response)

    localStorage.setItem('token', response.token)
    localStorage.setItem('usuario', JSON.stringify(response.usuario))

    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error inesperado'
  }
}
</script>

<template>
  <BaseCard title="Iniciar Sesión">
    <form @submit.prevent="login">
      <BaseInput
        v-model="usuario"
        label="Usuario"
        placeholder="Ingrese su usuario"
        type="text"
        :error="error"
      />

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
