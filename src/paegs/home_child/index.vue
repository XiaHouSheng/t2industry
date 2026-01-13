<script setup>
import { ref, computed } from "vue";
import { View, Share, Link, ArrowRight } from "@element-plus/icons-vue";

// 模拟统计数据
const totalBlueprints = ref(128);
const totalUsers = ref(512);
const totalViews = ref(10240);
const totalDownloads = ref(3580);

// 地区统计
const areaStats = ref({
  四号谷地: 76,
  武陵: 52
});

// 热门蓝图
const hotBlueprints = ref([
  {
    id: 1,
    name: "四号谷地毕业蓝图",
    description: "四号谷地全资源高效生产布局，包含完整的资源循环系统",
    author: "XiaHouSheng",
    avatar: "user",
    area: "四号谷地",
    views: 256,
    downloads: 89
  },
  {
    id: 2,
    name: "武陵高级加工厂",
    description: "武陵地区高级资源加工优化布局，适合后期资源需求",
    author: "EndfieldMaster",
    avatar: "em",
    area: "武陵",
    views: 189,
    downloads: 67
  },
  {
    id: 3,
    name: "四号谷地基础资源生产",
    description: "四号谷地初期基础资源生产布局，适合新手玩家",
    author: "NewPlayerGuide",
    avatar: "np",
    area: "四号谷地",
    views: 320,
    downloads: 120
  }
]);

// 快速导航
const quickLinks = ref([
  {
    name: "蓝图编辑器",
    icon: "Edit",
    path: "/editor",
    description: "创建和编辑你的蓝图"
  },
  {
    name: "发现蓝图",
    icon: "Grid",
    path: "/home/discover",
    description: "浏览其他玩家的蓝图"
  },
  {
    name: "个人蓝图",
    icon: "User",
    path: "/home/self",
    description: "管理你的蓝图"
  },
  {
    name: "计算器",
    icon: "Calculator",
    path: "/calculate",
    description: "物料配平计算"
  }
]);

// 处理蓝图操作
const handleView = (blueprint) => {
  console.log("查看蓝图:", blueprint);
};

const handleShare = (blueprint) => {
  console.log("分享蓝图:", blueprint);
};

const handleBilibili = (blueprint) => {
  console.log("跳转到B站:", blueprint);
};
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <!-- 统计信息卡片 -->
      <div class="stats-section">
        <el-card class="stats-card">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ totalBlueprints }}</div>
                <div class="stat-label">总蓝图数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ totalViews }}</div>
                <div class="stat-label">总浏览量</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ totalDownloads }}</div>
                <div class="stat-label">总下载量</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 快速导航 -->
      <div class="quick-links-section">
        <h3>快速导航</h3>
        <div class="quick-links-grid">
          <div 
            v-for="link in quickLinks" 
            :key="link.name" 
            class="quick-link-card"
            @click="$router.push(link.path)"
          >
            <div class="quick-link-content">
              <div class="quick-link-icon">
                <el-icon :size="36">{{ link.icon }}</el-icon>
              </div>
              <h4>{{ link.name }}</h4>
              <p>{{ link.description }}</p>
              <div class="quick-link-arrow">
                <el-icon :size="16"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门蓝图 -->
      <div class="blueprint-section">
        <h3>热门蓝图</h3>
        <div class="blueprint-grid">
          <el-card
            v-for="blueprint in hotBlueprints"
            :key="blueprint.id"
            class="blueprint-card"
          >
            <template #header>
              <div class="blueprint-header">
                <h4>{{ blueprint.name }}</h4>
                <el-tag size="small" type="warning">{{
                  blueprint.area
                }}</el-tag>
              </div>
            </template>
            <div class="blueprint-content">
              <div class="blueprint-description">
                {{ blueprint.description }}
              </div>
              <div class="blueprint-meta">
                <div class="author-info">
                  <el-avatar :size="24">{{ blueprint.avatar }}</el-avatar>
                  <el-text size="small" style="margin-left: 8px">{{
                    blueprint.author
                  }}</el-text>
                </div>
                <div class="blueprint-stats">
                  <el-text size="small" style="margin-right: 10px">
                    浏览: {{ blueprint.views }}
                  </el-text>
                  <el-text size="small">
                    下载: {{ blueprint.downloads }}
                  </el-text>
                </div>
              </div>
              <div class="blueprint-actions">
                <el-button
                  size="small"
                  :icon="View"
                  @click="handleView(blueprint)"
                >
                  查看
                </el-button>
                <el-button
                  size="small"
                  :icon="Share"
                  @click="handleShare(blueprint)"
                >
                  分享
                </el-button>
                <el-button
                  size="small"
                  :icon="Link"
                  @click="handleBilibili(blueprint)"
                >
                  B站
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 站点介绍 -->
      <div class="intro-section">
        <el-card class="intro-card">
          <template #header>
            <h3 style="margin: 0">关于终末地蓝图站</h3>
          </template>
          <div class="intro-content">
            <div class="intro-item">
              <h4>什么是终末地蓝图站？</h4>
              <p>
                一款面向《明日方舟：终末地》的多功能工具平台，核心能力包含：蓝图分享与管理、生产效率模拟（计划）。
              </p>
              <p>
                玩家可以手动通过本站提供的蓝图编辑器进行蓝图编辑并上传，也可以查看其他玩家的蓝图。
              </p>
              <p>
                站点旨在搭建一个蓝图汇总库以便于玩家进行查找。
              </p>
            </div>
            <div class="intro-item">
              <h4>公告</h4>
              <p>
                目前没有开发管道相关的蓝图编辑功能，但是对于需要管道的机器可以进行配方配置与放置。
              </p>
            </div>
            <div class="intro-item">
              <h4>联系我们</h4>
              <p>
                企鹅群：615187598<br>
                仓库主页：<a href="https://github.com/XiaHouSheng/EndFieldSimulation" target="_blank">https://github.com/XiaHouSheng/EndFieldSimulation</a>
              </p>
            </div>
            <div class="intro-item">
              <h4>开发团队</h4>
              <p>霞后生</p>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.stats-section {
  margin-bottom: 20px;
}

.stats-card {
  margin-bottom: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: var(--sheng-root-bg);
  border-radius: 8px;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.quick-links-section {
  margin-bottom: 30px;
}

.quick-links-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.quick-link-card {
  background-color: var(--el-color-white);
  border-radius: 10px;
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
}

.quick-link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.quick-link-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quick-link-icon {
  color: var(--el-color-primary);
  margin-bottom: 5px;
}

.quick-link-card h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.quick-link-card p {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  line-height: 1.3;
  max-width: 180px;
}

.quick-link-arrow {
  margin-top: 5px;
  color: var(--el-color-primary);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.quick-link-card:hover .quick-link-arrow {
  opacity: 1;
  transform: translateX(3px);
  transition: all 0.3s ease;
}

.blueprint-section {
  margin-bottom: 30px;
}

.blueprint-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.blueprint-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blueprint-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.blueprint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blueprint-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.blueprint-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.blueprint-description {
  margin-bottom: 10px;
  flex-grow: 1;
  color: var(--el-text-color-primary);
}

.blueprint-meta {
  margin-bottom: 15px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.blueprint-stats {
  margin-top: 5px;
}

.blueprint-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.intro-section {
  margin-bottom: 30px;
}

.intro-card {
  background-color: var(--home-card-bg);
}

.intro-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.intro-item h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.intro-item p {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
  line-height: 1.5;
}

.intro-item a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.intro-item a:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .quick-links-grid {
    grid-template-columns: 1fr;
  }
  
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
  
  .intro-content {
    grid-template-columns: 1fr;
  }
}
</style>
