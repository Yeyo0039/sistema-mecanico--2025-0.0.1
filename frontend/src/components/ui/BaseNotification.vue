<script setup lang="ts">
import type { Notification } from '@/types/notification'

defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="notification" :class="notification.type">
    <div class="progress-track" v-if="notification.duration !== 0">
      <div
        class="progress-bar"
        :style="{ animationDuration: `${notification.duration ?? 4000}ms` }"
      />
    </div>

    <div class="header">
      <strong>
        {{ notification.title }}
      </strong>

      <button v-if="notification.closable !== false" @click="emit('close')">✕</button>
    </div>

    <p>
      {{ notification.message }}
    </p>

    <small v-if="notification.footer">
      {{ notification.footer }}
    </small>
  </div>
</template>

<style scoped>
.notification {
  width: 350px;

  padding: 18px;

  border-radius: 12px;

  color: white;

  backdrop-filter: blur(18px);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.progress-track {
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: #064e3b;
  animation: countdown linear forwards;
}

@keyframes countdown {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.notification {
  position: relative;
}

.notification.success {
  background: #15803d;
}

.notification.error {
  background: #dc2626;
}

.notification.warning {
  background: #ca8a04;
}

.notification.info {
  background: #2563eb;
}

.header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 12px;
}

button {
  border: none;

  background: none;

  color: white;

  cursor: pointer;

  font-size: 18px;
}

p {
  margin: 0;
}

small {
  display: block;

  margin-top: 10px;

  opacity: 0.8;
}

.notification.success {
  background: #15803d;
}

.notification.error {
  background: #dc2626;
}

.notification.warning {
  background: #ca8a04;
}

.notification.info {
  background: #2563eb;
}

.header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 12px;
}

button {
  border: none;

  background: none;

  color: white;

  cursor: pointer;

  font-size: 18px;
}

p {
  margin: 0;
}

small {
  display: block;

  margin-top: 10px;

  opacity: 0.8;
}
</style>
