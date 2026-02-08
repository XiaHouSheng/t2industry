import { createApp, h } from 'vue'
import Toast from './Toast.vue'

export { Toast }

let toastInstance = null

function show({ message, type = 'info', duration = 3000 }) {
  if (toastInstance) {
    toastInstance.unmount()
  }

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(Toast, {
        message,
        type,
        duration,
        onClose: () => {
          app.unmount()
          document.body.removeChild(container)
          toastInstance = null
        }
      })
    }
  })

  toastInstance = app
  app.mount(container)
}

export const toast = {
  show,
  success: (message, duration) => show({ message, type: 'success', duration }),
  error: (message, duration) => show({ message, type: 'error', duration }),
  warning: (message, duration) => show({ message, type: 'warning', duration }),
  info: (message, duration) => show({ message, type: 'info', duration })
}

export function useToast() {
  return toast
}
