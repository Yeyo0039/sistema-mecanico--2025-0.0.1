<script setup lang="ts">
import { reactive } from 'vue'

import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseCard from '../ui/BaseCard.vue'
import BaseSelect from '../ui/BaseSelect.vue'

import FORM_VARIANTS from '@/composables/userFormVariants'
import { validateUser } from '@/composables/validations/user.Validations'
import { registerUser } from '@/services/UserServices'

// Props
const props = defineProps<{
  variant?: 'create' | 'edit' | 'view' | 'admin'
}>()

// Configuración del formulario
const formConfig = FORM_VARIANTS[props.variant ?? 'create']

// Datos del formulario
const formData = reactive({
  nombre: '',
  apellido: '',
  correo: '',
  documento: '',
  usuario: '',
  password: '',
  confirmarPassword: '',
  rol: '',
})

// Errores
const errors = reactive({
  nombre: '',
  apellido: '',
  correo: '',
  documento: '',
  usuario: '',
  password: '',
  confirmarPassword: '',
})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

function clearForm() {
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = ''
  })
}

async function submitForm() {
  clearErrors()

  const validationErrors = validateUser(formData)

  Object.assign(errors, validationErrors)

  if (Object.keys(validationErrors).length > 0) {
    return
  }

  try {
    const response = await registerUser({
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      documento: formData.documento,
      usuario: formData.usuario,
      password: formData.password,
    })

    console.log('Usuario creado', response)

    clearForm()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <BaseCard :title="formConfig.title">
    <form @submit.prevent="submitForm">
      <BaseInput
        v-model="formData.nombre"
        label="Nombre"
        placeholder="Ingrese su nombre"
        type="text"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.nombre"
      />

      <BaseInput
        v-model="formData.apellido"
        label="Apellido"
        placeholder="Ingrese su apellido"
        type="text"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.apellido"
      />

      <BaseInput
        v-model="formData.correo"
        label="Correo"
        placeholder="Ingrese su correo"
        type="email"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.correo"
      />

      <BaseInput
        v-model="formData.documento"
        label="Documento"
        placeholder="Ingrese su documento"
        type="text"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.documento"
      />

      <BaseInput
        v-model="formData.usuario"
        label="Usuario"
        placeholder="Ingrese su usuario"
        type="text"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.usuario"
      />

      <BaseSelect
        v-if="formConfig.showRole"
        v-model="formData.rol"
        :id="formData.nombre"
        ,
        label="Rol"
        :options="['Admin', 'Usuario', 'Mecanico']"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
      />

      <BaseInput
        v-if="formConfig.showPassword"
        v-model="formData.password"
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        type="password"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.password"
      />

      <BaseInput
        v-if="formConfig.showPassword"
        v-model="formData.confirmarPassword"
        label="Confirmar contraseña"
        placeholder="Confirme su contraseña"
        type="password"
        :readonly="formConfig.readOnly"
        :disabled="formConfig.disabled"
        :error="errors.confirmarPassword"
      />

      <BaseButton v-if="formConfig.buttonText" type="submit" :text="formConfig.buttonText" />
    </form>
  </BaseCard>
</template>
