<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TopNavBar } from '../components/ui/wrapper-v1/navbar/index.js';

const route = useRoute();
const activeIndex = ref('/home');

// 监听路由变化，更新菜单选中状态
watch(() => route.path, (newPath) => {
  const firstPath = '/' + newPath.split('/')[1];
  activeIndex.value = firstPath;
});

onMounted(() => {
  const firstPath = '/' + route.path.split('/')[1];
  activeIndex.value = firstPath;
});

const handleMenuSelect = (index) => {
  activeIndex.value = index;
};
</script>

<template>
  <div class="sheng-root-container">
    <TopNavBar :default-active="activeIndex" @select="handleMenuSelect" />
    <div class="root-container">
      <div class="root-main">
        <RouterView></RouterView>
      </div>
      <div class="root-footer">
        <div class="footer-divider"></div>
        <div class="footer-content">
          <div class="footer-text">
            T2Blueprint | 基于 Vue3 + Element Plus + Gridstack.js 开发 |
            MIT 开源协议
          </div>
          <div class="footer-text">
            网站备案/许可证号 <a href="https://beian.miit.gov.cn/" class="footer-link">粤ICP备2026009977号</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sheng-root-container {
  min-height: 100vh;
  background-color: #111827;
}

.root-container {
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
}

.root-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #1a1a1a;
}

.root-footer {
  background-color: #111827;
  border-top: 1px solid #374151;
  padding: 16px 24px;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #374151, transparent);
  margin-bottom: 12px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-text {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}

.footer-link {
  color: #fbbf24;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #fcd34d;
  text-decoration: underline;
}

/* 滚动条美化 */
.root-main::-webkit-scrollbar {
  width: 8px;
}

.root-main::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.root-main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.root-main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
