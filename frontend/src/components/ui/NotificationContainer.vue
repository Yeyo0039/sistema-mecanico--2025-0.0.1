<script setup lang="ts">
import BaseNotification from './BaseNotification.vue'

import { useNotification } from '@/composables/useNotification'

const {
  notifications,

  remove,
} = useNotification()
</script>

<template>
  <transition-group name="notification" tag="div" class="container">
    <BaseNotification
      v-for="item in notifications"
      :key="item.id"
      :notification="item"
      @close="remove(item.id)"
    />
  </transition-group>
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

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}

.notification-enter-to,
.notification-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 240ms ease;
}
</style>
