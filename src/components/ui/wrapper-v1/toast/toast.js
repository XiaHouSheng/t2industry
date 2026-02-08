import { createApp, h } from 'vue'
import Toast from './Toast.vue'

let toastApp = null
let toastContainer = null

function createToast(message, type = 'info', duration = 3000) {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)
  }

  const props = {
    message,
    type,
    duration
  }

  const toastComponent = h(Toast, props, {})

  if (toastApp) {
    toastApp.unmount()
  }

  toastApp = createApp({
    render() {
      return toastComponent
    }
  })

  toastApp.mount(toastContainer)
}

export default {
  success(message, duration = 3000) {
    createToast(message, 'success', duration)
  },
  error(message, duration = 3000) {
    createToast(message, 'error', duration)
  },
  warning(message, duration = 3000) {
    createToast(message, 'warning', duration)
  },
  info(message, duration = 3000) {
    createToast(message, 'info', duration)
  }
}
