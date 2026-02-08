<script setup>
</script>

<template>
  <div class="guide-card rounded-xl border border-gray-700 bg-gray-900 shadow-lg overflow-hidden">
    <div class="guide-header p-4 border-b border-gray-800 bg-gray-850">
      <h3 class="text-lg font-semibold text-white">使用指南</h3>
    </div>
    <div class="guide-content p-4 space-y-4">
      <div class="guide-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">如何上传蓝图？</h4>
        <p class="text-sm text-gray-300">
          点击页面上方的"上传蓝图"按钮，选择你要上传的蓝图文件或创建新蓝图。
        </p>
      </div>
      <div class="guide-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">如何编辑蓝图？</h4>
        <p class="text-sm text-gray-300">
          在蓝图卡片下方点击"编辑"按钮，进入蓝图编辑器修改你的布局。
        </p>
      </div>
      <div class="guide-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">如何分享蓝图？</h4>
        <p class="text-sm text-gray-300">
          在蓝图卡片下方点击"分享"按钮，生成分享链接或二维码。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-card {
  min-height: 200px;
}

.guide-item {
  padding: 0.5rem 0;
  border-left: 2px solid rgba(255, 250, 0, 0.3);
  padding-left: 1rem;
}

.guide-item:hover {
  border-left-color: rgba(255, 250, 0, 0.6);
  background-color: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
}

.guide-item h4 {
  margin-bottom: 0.5rem;
}

.guide-item p {
  margin-bottom: 0.5rem;
}

.guide-item p:last-child {
  margin-bottom: 0;
}
</style>
