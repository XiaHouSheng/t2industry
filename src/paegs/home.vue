<script setup>
import Discover from './home_child/discover.vue';




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
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span>Navigator One</span>
                </template>
                <el-menu-item-group title="Group One">
                  <el-menu-item index="1-1">item one</el-menu-item>
                  <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                  <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                  <template #title>item four</template>
                  <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <span>Navigator Two</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <el-icon><document /></el-icon>
                <span>Navigator Three</span>
              </el-menu-item>
              <el-menu-item index="4">
                <el-icon><setting /></el-icon>
                <span>Navigator Four</span>
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
          <h2 style="margin: 0; margin-left: 12px">发现</h2>
        </div>
        <div class="sheng-child-main flex-grow-1">
            <discover></discover>
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
