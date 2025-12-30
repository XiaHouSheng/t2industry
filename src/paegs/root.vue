<script setup></script>

<template>
  <div class="sheng-root-container">
    <el-container>
      <el-header>
        <el-menu mode="horizontal" :ellipsis="false" :router="true">
          <el-menu-item index="home">EndFieldSimulation</el-menu-item>
          <el-menu-item index="calculate">计算器</el-menu-item>
          <el-menu-item index="editor">蓝图编辑</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <RouterView></RouterView>
      </el-main>
      <el-footer>
        <el-divider style="margin: 0 0 12px 0" />
        <div class="display-flex justify-content-center">
          <el-text
            >EndFieldSimulation | 基于 Vue3 + Element Plus + Gridstack.js 开发 | MIT
            开源协议</el-text
          >
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped></style>
