<script setup lang="ts">
import UserForm from '@/components/forms/userForm.vue'
</script>

<template>
  <dashboard-header title="Registro de Usuario" />

  <dashboard-body>
    <UserForm variant="create" />
  </dashboard-body>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
