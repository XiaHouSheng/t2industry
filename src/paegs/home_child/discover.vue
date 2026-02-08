<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Share,
  View,
  Link,
  Loading,
  Upload,
} from "@element-plus/icons-vue";
import { toast } from "../../components/ui/wrapper-v1/toast";
import { useHomeStore } from "../../stores/HomeStore";
import { Pagination } from "../../components/ui/wrapper-v1/pagination/index.js";
import { BlueprintCard } from "../../components/ui/wrapper-v1/card/index.js";
import { SearchFilter } from "../../components/ui/wrapper-v1/search/index.js";

// 使用HomeStore
const homeStore = useHomeStore();
const router = useRouter();

// 地区筛选选项
const areas = ref(["四号谷地", "武陵"]);

// 从store获取状态
const blueprints = computed(() => homeStore.discoverBlueprints);
const total = computed(() => homeStore.total);

const currentPage = computed({
  get: () => homeStore.currentPage,
  set: (value) => homeStore.setSearchFilters({ page: value }),
});
const pageSize = computed({
  get: () => homeStore.pageSize,
  set: (value) => homeStore.setSearchFilters({ pageSize: value }),
});

const searchQuery = computed({
  get: () => homeStore.searchQuery,
  set: (value) => homeStore.setSearchFilters({ search: value }),
});
const selectedArea = computed({
  get: () => homeStore.selectedArea,
  set: (value) => homeStore.setSearchFilters({ area: value }),
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
  console.log("size", size);
  homeStore.setSearchFilters({ pageSize: size });
  homeStore.loadDiscoverBlueprints(1);
};

// 分享蓝图
const handleShare = async (blueprint) => {
  try {
    //console.log("分享蓝图:", blueprint);
    // 实际项目中可以调用分享API
  } catch (err) {
    console.error("分享蓝图失败:", err);
  }
};

// 查看蓝图
const handleView = async (blueprint) => {
  try {
    //console.log("查看蓝图:", blueprint);
    if (blueprint.fileHash) {
      //这里是为了浏览量的增加，实际信息不需要使用
      homeStore.getBlueprintById(blueprint.id);
      // 有fileHash，跳转到带hash的editor页面
      router.push(`/editor/${blueprint.fileHash}`);
    } else {
      // 没有fileHash，跳转到editor页面
      toast.warning("该蓝图缺少文件哈希，无法直接查看");
    }
  } catch (err) {
    console.error("查看蓝图失败:", err);
    toast.error("操作失败，请重试");
  }
};

// 跳转到B站
const handleBilibili = (blueprint) => {
  //console.log("跳转到B站:", blueprint);
};

// 格式化时间为 y-m-d 格式
const formatDate = (dateString) => {
  if (!dateString) return "未知时间";
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  } catch (err) {
    return "未知时间";
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
      <SearchFilter
        v-model:search-query="searchQuery"
        v-model:selected-area="selectedArea"
        :areas="areas"
        @search="handleSearchChange"
        class="mx-6 mt-6"
      />

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="mb-4 mx-6 mt-6"
      >
        <template #default>
          <el-button type="primary" size="small" @click="loadBlueprints"
            >重试</el-button
          >
        </template>
      </el-alert>

      <div class="blueprint-section mx-6 mt-6 mb-6">
        <div class="blueprint-grid">
          <BlueprintCard
            v-for="blueprint in blueprints"
            :key="blueprint.id"
            :blueprint="blueprint"
            :loading="loading"
            @view="handleView"
            @share="handleShare"
            @bilibili="handleBilibili"
          />
        </div>

        <div v-if="!loading && blueprints.length === 0" class="empty-state">
          <div class="text-center py-12">
            <div class="text-gray-500 text-lg">暂无符合条件的蓝图</div>
          </div>
        </div>

        <div v-if="!loading && total > 0" class="pagination-container">
          <Pagination
            :current-page="currentPage"
            :page-size="pageSize"
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
.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.pagination-container {
  margin-top: auto;
  margin-bottom: 20px;
  padding: 15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
}
</style>
