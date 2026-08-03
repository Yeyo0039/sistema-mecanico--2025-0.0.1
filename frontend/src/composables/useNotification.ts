import { ref } from 'vue'
import type { Notification } from '@/types/notification'

const MAX_NOTIFICATIONS = 5
const notifications = ref<Notification[]>([])

function add(notification: Omit<Notification, 'id'>) {
  const id = Date.now()
  const duration = notification.duration ?? 4000
  const queueKey =
    notification.key ?? `${notification.type}|${notification.title}|${notification.message}`

  if (notifications.value.some((item) => item.key === queueKey)) {
    return
  }

  if (notifications.value.length >= MAX_NOTIFICATIONS) {
    notifications.value.shift()
  }

  notifications.value.push({
    id,
    ...notification,
    duration,
    key: queueKey,
  })

  if (duration !== 0) {
    setTimeout(() => {
      remove(id)
    }, duration)
  }
}

function remove(id: number) {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}

export function useNotification() {
  return {
    notifications,

    remove,

    success(title: string, message: string) {
      add({
        type: 'success',
        title,
        message,
      })
    },

    error(title: string, message: string) {
      add({
        type: 'error',
        title,
        message,
      })
    },

    warning(title: string, message: string) {
      add({
        type: 'warning',
        title,
        message,
      })
    },

    info(title: string, message: string) {
      add({
        type: 'info',
        title,
        message,
      })
    },
  }
}
