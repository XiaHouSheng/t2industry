<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Search, Share, View, Link, Loading, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import apiClient from "../../utils/api-client";
import { useHomeStore } from "../../stores/HomeStore";

// 使用HomeStore
const homeStore = useHomeStore();
const router = useRouter();

// 地区筛选选项
const areas = ref(["", "四号谷地", "武陵"]);

// 从store获取状态
const blueprints = computed(() => homeStore.discoverBlueprints);
const total = computed(() => homeStore.total);
const currentPage = computed({
  get: () => homeStore.currentPage,
  set: (value) => homeStore.setSearchFilters({ page: value })
});
const pageSize = computed({
  get: () => homeStore.pageSize,
  set: (value) => homeStore.setSearchFilters({ pageSize: value })
});
const searchQuery = computed({
  get: () => homeStore.searchQuery,
  set: (value) => homeStore.setSearchFilters({ search: value })
});
const selectedArea = computed({
  get: () => homeStore.selectedArea,
  set: (value) => homeStore.setSearchFilters({ area: value })
});
const loading = computed(() => homeStore.loading.discover);
const error = computed(() => homeStore.error);

// 处理页码变化
const handlePageChange = (page) => {
  homeStore.loadDiscoverBlueprints(page);
};

// 处理搜索和筛选变化
const handleSearchChange = () => {
  // 重置到第一页
  homeStore.loadDiscoverBlueprints(1);
};

// 处理每页大小变化
const handleSizeChange = (size) => {
  homeStore.setSearchFilters({ pageSize: size });
  homeStore.loadDiscoverBlueprints(1);
};

// 分享蓝图
const handleShare = async (blueprint) => {
  try {
    //console.log("分享蓝图:", blueprint);
    // 实际项目中可以调用分享API
  } catch (err) {
    console.error('分享蓝图失败:', err);
  }
};

// 查看蓝图
const handleView = async (blueprint) => {
  try {
    //console.log("查看蓝图:", blueprint);
    if (blueprint.fileHash) {
      // 有fileHash，跳转到带hash的editor页面
      router.push(`/editor/${blueprint.fileHash}`);
    } else {
      // 没有fileHash，跳转到editor页面
      ElMessage.warning('该蓝图缺少文件哈希，无法直接查看');
    }
  } catch (err) {
    console.error('查看蓝图失败:', err);
    ElMessage.error('操作失败，请重试');
  }
};

// 跳转到B站
const handleBilibili = (blueprint) => {
  //console.log("跳转到B站:", blueprint);
};

// 格式化时间为 y-m-d 格式
const formatDate = (dateString) => {
  if (!dateString) return '未知时间';
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (err) {
    return '未知时间';
  }
};

// 重新上传蓝图
const handleReupload = async (blueprint) => {
  try {
    // 检查是否登录
    if (!homeStore.userInfo.isLoggedIn) {
      ElMessage.warning('请先登录后再重新上传蓝图');
      return;
    }
    
    // 检查是否是用户自己的蓝图
    if (!blueprint.creator || blueprint.creator.id !== homeStore.userInfo.id) {
      ElMessage.warning('只能重新上传自己的蓝图');
      return;
    }
    
    // 创建文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // 蓝图文件的扩展名是.json
    
    // 监听文件选择事件
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        // 显示加载状态
        blueprint.uploading = true;
        
        // 调用API上传蓝图文件
        await apiClient.uploadBlueprint(blueprint.id, file);
        
        // 上传成功，重新加载蓝图列表
        await loadBlueprints();
        
        // 显示成功提示
        ElMessage.success('蓝图重新上传成功');
      } catch (err) {
        // 显示失败提示
        ElMessage.error(err.message || '蓝图重新上传失败');
        console.error('蓝图重新上传失败:', err);
      } finally {
        // 隐藏加载状态
        blueprint.uploading = false;
      }
    };
    
    // 触发文件选择对话框
    fileInput.click();
  } catch (err) {
    console.error("重新上传蓝图失败:", err);
    ElMessage.error('操作失败，请重试');
  }
};

// 页面加载时获取数据
onMounted(() => {
  homeStore.loadDiscoverBlueprints(1);
});
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
              @input="handleSearchChange"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="selectedArea"
              placeholder="按地区筛选"
              style="width: 100%"
              @change="handleSearchChange"
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

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="mb-4"
      >
        <template #default>
          <el-button type="primary" size="small" @click="loadBlueprints">重试</el-button>
        </template>
      </el-alert>

      <!-- 蓝图列表 -->
      <div class="blueprint-section">
        
        <el-skeleton :loading="loading" animated>
          <template #template>
            <div class="blueprint-grid">
              <el-card class="blueprint-card" v-for="i in 8" :key="i">
                <template #header>
                  <div class="blueprint-header">
                    <el-skeleton-item variant="text" style="width: 150px; height: 20px;" />
                    <el-skeleton-item variant="text" style="width: 60px; height: 20px;" />
                  </div>
                </template>
                <div class="blueprint-content">
                  <el-skeleton-item variant="text" style="width: 100%; height: 16px; margin-bottom: 8px;" />
                  <el-skeleton-item variant="text" style="width: 100%; height: 16px; margin-bottom: 8px;" />
                  <el-skeleton-item variant="text" style="width: 80%; height: 16px; margin-bottom: 16px;" />
                  <div class="author-info">
                    <el-skeleton-item variant="circle" style="width: 24px; height: 24px;" />
                    <el-skeleton-item variant="text" style="width: 100px; height: 16px; margin-left: 8px;" />
                  </div>
                  <el-skeleton-item variant="text" style="width: 120px; height: 16px; margin-top: 8px;" />
                  <el-skeleton-item variant="text" style="width: 100px; height: 16px; margin-top: 8px;" />
                  <div class="blueprint-actions">
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                  </div>
                </div>
              </el-card>
            </div>
          </template>
          <div class="blueprint-grid" v-if="!loading && blueprints.length > 0">
            <el-card
              v-for="blueprint in blueprints"
              :key="blueprint.id"
              class="blueprint-card"
            >
              <template #header>
                <div class="blueprint-header">
                  <h4>{{ blueprint.name || '未命名蓝图' }}</h4>
                  <el-tag size="small" type="warning">{{
                    blueprint.area || '未知地区'
                  }}</el-tag>
                </div>
              </template>
              <div class="blueprint-content">
                <div class="blueprint-description">
                  {{ blueprint.description || '暂无描述' }}
                </div>
                <div class="blueprint-meta">
                  <div class="author-info">
                    <el-avatar :size="24">{{ blueprint.creator?.name?.charAt(0) || '用户' }}</el-avatar>
                    <el-text size="small" style="margin-left: 8px">{{
                      blueprint.creator?.name || '未知作者'
                    }}</el-text>
                  </div>
                  <el-text size="small"
                    >上传时间: {{ formatDate(blueprint.createdAt) }}</el-text
                  >
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
          <div v-else-if="!loading && blueprints.length === 0" class="empty-state">
            <el-empty description="暂无符合条件的蓝图" />
          </div>
        </el-skeleton>
        
        <!-- 分页组件 -->
        <div v-if="!loading && total > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
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

.pagination-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  position: sticky;
  bottom: 0;
  z-index: 10;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 15px;
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
  margin-top: 8px;
}

.blueprint-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.search-filter-section {
  margin: 20px 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
}
</style>
