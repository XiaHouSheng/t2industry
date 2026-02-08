<script setup>
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

const emit = defineEmits(['edit', 'reupload', 'share', 'delete'])

const handleEdit = () => {
  emit('edit', props.blueprint)
}

const handleReupload = () => {
  emit('reupload', props.blueprint)
}

const handleShare = () => {
  emit('share', props.blueprint)
}

const handleDelete = () => {
  emit('delete', props.blueprint)
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  try {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch (err) {
    return '未知'
  }
}
</script>

<template>
  <div class="self-blueprint-card rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-yellow-700 hover:-translate-y-1 hover:scale-[1.01]">
    <template v-if="loading">
      <div class="p-4 border-b border-gray-800 bg-gray-850">
        <div class="flex items-center justify-between">
          <div class="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
            <div class="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <div class="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 w-4/5 bg-gray-700 rounded animate-pulse"></div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div class="flex gap-2 pt-2">
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="p-4 border-b border-gray-800 bg-gray-850">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white truncate max-w-[120px]">{{ blueprint.name }}</h3>
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 text-xs font-medium rounded" :class="!blueprint.fileHash ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'">
              {{ !blueprint.fileHash ? '本地' : '已上传' }}
            </span>
            <span class="px-2 py-1 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              {{ blueprint.area || '未知地区' }}
            </span>
            <button
              v-if="blueprint.fileHash"
              @click="handleDelete"
              class="w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <p class="text-sm text-gray-400 truncate">
          {{ blueprint.description }}
        </p>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>创建时间: {{ formatDate(blueprint.createdAt) }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>最近编辑: {{ formatDate(blueprint.lastEdited) }}</span>
          </div>
          <div v-if="blueprint.creator" class="flex items-center gap-2">
            <div class="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
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
            @click="handleEdit"
            class="flex-1 px-3 py-2 text-sm font-medium rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors duration-300"
          >
            编辑
          </button>
          <button
            @click="handleReupload"
            :disabled="!blueprint.fileHash"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors duration-300',
              !blueprint.fileHash
                ? 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            重新上传
          </button>
          <button
            @click="handleShare"
            :disabled="!blueprint.fileHash"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors duration-300',
              !blueprint.fileHash
                ? 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            分享
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
