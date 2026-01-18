<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Edit, Upload, Share, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useHomeStore } from "../../stores/HomeStore";
import apiClient from "../../utils/api-client";

const homeStore = useHomeStore();
const router = useRouter();

// 地区筛选
const selectedArea = ref("");
const areas = ref(["", "四号谷地", "武陵"]);

// 本地蓝图数据
const localBlueprints = ref([
  {
    id: 1,
    name: "本地蓝图",
    description: "本地保存的蓝图",
    createdAt: "2026-01-10",
    lastEdited: "2026-01-12",
    area: "四号谷地/",
    thumbnail: "#",
    type: "local",
  },
]);

// 上传蓝图对话框
const uploadDialogVisible = ref(false);
const uploadForm = ref({
  name: '',
  description: '',
  area: '',
  file: null
});

// 删除确认对话框
const deleteDialogVisible = ref(false);
const currentBlueprint = ref(null);
const uploadFormRules = {
  name: [
    { required: true, message: '请输入蓝图名称', trigger: 'blur' },
    { min: 1, max: 50, message: '名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入蓝图描述', trigger: 'blur' },
    { min: 1, max: 200, message: '描述长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请选择地区', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请选择蓝图文件', trigger: 'change' }
  ]
};
const uploadFormRef = ref(null);
const uploadLoading = ref(false);

// 合并蓝图列表（本地蓝图在前，上传蓝图在后）
const allBlueprints = computed(() => {
  if (!homeStore.userInfo.isLoggedIn) {
    return localBlueprints.value;
  }
  return [
    ...localBlueprints.value,
    ...homeStore.allBlueprints
  ];
});

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
const handleEdit = async (blueprint) => {
  try {
    //console.log(blueprint)
    if (!blueprint.fileHash) {
      // 没有fileHash，是本地蓝图，跳转到editor页面
      router.push('/editor');
    } else {
      // 有fileHash，是已上传蓝图，跳转到带hash的editor页面
      router.push(`/editor/${blueprint.fileHash}`);
    }
  } catch (err) {
    console.error("编辑蓝图失败:", err);
    ElMessage.error('操作失败，请重试');
  }
};

// 重新上传蓝图
const handleReupload = async (blueprint) => {
  try {
    if (!blueprint.fileHash) {
      // 没有fileHash，是本地蓝图，提示用户
      ElMessage.warning('本地蓝图不需要重新上传');
      return;
    }
    
    // 创建文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // 假设蓝图文件的扩展名是.json
    
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
        await homeStore.loadBlueprints();
        
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

// 分享蓝图
const handleShare = async (blueprint) => {
  try {
    if (!blueprint.fileHash) {
      // 没有fileHash，是本地蓝图，提示用户
      ElMessage.warning('本地蓝图无法分享');
      return;
    }
    
    //console.log("分享蓝图:", blueprint);
    // 这里可以添加分享蓝图的逻辑
  } catch (err) {
    console.error("分享蓝图失败:", err);
    ElMessage.error('操作失败，请重试');
  }
};

// 打开删除确认对话框
const handleDelete = (blueprint) => {
  currentBlueprint.value = blueprint;
  deleteDialogVisible.value = true;
};

// 确认删除蓝图
const confirmDelete = async () => {
  if (!currentBlueprint.value) return;
  
  try {
    // 调用API删除蓝图
    await apiClient.deleteBlueprint(currentBlueprint.value.id);
    
    // 删除成功，重新加载蓝图列表
    await homeStore.loadBlueprints();
    
    // 关闭对话框
    deleteDialogVisible.value = false;
    currentBlueprint.value = null;
    
    // 显示成功提示
    ElMessage.success('蓝图删除成功');
  } catch (err) {
    // 显示失败提示
    ElMessage.error(err.message || '蓝图删除失败');
    console.error('蓝图删除失败:', err);
  }
};

// 取消删除
const cancelDelete = () => {
  deleteDialogVisible.value = false;
  currentBlueprint.value = null;
};

// 上传蓝图（合并创建和导入功能）
const handleUploadBlueprint = () => {
  if (!homeStore.userInfo.isLoggedIn) {
    // 未登录时提示登录
    ElMessage.warning('请先登录后再上传蓝图');
    return;
  }
  // 重置表单
  uploadForm.value = {
    name: '',
    description: '',
    area: '',
    file: null
  };
  // 打开上传对话框
  uploadDialogVisible.value = true;
};

// 获取统计信息
const totalBlueprints = computed(() => allBlueprints.value.length);
const uploadedBlueprintsCount = computed(() => {
  if (!homeStore.userInfo.isLoggedIn) {
    return 0;
  }
  return homeStore.allBlueprints.length;
});

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

// 格式化时间为 y-m-d 格式
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (err) {
    return '未知';
  }
};

// 处理文件选择
const handleFileChange = (file) => {
  if (file) {
    uploadForm.value.file = file.raw;
  } else {
    uploadForm.value.file = null;
  }
};

// 提交上传表单
const submitUploadForm = async () => {
  if (!uploadFormRef.value) return;
  
  try {
    // 验证表单
    await uploadFormRef.value.validate();
    
    uploadLoading.value = true;
    
    // 首先创建蓝图记录
    const blueprintData = {
      name: uploadForm.value.name,
      description: uploadForm.value.description,
      area: uploadForm.value.area
    };
    
    const blueprintResponse = await apiClient.createBlueprint(blueprintData);
    const blueprintId = blueprintResponse.data.id;
    //console.log(blueprintResponse)
    // 然后上传蓝图文件
    await apiClient.uploadBlueprint(blueprintId, uploadForm.value.file);
    
    // 上传成功，重新加载蓝图列表
    await homeStore.loadBlueprints();
    
    // 关闭对话框
    uploadDialogVisible.value = false;
    
    // 显示成功提示
    ElMessage.success('蓝图上传成功');
  } catch (err) {
    // 显示失败提示
    ElMessage.error(err.message || '蓝图上传失败');
    console.error('蓝图上传失败:', err);
  } finally {
    uploadLoading.value = false;
  }
};

// 取消上传
const cancelUpload = () => {
  uploadDialogVisible.value = false;
  // 重置表单
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields();
  }
};

// 初始化
const init = async () => {
  if (homeStore.userInfo.isLoggedIn) {
    // 只有当allBlueprints为空时才加载数据，否则直接使用已加载的数据
    if (!Array.isArray(homeStore.allBlueprints) || homeStore.allBlueprints.length === 0) {
      await homeStore.loadBlueprints();
    }
  }
};

// 分页大小变化处理
const handleSizeChange = async (size) => {
  await homeStore.loadBlueprints({ limit: size, page: 1 });
};

// 页码变化处理
const handleCurrentChange = async (current) => {
  await homeStore.loadBlueprints({ page: current });
};

// 初始化时加载数据
onMounted(() => {
  init();
});
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <!-- 未登录提示 -->
      <el-alert
        v-if="!homeStore.userInfo.isLoggedIn"
        title="请先登录以查看和管理您的蓝图"
        type="info"
        :closable="false"
        show-icon
        class="mb-4"
      >
        <template #default>
          <el-button type="primary" size="small" @click="$emit('openLoginDialog')">去登录</el-button>
        </template>
      </el-alert>

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
            :disabled="!homeStore.userInfo.isLoggedIn"
            :loading="homeStore.loading.blueprints"
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
        <el-skeleton :loading="homeStore.loading.blueprints" animated>
          <template #template>
            <div class="blueprint-grid">
              <el-card class="blueprint-card" v-for="i in 3" :key="i">
                <template #header>
                  <div class="blueprint-header">
                    <el-skeleton-item variant="text" style="width: 150px; height: 20px;" />
                    <div class="blueprint-tags">
                      <el-skeleton-item variant="text" style="width: 60px; height: 20px;" />
                      <el-skeleton-item variant="text" style="width: 60px; height: 20px;" />
                    </div>
                  </div>
                </template>
                <div class="blueprint-content">
                  <el-skeleton-item variant="text" style="width: 100%; height: 16px; margin-bottom: 8px;" />
                  <el-skeleton-item variant="text" style="width: 100%; height: 16px; margin-bottom: 8px;" />
                  <el-skeleton-item variant="text" style="width: 80%; height: 16px; margin-bottom: 16px;" />
                  <el-skeleton-item variant="text" style="width: 120px; height: 16px; margin-bottom: 5px;" />
                  <el-skeleton-item variant="text" style="width: 120px; height: 16px; margin-bottom: 5px;" />
                  <el-skeleton-item variant="text" style="width: 100px; height: 16px; margin-bottom: 16px;" />
                  <div class="blueprint-actions">
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                    <el-skeleton-item variant="text" style="width: 80px; height: 32px;" />
                  </div>
                </div>
              </el-card>
            </div>
          </template>
          <div v-if="!homeStore.loading.blueprints && filteredBlueprints.length === 0" class="text-center py-8">
            <el-empty description="暂无蓝图数据" />
          </div>
          <div v-else-if="!homeStore.loading.blueprints" class="blueprint-grid">
            <el-card
              v-for="blueprint in filteredBlueprints"
              :key="blueprint.id"
              class="blueprint-card"
            >
              <template #header>
                <div class="blueprint-header">
                  <h4>{{ blueprint.name || '未命名蓝图' }}</h4>
                  <div class="blueprint-header-actions">
                    <div class="blueprint-tags">
                      <el-tag
                        size="small"
                        :type="!blueprint.fileHash ? 'info' : 'success'"
                      >
                        {{ !blueprint.fileHash ? "本地" : "已上传" }}
                      </el-tag>
                      <el-tag size="small" type="warning">{{
                        blueprint.area || '未知地区'
                      }}</el-tag>
                    </div>
                    <el-button
                      v-if="blueprint.fileHash"
                      size="small"
                      type="danger"
                      circle
                      :icon="Delete"
                      @click="handleDelete(blueprint)"
                      class="delete-button"
                    />
                  </div>
                </div>
              </template>
              <div class="blueprint-content">
                <div class="blueprint-description">
                  {{ blueprint.description || '暂无描述' }}
                </div>
                <div class="blueprint-meta">
                  <el-text size="small"
                    >创建时间: {{ formatDate(blueprint.createdAt) }}</el-text
                  >
                  <el-text size="small"
                    >最近编辑: {{ formatDate(blueprint.lastEdited) }}</el-text
                  >
                  <div class="author-info" v-if="blueprint.creator">
                    <el-avatar :size="20">{{ blueprint.creator?.name?.charAt(0) || '用户' }}</el-avatar>
                    <el-text size="small" style="margin-left: 5px">{{
                      blueprint.creator?.name || '未知作者'
                    }}</el-text>
                  </div>
                  <div
                    class="blueprint-stats"
                  >
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
                    :icon="Edit"
                    @click="handleEdit(blueprint)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    :icon="Upload"
                    @click="handleReupload(blueprint)"
                    :loading="blueprint.uploading"
                    :disabled="!blueprint.fileHash"
                  >
                    重新上传
                  </el-button>
                  <el-button
                    size="small"
                    :icon="Share"
                    @click="handleShare(blueprint)"
                    :disabled="!blueprint.fileHash"
                  >
                    分享
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-skeleton>
      </div>

      <!-- 分页组件 -->
      <div v-if="homeStore.userInfo.isLoggedIn && homeStore.userBlueprintsTotal > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="homeStore.userBlueprintsPage"
          v-model:page-size="homeStore.userBlueprintsLimit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="homeStore.userBlueprintsTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 上传蓝图对话框 -->
      <el-dialog
        v-model="uploadDialogVisible"
        title="上传蓝图"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="uploadFormRef"
          :model="uploadForm"
          :rules="uploadFormRules"
          label-width="80px"
        >
          <el-form-item label="蓝图名称" prop="name">
            <el-input v-model="uploadForm.name" placeholder="请输入蓝图名称" />
          </el-form-item>
          <el-form-item label="蓝图描述" prop="description">
            <el-input
              v-model="uploadForm.description"
              type="textarea"
              placeholder="请输入蓝图描述"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="地区" prop="area">
            <el-select v-model="uploadForm.area" placeholder="请选择地区">
              <el-option
                v-for="area in areas"
                :key="area"
                :label="area || '全部地区'"
                :value="area"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="蓝图文件" prop="file">
            <el-upload
              class="upload-demo"
              action=""
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="1"
              :file-list="[]"
              accept=".json"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  请选择 .json 格式的文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelUpload">取消</el-button>
            <el-button type="primary" :loading="uploadLoading" @click="submitUploadForm">
              上传
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 删除确认对话框 -->
      <el-dialog
        v-model="deleteDialogVisible"
        title="确认删除"
        width="400px"
        :close-on-click-modal="false"
      >
        <p>您确定要删除蓝图 "{{ currentBlueprint?.name || '未命名蓝图' }}" 吗？此操作不可撤销。</p>
        <template #footer>
          <span>
            <el-button @click="cancelDelete">取消</el-button>
            <el-button type="danger" @click="confirmDelete">确认删除</el-button>
          </span>
        </template>
      </el-dialog>

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
  margin-bottom: 12px;
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
  border: 1px solid #dcdfe6;
  transition: border-color 0.3s ease;
}

.blueprint-card:hover {
  border-color: #409eff;
}

.blueprint-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.blueprint-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delete-button {
  margin-left: 5px;
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

/* 分页容器样式 */
.pagination-container {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
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
