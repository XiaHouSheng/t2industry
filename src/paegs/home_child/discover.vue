<script setup>
import { ref } from "vue";
import { Search, Share, View, Link } from "@element-plus/icons-vue";

// 搜索关键字
const searchQuery = ref("");

// 地区筛选
const selectedArea = ref("");
const areas = ref(["", "四号谷地", "武陵"]);

// 模拟蓝图数据
const blueprints = ref([
  {
    id: 1,
    name: "四号谷地毕业蓝图",
    description: "四号谷地全资源高效生产布局，包含完整的资源循环系统",
    author: "XiaHouSheng",
    avatar: "user",
    area: "四号谷地",
    createdAt: "2026-01-12",
    views: 256,
    downloads: 89,
  },
  {
    id: 2,
    name: "武陵高级加工厂",
    description: "武陵地区高级资源加工优化布局，适合后期资源需求",
    author: "EndfieldMaster",
    avatar: "em",
    area: "武陵",
    createdAt: "2026-01-11",
    views: 189,
    downloads: 67,
  },
  {
    id: 3,
    name: "四号谷地基础资源生产",
    description: "四号谷地初期基础资源生产布局，适合新手玩家",
    author: "NewPlayerGuide",
    avatar: "np",
    area: "四号谷地",
    createdAt: "2026-01-10",
    views: 320,
    downloads: 120,
  },
  {
    id: 4,
    name: "武陵自动化仓储",
    description: "武陵地区自动化仓储系统，高效管理各类资源",
    author: "StorageExpert",
    avatar: "se",
    area: "武陵",
    createdAt: "2026-01-09",
    views: 156,
    downloads: 45,
  },
  {
    id: 5,
    name: "四号谷地高级精炼厂",
    description: "四号谷地高级精炼厂布局，专注于高价值资源生产",
    author: "RefineMaster",
    avatar: "rm",
    area: "四号谷地",
    createdAt: "2026-01-08",
    views: 210,
    downloads: 78,
  },
  {
    id: 6,
    name: "武陵综合生产基地",
    description: "武陵地区综合生产基地，多资源并行生产",
    author: "AllRoundPlayer",
    avatar: "ar",
    area: "武陵",
    createdAt: "2026-01-07",
    views: 178,
    downloads: 56,
  },
]);

// 分享蓝图
const handleShare = (blueprint) => {
  console.log("分享蓝图:", blueprint);
  // 这里可以添加分享蓝图的逻辑
};

// 查看蓝图
const handleView = (blueprint) => {
  console.log("查看蓝图:", blueprint);
  // 这里可以添加查看蓝图的逻辑
};

// 跳转到B站
const handleBilibili = (blueprint) => {
  console.log("跳转到B站:", blueprint);
  // 这里可以添加跳转到B站的逻辑
};
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <!-- 搜索和筛选 -->
      <div class="search-filter-section">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input
              :prefix-icon="Search"
              v-model="searchQuery"
              placeholder="输入关键字检索蓝图"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="selectedArea"
              placeholder="按地区筛选"
              style="width: 100%"
            >
              <el-option
                v-for="area in areas"
                :key="area"
                :label="area || '全部地区'"
                :value="area"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <!-- 蓝图列表 -->
      <div class="blueprint-section">
        <h3>热门蓝图</h3>
        <div class="blueprint-grid">
          <el-card
            v-for="blueprint in blueprints"
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
                <el-text size="small"
                  >上传时间: {{ blueprint.createdAt }}</el-text
                >
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
    </el-col>
  </el-row>
</template>

<style scoped>
.blueprint-section {
  margin-bottom: 30px;
}

.blueprint-section h3 {
  margin: 20px 0 15px 0;
  font-size: 18px;
  color: #333;
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
}

.blueprint-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.blueprint-description {
  margin-bottom: 15px;
  flex-grow: 1;
}

.blueprint-meta {
  margin-bottom: 15px;
  font-size: 12px;
  color: #666;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.blueprint-stats {
  margin-top: 8px;
}

.blueprint-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.search-filter-section {
  margin: 20px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
}
</style>
