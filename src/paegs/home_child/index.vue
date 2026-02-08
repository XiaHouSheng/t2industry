<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHomeStore } from "../../stores/HomeStore";
import toast from "../../components/ui/wrapper-v1/toast/toast.js";
import { Edit, Search, User, Setting } from "@element-plus/icons-vue";
import {
  BlueprintCard,
  QuickLinkCard,
  StatsCard,
  IntroCard,
  Alert,
} from "../../components/ui/wrapper-v1/card/index.js";
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

// 统计数据
const stats = computed(() => ({
  blueprints: totalBlueprints.value,
  users: totalUsers.value,
  views: totalViews.value,
  downloads: totalDownloads.value,
}));

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
    path: "/editor",
    description: "创建和编辑你的蓝图",
    icon: Edit,
  },
  {
    name: "发现蓝图",
    path: "/home/discover",
    description: "浏览其他玩家的蓝图",
    icon: Search,
  },
  {
    name: "个人蓝图",
    path: "/home/self",
    description: "管理你的蓝图",
    icon: User,
  },
  {
    name: "计算器",
    path: "/calculate",
    description: "物料配平计算",
    icon: Setting,
  },
];

// 处理蓝图操作
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
      <Alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        @retry="handleRetry"
      />

      <!-- 快速导航 -->
      <div class="quick-links-section mx-6 mt-6">
        <div class="quick-links-grid">
          <QuickLinkCard
            v-for="link in quickLinks"
            :key="link.name"
            :link="link"
          />
        </div>
      </div>

      <!-- 热门蓝图 -->
      <div class="blueprint-section mx-6 mt-6">
        <div class="blueprint-grid">
          <BlueprintCard
            v-for="blueprint in hotBlueprints"
            :key="blueprint.id"
            :blueprint="blueprint"
            :loading="loading"
            @view="handleView"
            @share="handleShare"
            @bilibili="handleBilibili"
          />
        </div>
        <div
          v-if="!loading && hotBlueprints.length === 0"
          class="text-center py-8"
        >
          <el-empty description="暂无热门蓝图" />
        </div>
      </div>

      <!-- 统计信息卡片 -->
      <div class="stats-section mx-6 mt-6">
        <StatsCard :loading="loading" :stats="stats" />
      </div>

      <!-- 站点介绍 -->
      <div class="intro-section mx-6 mt-6 mb-6">
        <IntroCard />
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.stats-section {
  margin-bottom: 20px;
}

.quick-links-section {
  margin-bottom: 30px;
}

.blueprint-section {
  margin-bottom: 30px;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}
</style>
