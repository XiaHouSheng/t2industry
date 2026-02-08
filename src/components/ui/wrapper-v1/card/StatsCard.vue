<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  stats: {
    type: Object,
    required: true
  },
  labels: {
    type: Object,
    default: () => ({
      blueprints: '总蓝图数',
      users: '总用户数',
      views: '总浏览量',
      downloads: '总下载量'
    })
  }
})
</script>

<template>
  <div class="stats-card rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl shadow-lg overflow-hidden">
    <template v-if="loading">
      <div class="stats-grid">
        <div class="stat-item" v-for="i in 4" :key="i">
          <div class="stat-content">
            <div class="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-24 bg-gray-700 rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="stats-grid">
        <div class="stat-item group">
          <div class="stat-content">
            <div class="stat-value text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
              {{ stats.blueprints || 0 }}
            </div>
            <div class="stat-label text-gray-400">{{ labels.blueprints }}</div>
          </div>
        </div>
        <div class="stat-item group">
          <div class="stat-content">
            <div class="stat-value text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
              {{ stats.users || 0 }}
            </div>
            <div class="stat-label text-gray-400">{{ labels.users }}</div>
          </div>
        </div>
        <div class="stat-item group">
          <div class="stat-content">
            <div class="stat-value text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
              {{ stats.views || 0 }}
            </div>
            <div class="stat-label text-gray-400">{{ labels.views }}</div>
          </div>
        </div>
        <div class="stat-item group">
          <div class="stat-content">
            <div class="stat-value text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
              {{ stats.downloads || 0 }}
            </div>
            <div class="stat-label text-gray-400">{{ labels.downloads }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
