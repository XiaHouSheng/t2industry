<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  defaultActive: {
    type: String,
    default: '/home'
  }
});

const emit = defineEmits(['select']);

const router = useRouter();
const route = useRoute();

const menuItems = [
  {
    index: '/home',
    label: 'T2Blueprint'
  },
  {
    index: '/editor',
    label: '蓝图编辑'
  },
  {
    index: '/calculate',
    label: '计算器'
  }
];

const activeIndex = computed(() => {
  const firstPath = '/' + route.path.split('/')[1];
  return firstPath;
});

const handleMenuClick = (index) => {
  emit('select', index);
  router.push(index);
};
</script>

<template>
  <nav class="top-navbar">
    <div class="navbar-container">
      <div class="navbar-menu">
        <button
          v-for="item in menuItems"
          :key="item.index"
          @click="handleMenuClick(item.index)"
          :class="[
            'navbar-item',
            { 'navbar-item-active': activeIndex === item.index }
          ]"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.top-navbar {
  background-color: #111827;
  border-bottom: 1px solid #374151;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 100%;
  padding: 0 24px;
}

.navbar-menu {
  display: flex;
  gap: 8px;
}

.navbar-item {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.navbar-item:hover {
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.1);
}

.navbar-item-active {
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.15);
}

.navbar-item-active:hover {
  background-color: rgba(251, 191, 36, 0.2);
}
</style>
