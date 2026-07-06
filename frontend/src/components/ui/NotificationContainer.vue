<script setup lang="ts">
import BaseNotification from './BaseNotification.vue'

import { useNotification } from '@/composables/useNotification'

const {
  notifications,

  remove,
} = useNotification()
</script>

<template>
  <div class="container">
    <BaseNotification
      v-for="item in notifications"
      :key="item.id"
      :notification="item"
      @close="remove(item.id)"
    />
  </div>
</template>

<style scoped>
.container {
  position: fixed;

  top: 25px;

  right: 25px;

  display: flex;

  flex-direction: column;

  gap: 15px;

  z-index: 99999;
}
</style>
