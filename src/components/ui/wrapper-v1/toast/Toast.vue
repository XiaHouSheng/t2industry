<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
const progress = ref(100)

let intervalId = null

function startProgress() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  progress.value = 100
  intervalId = setInterval(() => {
    progress.value -= (100 / (props.duration / 50))
    if (progress.value <= 0) {
      clearInterval(intervalId)
      handleClose()
    }
  }, 50)
}

onMounted(() => {
  nextTick(() => {
    visible.value = true
    if (props.duration > 0) {
      startProgress()
    }
  })
})

watch(() => props.duration, (newDuration) => {
  if (newDuration > 0) {
    startProgress()
  }
})

function handleClose() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
}

const typeIcons = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i'
}
</script>

<template>
  <transition
    name="fade"
  >
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 z-[9999] flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl min-w-[300px] transition-opacity duration-300"
      :class="typeStyles[type]"
    >
      <span class="text-white text-lg font-bold">{{ typeIcons[type] }}</span>
      <span class="text-white text-sm flex-1">{{ message }}</span>
      <button
        @click="handleClose"
        class="text-white/70 hover:text-white transition-colors"
      >
        ✕
      </button>
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
</style>
