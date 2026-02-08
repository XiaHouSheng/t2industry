<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleClick = () => {
  router.push(props.link.path)
}
</script>

<template>
  <div 
    class="quick-link-card group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-yellow-700 hover:scale-[1.01] cursor-pointer"
    @click="handleClick"
  >
    <div class="quick-link-content relative z-10">
      <div class="quick-link-icon mb-4">
        <div class="quick-link-icon-cont flex items-center justify-center rounded-lg bg-gray-800/50 p-3">
          <component 
            :is="link.icon" 
            class="text-yellow-500 transition-all duration-300 group-hover:scale-105 group-hover:text-yellow-400 w-9 h-9"
          />
        </div>
      </div>
      <h3 class="text-base font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
        {{ link.name }}
      </h3>
      <p class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-4">
        {{ link.description }}
      </p>
      <div class="quick-link-arrow flex items-center justify-end">
        <div class="flex items-center gap-1 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-6px] group-hover:translate-x-0">
          <span class="text-xs font-medium">前往</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.quick-link-card {
  min-height: 140px;
}
</style>
