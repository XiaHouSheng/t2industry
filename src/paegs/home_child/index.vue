<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { View, Share, Link, ArrowRight } from "@element-plus/icons-vue";
import { useHomeStore } from "../../stores/HomeStore";
import { ElMessage } from "element-plus";
import { Edit, Search, User, Setting } from "@element-plus/icons-vue";
// 使用HomeStore
const homeStore = useHomeStore();
const router = useRouter();

// 从store获取状态
const totalBlueprints = computed(() => homeStore.totalBlueprints);
const totalUsers = computed(() => homeStore.totalUsers);
const totalViews = computed(() => homeStore.totalViews);
const totalDownloads = computed(() => homeStore.totalDownloads);
const hotBlueprints = computed(() => homeStore.hotBlueprints);
const loading = computed(() => homeStore.loading.stats);
const error = computed(() => homeStore.error);

// 地区统计
const areaStats = computed(() => {
  const stats = {
    四号谷地: 0,
    武陵: 0,
  };
  if (Array.isArray(homeStore.hotBlueprints)) {
    homeStore.hotBlueprints.forEach((bp) => {
      if (bp.area === "四号谷地") stats.四号谷地++;
      if (bp.area === "武陵") stats.武陵++;
    });
  }
  return stats;
});

// 快速导航
const quickLinks = [
  {
    name: "蓝图编辑器",
    text: "Edit",
    path: "/editor",
    description: "创建和编辑你的蓝图",
    icon: Edit,
  },
  {
    name: "发现蓝图",
    text: "Discover",
    path: "/home/discover",
    description: "浏览其他玩家的蓝图",
    icon: Search
  },
  {
    name: "个人蓝图",
    text: "User",
    path: "/home/self",
    description: "管理你的蓝图",
    icon: User,
  },
  {
    name: "计算器",
    text: "Calculator",
    path: "/calculate",
    description: "物料配平计算",
    icon: Setting
  },
];

// 处理蓝图操作
const handleView = async (blueprint) => {
  try {
    //console.log("查看蓝图:", blueprint);
    if (blueprint.fileHash) {
      //这里是为了浏览量的增加，实际信息不需要使用
      homeStore.getBlueprintById(blueprint.id)
      // 有fileHash，跳转到带hash的editor页面
      router.push(`/editor/${blueprint.fileHash}`);
    } else {
      // 没有fileHash，跳转到editor页面
      ElMessage.warning("该蓝图缺少文件哈希，无法直接查看");
    }
  } catch (err) {
    console.error("查看蓝图失败:", err);
    ElMessage.error("操作失败，请重试");
  }
};

const handleShare = async (blueprint) => {
  try {
    //console.log("分享蓝图:", blueprint);
    // 实际项目中可以调用分享API
  } catch (err) {
    console.error("分享蓝图失败:", err);
  }
};

const handleBilibili = (blueprint) => {
  //console.log("跳转到B站:", blueprint);
};

// 页面加载时获取数据
onMounted(() => {
  // 只有当hotBlueprints为空时才加载数据，否则直接使用已加载的数据
  if (
    !Array.isArray(homeStore.hotBlueprints) ||
    homeStore.hotBlueprints.length === 0
  ) {
    homeStore.loadStats();
  }
});

