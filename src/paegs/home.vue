<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { House, Grid, User } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

// 计算当前活动的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 计算页面标题
const pageTitle = computed(() => {
  switch (route.path) {
    case '/home':
      return '首页';
    case '/home/discover':
      return '发现蓝图';
    case '/home/self':
      return '个人蓝图';
    default:
      return '我的';
  }
});

// 处理菜单选择
const handleMenuSelect = (key) => {
  router.push(key);
};
</script>

<template>
  <el-row :gutter="6">
    <el-col :span="4">
      <div class="sheng-side-menu test-border display-flex flex-direation-col">
        <div
          class="sheng-menu-header display-flex flex-direation-row test-border"
        >
          <div class="display-flex flex-direation-col justify-content-center">
            <el-avatar size="large"> user </el-avatar>
          </div>
          <div
            class="display-flex flex-grow-1 flex-direation-row"
            style="justify-content: start"
          >
            <div
              class="display-flex flex-direation-col justify-content-center"
              style="margin-left: 12px"
            >
              <el-text>XiaHouSheng</el-text>
              <el-text>ID: 1145141919</el-text>
            </div>
          </div>
        </div>
        <div class="sheng-menu">
          <div class="sheng-menu-item">
            <el-menu
              :default-active="activeMenu"
              class="el-menu-vertical-demo"
              @select="handleMenuSelect"
            >
              <el-menu-item index="/home">
                <el-icon><House /></el-icon>
                <span>首页</span>
              </el-menu-item>
              <el-menu-item index="/home/discover">
                <el-icon><Grid /></el-icon>
                <span>发现蓝图</span>
              </el-menu-item>
              <el-menu-item index="/home/self">
                <el-icon><User /></el-icon>
                <span>个人蓝图</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div
          style="margin-top: auto"
          class="sheng-login-cont display-flex flex-direation-row justify-content-center test-border"
        >
          <el-text>登录/登出</el-text>
        </div>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="sheng-home-main display-flex flex-direation-col test-border">
        <div
          class="sheng-main-header test-border display-flex flex-direation-col justify-content-center"
        >
          <h2 style="margin: 0; margin-left: 12px">{{ pageTitle }}</h2>
        </div>
        <div class="sheng-child-main flex-grow-1">
          <router-view></router-view>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.sheng-child-main {
  overflow-y: auto;
  min-height: auto;
  padding: 6px;
}
.sheng-main-header {
  width: 100%;
  height: 50px;
}
.sheng-login-cont {
  padding: 6px;
}
.sheng-menu-header {
  height: 80px;
  padding: 0 12px 0 12px;
}
.sheng-side-menu {
  height: 740px;
}
.sheng-home-main {
  height: 740px;
}
</style>
