<script setup>
import { ref, computed } from "vue";
import { Edit, Upload, Share } from "@element-plus/icons-vue";

// 模拟本地保存的蓝图数据（只保存一个）
const localBlueprints = ref([
  {
    id: 1,
    name: "基础生产蓝图",
    description: "包含基础的资源生产机器",
    createdAt: "2026-01-10",
    lastEdited: "2026-01-12",
    area: "四号谷地",
    thumbnail: "#",
    type: "local",
  },
]);

// 模拟用户上传的蓝图数据
const uploadedBlueprints = ref([
  {
    id: 101,
    name: "优化版资源循环",
    description: "资源循环利用的优化布局",
    createdAt: "2026-01-09",
    lastEdited: "2026-01-10",
    views: 120,
    downloads: 45,
    area: "四号谷地",
    type: "uploaded",
  },
  {
    id: 102,
    name: "自动化生产线",
    description: "全自动化的生产线布局",
    createdAt: "2026-01-11",
    lastEdited: "2026-01-11",
    views: 89,
    downloads: 32,
    area: "武陵",
    type: "uploaded",
  },
]);

// 合并蓝图列表（本地蓝图在前，上传蓝图在后）
const allBlueprints = ref([
  ...localBlueprints.value,
  ...uploadedBlueprints.value,
]);

// 地区筛选
const selectedArea = ref("");
const areas = ref(["", "四号谷地", "武陵"]);

// 按地区筛选蓝图
const filteredBlueprints = computed(() => {
  if (!selectedArea.value) {
    return allBlueprints.value;
  }
  return allBlueprints.value.filter(
    (blueprint) => blueprint.area === selectedArea.value
  );
});

// 编辑蓝图
const handleEdit = (blueprint) => {
  console.log("编辑蓝图:", blueprint);
  // 这里可以添加编辑蓝图的逻辑
};

// 重新上传蓝图
const handleReupload = (blueprint) => {
  console.log("重新上传蓝图:", blueprint);
  // 这里可以添加重新上传蓝图的逻辑
};

// 分享蓝图
const handleShare = (blueprint) => {
  console.log("分享蓝图:", blueprint);
  // 这里可以添加分享蓝图的逻辑
};

// 上传蓝图（合并创建和导入功能）
const handleUploadBlueprint = () => {
  console.log("上传蓝图");
  // 这里可以添加上传蓝图的逻辑
};

// 获取统计信息
const totalBlueprints = computed(() => allBlueprints.value.length);
const uploadedBlueprintsCount = computed(() => uploadedBlueprints.value.length);

// 按地区统计蓝图数量
const areaStats = computed(() => {
  const stats = {
    四号谷地: 0,
    武陵: 0,
  };
  allBlueprints.value.forEach((blueprint) => {
    if (stats.hasOwnProperty(blueprint.area)) {
      stats[blueprint.area]++;
    }
  });
  return stats;
});
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
                <div class="stat-value">{{ uploadedBlueprintsCount }}</div>
                <div class="stat-label">上传蓝图</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ areaStats["四号谷地"] }}</div>
                <div class="stat-label">四号谷地</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-content">
                <div class="stat-value">{{ areaStats["武陵"] }}</div>
                <div class="stat-label">武陵</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 操作按钮和地区筛选 -->
      <div class="action-filter-section">
        <div class="action-section">
          <el-button
            type="primary"
            :icon="Upload"
            @click="handleUploadBlueprint"
          >
            上传蓝图
          </el-button>
        </div>
        <div class="filter-section">
          <el-select
            v-model="selectedArea"
            placeholder="按地区筛选"
            style="width: 200px"
          >
            <el-option
              v-for="area in areas"
              :key="area"
              :label="area || '全部地区'"
              :value="area"
            ></el-option>
          </el-select>
        </div>
      </div>

      <!-- 所有蓝图（本地在前，上传在后） -->
      <div class="blueprint-section">
        <h3>我的蓝图</h3>
        <div class="blueprint-grid">
          <el-card
            v-for="blueprint in filteredBlueprints"
            :key="blueprint.id"
            class="blueprint-card"
          >
            <template #header>
              <div class="blueprint-header">
                <h4>{{ blueprint.name }}</h4>
                <div class="blueprint-tags">
                  <el-tag
                    size="small"
                    :type="blueprint.type === 'local' ? 'info' : 'success'"
                  >
                    {{ blueprint.type === "local" ? "本地" : "已上传" }}
                  </el-tag>
                  <el-tag size="small" type="warning">{{
                    blueprint.area
                  }}</el-tag>
                </div>
              </div>
            </template>
            <div class="blueprint-content">
              <div class="blueprint-description">
                {{ blueprint.description }}
              </div>
              <div class="blueprint-meta">
                <el-text size="small"
                  >创建时间: {{ blueprint.createdAt }}</el-text
                >
                <el-text size="small"
                  >最近编辑: {{ blueprint.lastEdited }}</el-text
                >
                <div
                  v-if="blueprint.type === 'uploaded'"
                  class="blueprint-stats"
                >
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
                  :icon="Edit"
                  @click="handleEdit(blueprint)"
                >
                  编辑
                </el-button>
                <el-button
                  size="small"
                  :icon="Upload"
                  @click="handleReupload(blueprint)"
                >
                  重新上传
                </el-button>
                <el-button
                  size="small"
                  :icon="Share"
                  @click="handleShare(blueprint)"
                >
                  分享
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 使用指南 -->
      <div class="guide-section">
        <el-card class="guide-card">
          <template #header>
            <h3 style="margin: 0">使用指南</h3>
          </template>
          <div class="guide-content">
            <div class="guide-item">
              <h4>如何上传蓝图？</h4>
              <p>
                点击页面上方的"上传蓝图"按钮，选择你要上传的蓝图文件或创建新蓝图。
              </p>
            </div>
            <div class="guide-item">
              <h4>如何编辑蓝图？</h4>
              <p>在蓝图卡片下方点击"编辑"按钮，进入蓝图编辑器修改你的布局。</p>
            </div>
            <div class="guide-item">
              <h4>如何分享蓝图？</h4>
              <p>在蓝图卡片下方点击"分享"按钮，生成分享链接或二维码。</p>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
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

.blueprint-tags {
  display: flex;
  gap: 8px;
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

.blueprint-stats {
  margin-top: 5px;
}

.blueprint-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

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

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-placeholder);
  text-align: center;
}

.action-filter-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.action-section {
  display: flex;
  gap: 10px;
}

.filter-section {
  display: flex;
  gap: 10px;
}

.guide-section {
  margin-bottom: 30px;
}

.guide-card {
  background-color: var(--sim-color-primary-bg);
}

.stats-card {
  margin-bottom: 15px;
}

.guide-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.guide-item h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.guide-item p {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
