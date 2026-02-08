<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'info', 'error'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['retry'])

const typeStyles = {
  success: 'bg-green-500/20 border-green-500/30 text-green-400',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  info: 'bg-gray-900/50 border-gray-700 text-gray-300',
  error: 'bg-red-500/20 border-red-500/30 text-red-400'
}

const typeIcons = {
  success: '✓',
  warning: '!',
  info: 'i',
  error: '✕'
}
</script>

<template>
  <div class="rounded-xl border overflow-hidden mb-4 mx-6 mt-6" :class="typeStyles[type]">
    <div class="flex items-start gap-3 p-4">
      <span v-if="showIcon" class="text-2xl font-bold flex-shrink-0">
        {{ typeIcons[type] }}
      </span>
      <div class="flex-1">
        <h4 class="text-base font-semibold mb-2">{{ title }}</h4>
        <slot>
          <button
            @click="emit('retry')"
            class="px-4 py-2 text-sm font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            重试
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
