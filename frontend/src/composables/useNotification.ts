import { ref } from 'vue'
import type { Notification } from '@/types/notification'

const notifications = ref<Notification[]>([])

function add(notification: Omit<Notification, 'id'>) {
  const id = Date.now()

  notifications.value.push({
    id,
    ...notification,
  })

  if (notification.duration !== 0) {
    setTimeout(() => {
      remove(id)
    }, notification.duration ?? 4000)
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
