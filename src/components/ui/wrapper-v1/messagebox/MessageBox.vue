<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: [String, Object],
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'info', 'error'].includes(value)
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  confirmButtonText: {
    type: String,
    default: '确定'
  },
  cancelButtonText: {
    type: String,
    default: '取消'
  },
  confirmButtonClass: {
    type: String,
    default: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
  },
  cancelButtonClass: {
    type: String,
    default: 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const visible = ref(false)

onMounted(() => {
  nextTick(() => {
    visible.value = true
  })
})

function handleConfirm() {
  visible.value = false
  setTimeout(() => {
    emit('confirm')
  }, 300)
}

function handleCancel() {
  visible.value = false
  setTimeout(() => {
    emit('cancel')
  }, 300)
}

const typeIcons = {
  success: '✓',
  warning: '!',
  info: 'i',
  error: '✕'
}

const typeColors = {
  success: 'text-green-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  error: 'text-red-500'
}
</script>

<template>
  <transition
    name="fade"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70"
    >
      <transition
        name="scale"
      >
        <div
          v-if="visible"
          class="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-700">
            <span class="text-2xl font-bold" :class="typeColors[type]">{{ typeIcons[type] }}</span>
            <h3 class="text-lg font-semibold text-gray-100">{{ title }}</h3>
          </div>
          <div class="px-6 py-4">
            <template v-if="typeof message === 'string'">
              <p class="text-gray-300 text-sm">{{ message }}</p>
            </template>
            <component :is="message" v-else />
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
            <button
              v-if="showCancelButton"
              class="px-4 py-2 rounded transition-colors text-sm"
              :class="cancelButtonClass"
              @click="handleCancel"
            >
              {{ cancelButtonText }}
            </button>
            <button
              class="px-4 py-2 rounded transition-colors text-sm"
              :class="confirmButtonClass"
              @click="handleConfirm"
            >
              {{ confirmButtonText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
