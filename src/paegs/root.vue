<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeIndex = ref('/home');

// 监听路由变化，更新菜单选中状态
watch(() => route.path, (newPath) => {
  // 提取一级路由路径
  const firstPath = '/' + newPath.split('/')[1];
  activeIndex.value = firstPath;
});

onMounted(() => {
  // 初始化菜单选中状态
  const firstPath = '/' + route.path.split('/')[1];
  activeIndex.value = firstPath;
});
</script>

<template>
  <div class="sheng-root-container">
    <el-menu mode="horizontal" :ellipsis="false" :router="true" :default-active="activeIndex">
      <el-menu-item index="/home">EndFieldSimulation</el-menu-item>
      <el-menu-item index="/calculate">计算器</el-menu-item>
      <el-menu-item index="/editor">蓝图编辑</el-menu-item>
    </el-menu>
    <el-container>
      <el-main>
        <RouterView></RouterView>
      </el-main>
      <el-footer>
        <el-divider style="margin: 0 0 12px 0" />
        <div class="display-flex justify-content-center">
          <el-text
            >EndFieldSimulation | 基于 Vue3 + Element Plus + Gridstack.js 开发 |
            MIT 开源协议</el-text
          >
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped></style>