// 重试加载数据
const handleRetry = () => {
  // 重试时总是重新加载数据
  homeStore.loadStats();
};
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="mb-4"
        style="margin-bottom: 6px"
      >
        <template #default>
          <el-button type="primary" size="small" @click="handleRetry"
            >重试</el-button
          >
        </template>
      </el-alert>

      <!-- 快速导航 -->
      <div class="quick-links-section">
        <div class="quick-links-grid">
          <div
            v-for="link in quickLinks"
            :key="link.name"
            class="quick-link-card"
            @click="$router.push(link.path)"
          >
            <div class="quick-link-content">
              <div class="quick-link-icon">
                <el-icon :size="36">{{ link.text }}</el-icon>
                <div class="quick-link-icon-cont">
                  <el-icon :size="140">
                    <component :is="link.icon" />
                  </el-icon>
                </div>
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
        <el-skeleton :loading="loading" animated>
          <template #template>
            <div class="blueprint-grid">
              <el-card class="blueprint-card" v-for="i in 4" :key="i">
                <template #header>
                  <div class="blueprint-header">
                    <el-skeleton-item
                      variant="text"
                      style="width: 150px; height: 20px"
                    />
                    <el-skeleton-item
                      variant="text"
                      style="width: 60px; height: 20px"
                    />
                  </div>
                </template>
                <div class="blueprint-content">
                  <el-skeleton-item
                    variant="text"
                    style="width: 100%; height: 16px; margin-bottom: 8px"
                  />
                  <el-skeleton-item
                    variant="text"
                    style="width: 100%; height: 16px; margin-bottom: 8px"
                  />
                  <el-skeleton-item
                    variant="text"
                    style="width: 80%; height: 16px; margin-bottom: 16px"
                  />
                  <div class="author-info">
                    <el-skeleton-item
                      variant="circle"
                      style="width: 24px; height: 24px"
                    />
                    <el-skeleton-item
                      variant="text"
                      style="width: 100px; height: 16px; margin-left: 8px"
                    />
                  </div>
                  <el-skeleton-item
                    variant="text"
                    style="width: 100px; height: 16px; margin-top: 8px"
                  />
                  <div class="blueprint-actions">
                    <el-skeleton-item
                      variant="text"
                      style="width: 80px; height: 32px"
                    />
                    <el-skeleton-item
                      variant="text"
                      style="width: 80px; height: 32px"
                    />
                    <el-skeleton-item
                      variant="text"
                      style="width: 80px; height: 32px"
                    />
                  </div>
                </div>
              </el-card>
            </div>
          </template>
          <div
            class="blueprint-grid"
            v-if="!loading && hotBlueprints.length > 0"
          >
            <el-card
              v-for="blueprint in hotBlueprints"
              :key="blueprint.id"
              class="blueprint-card"
            >
              <template #header>
                <div class="blueprint-header">
                  <h2>{{ blueprint.name }}</h2>
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
                    <el-avatar :size="24">{{
                      blueprint.creator?.name?.charAt(0) || "用户"
                    }}</el-avatar>
                    <el-text size="small" style="margin-left: 8px">{{
                      blueprint.creator?.name || "未知作者"
                    }}</el-text>
                  </div>
                  <div class="blueprint-stats">
                    <el-text size="small" style="margin-right: 10px">
                      浏览: {{ blueprint.views || 0 }}
                    </el-text>
                    <el-text size="small">
                      下载: {{ blueprint.downloads || 0 }}
                    </el-text>
                  </div>
                </div>
                <div class="blueprint-actions">
                  <el-button
                    size="medium"
                    :icon="View"
                    @click="handleView(blueprint)"
                    type="primary"
                  >
                    查看
                  </el-button>
                  <el-button
                    size="medium"
                    :icon="Share"
                    @click="handleShare(blueprint)"
                    type="default"
                    plain
                  >
                    分享
                  </el-button>
                  <el-button
                    size="medium"
                    :icon="Link"
                    @click="handleBilibili(blueprint)"
                    type="default"
                    plain
                  >
                    B站
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <div
            v-else-if="!loading && hotBlueprints.length === 0"
            class="text-center py-8"
          >
            <el-empty description="暂无热门蓝图" />
          </div>
        </el-skeleton>
      </div>

      <!-- 统计信息卡片 -->
      <div class="stats-section">
        <el-card class="stats-card">
          <template #default>
            <el-skeleton :loading="loading" animated>
              <template #template>
                <div class="stats-grid">
                  <div class="stat-item" v-for="i in 4" :key="i">
                    <div class="stat-content">
                      <el-skeleton-item
                        variant="text"
                        style="width: 80px; height: 30px"
                      />
                      <el-skeleton-item
                        variant="text"
                        style="width: 100px; height: 16px; margin-top: 8px"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <div class="stats-grid" v-if="!loading">
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
            </el-skeleton>
          </template>
        </el-card>
      </div>

      <!-- 站点介绍 -->
      <div class="intro-section">
        <el-card class="intro-card">
          <template #header>
            <h3 style="margin: 0">关于本站</h3>
          </template>
          <div class="intro-content">
            <div class="intro-item">
              <h4>什么是"塔卫二蓝图"？</h4>
              <p>
                一款面向《明日方舟：终末地》的多功能工具平台，核心能力包含：蓝图分享与管理、生产效率模拟（计划）。
              </p>
              <p>
                玩家可以手动通过本站提供的蓝图编辑器进行蓝图编辑并上传，也可以查看其他玩家的蓝图。
              </p>
              <p>站点旨在搭建一个蓝图汇总库以便于玩家进行查找。</p>
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
                企鹅群：615187598<br />
                仓库主页：<a
                  href="https://github.com/XiaHouSheng/t2industry"
                  target="_blank"
                  >https://github.com/XiaHouSheng/t2industry</a
                >
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
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
  position: relative;
}

.quick-link-icon-cont {
  transition: all 0.3s ease;
  position: absolute;
  opacity: 0.1;
  top: 25px;
  left: 50px;
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
  transition: all 0.3s ease;
}

.quick-link-icon {
  color: blue
}

.quick-link-card:hover .quick-link-icon-cont {
  opacity: 0.3;
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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

.blueprint-header h2 {
  margin: 0;
  font-size: 20px;
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
  justify-content: space-between;
  margin-top: auto;
}

.intro-section {
  margin-bottom: 12px;
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
