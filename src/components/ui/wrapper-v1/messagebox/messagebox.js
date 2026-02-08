import { createApp, h, nextTick } from 'vue'
import MessageBox from './MessageBox.vue'

export function confirm(message, title = '确认', options = {}) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const props = {
      title,
      message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || '确定',
      cancelButtonText: options.cancelButtonText || '取消',
      confirmButtonClass: options.confirmButtonClass || 'bg-red-500 text-white hover:bg-red-600',
      cancelButtonClass: options.cancelButtonClass || 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700',
      onConfirm: () => {
        app.unmount()
        document.body.removeChild(container)
        resolve(true)
      },
      onCancel: () => {
        app.unmount()
        document.body.removeChild(container)
        resolve(false)
      }
    }

    const app = createApp({
      render() {
        return h(MessageBox, props, {})
      }
    })

    app.mount(container)
  })
}

export function alert(message, title = '提示', options = {}) {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const props = {
      title,
      message,
      type: options.type || 'info',
      showCancelButton: false,
      confirmButtonText: options.confirmButtonText || '确定',
      confirmButtonClass: options.confirmButtonClass || 'bg-yellow-400 text-gray-900 hover:bg-yellow-500',
      onConfirm: () => {
        app.unmount()
        document.body.removeChild(container)
        resolve(true)
      }
    }

    const app = createApp({
      render() {
        return h(MessageBox, props, {})
      }
    })

    app.mount(container)
  })
}

export function prompt(message, title = '输入', options = {}) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    let inputValue = options.defaultValue || ''

    const messageContent = h('div', [
      h('p', { class: 'text-gray-300 text-sm mb-3' }, message),
      h('input', {
        class: 'w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded text-gray-100 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200',
        value: inputValue,
        onInput: (e) => {
          inputValue = e.target.value
        },
        onKeyup: (e) => {
          if (e.key === 'Enter') {
            handleConfirm()
          }
        }
      })
    ])

    const handleConfirm = () => {
      app.unmount()
      document.body.removeChild(container)
      resolve(inputValue)
    }

    const handleCancel = () => {
      app.unmount()
      document.body.removeChild(container)
      resolve(null)
    }

    const props = {
      title,
      message: messageContent,
      type: options.type || 'info',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || '确定',
      cancelButtonText: options.cancelButtonText || '取消',
      confirmButtonClass: options.confirmButtonClass || 'bg-yellow-400 text-gray-900 hover:bg-yellow-500',
      cancelButtonClass: options.cancelButtonClass || 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700',
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }

    const app = createApp({
      render() {
        return h(MessageBox, props, {})
      }
    })

    app.mount(container)
  })
}

export default {
  confirm,
  alert,
  prompt
}
