<script setup>
const props = defineProps({
  activeMenu: {
    type: String,
    default: '/home'
  }
})

const emit = defineEmits(['select'])

const handleSelect = (index) => {
  emit('select', index)
}
</script>

<template>
  <div class="sidebar-menu">
    <div class="menu-item" :class="{ active: activeMenu === '/home' }" @click="handleSelect('/home')">
      <div class="menu-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <span class="menu-text">首页</span>
    </div>
    <div class="menu-item" :class="{ active: activeMenu === '/home/discover' }" @click="handleSelect('/home/discover')">
      <div class="menu-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <span class="menu-text">发现蓝图</span>
    </div>
    <div class="menu-item" :class="{ active: activeMenu === '/home/self' }" @click="handleSelect('/home/self')">
      <div class="menu-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <span class="menu-text">个人蓝图</span>
    </div>
  </div>
</template>

<style scoped>
.sidebar-menu {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #9ca3af;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
}

.menu-item.active {
  background-color: rgba(255, 250, 0, 0.1);
  color: #facc15;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
