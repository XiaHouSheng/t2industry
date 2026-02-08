<script setup>
import { computed } from 'vue'

const props = defineProps({
  blueprint: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view', 'share', 'bilibili'])

const handleView = () => {
  emit('view', props.blueprint)
}

const handleShare = () => {
  emit('share', props.blueprint)
}

const handleBilibili = () => {
  emit('bilibili', props.blueprint)
}
</script>

<template>
  <div class="blueprint-card rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-yellow-700 hover:-translate-y-1 hover:scale-[1.01]">
    <template v-if="loading">
      <div class="p-4 border-b border-gray-800 bg-gray-850">
        <div class="flex items-center justify-between">
          <div class="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <div class="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 w-4/5 bg-gray-700 rounded animate-pulse"></div>
        <div class="flex items-center gap-2">
          <div class="h-6 w-6 bg-gray-700 rounded-full animate-pulse"></div>
          <div class="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div class="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        <div class="flex gap-2 pt-2">
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="p-4 border-b border-gray-800 bg-gray-850">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">{{ blueprint.name }}</h3>
          <span class="px-2 py-1 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            {{ blueprint.area }}
          </span>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <p class="text-sm text-gray-400 truncate">
          {{ blueprint.description }}
        </p>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
              {{ blueprint.creator?.name?.charAt(0) || '用' }}
            </div>
            <span class="text-sm text-gray-300">
              {{ blueprint.creator?.name || '未知作者' }}
            </span>
          </div>
          <div class="flex gap-4 text-xs text-gray-500">
            <span>浏览: {{ blueprint.views || 0 }}</span>
            <span>下载: {{ blueprint.downloads || 0 }}</span>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <button
            @click="handleView"
            class="flex-1 px-3 py-2 text-sm font-medium rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors duration-300"
          >
            查看
          </button>
          <button
            @click="handleShare"
            class="flex-1 px-3 py-2 text-sm font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-300"
          >
            分享
          </button>
          <button
            @click="handleBilibili"
            class="flex-1 px-3 py-2 text-sm font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-300"
          >
            B站
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
