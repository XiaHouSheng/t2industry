<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Edit, Upload, Share, Delete } from "@element-plus/icons-vue";
import toast from "../../components/ui/wrapper-v1/toast/toast.js";
import { useHomeStore } from "../../stores/HomeStore";
import apiClient from "../../utils/api-client";
import { StatsCard } from "../../components/ui/wrapper-v1/card/index.js";
import { SelfBlueprintCard } from "../../components/ui/wrapper-v1/card/index.js";
import { GuideCard } from "../../components/ui/wrapper-v1/card/index.js";
import { ActionFilter } from "../../components/ui/wrapper-v1/action/index.js";
import { Pagination } from "../../components/ui/wrapper-v1/pagination/index.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/wrapper-v1/dialog";
import { Alert } from "../../components/ui/wrapper-v1/card/index.js";

const homeStore = useHomeStore();
const router = useRouter();

// 地区筛选
const selectedArea = ref("");
const areas = ref(["四号谷地", "武陵"]);

// 本地蓝图数据
const localBlueprints = ref([
  {
    id: 1,
    name: "本地蓝图",
    description: "本地保存的蓝图",
    createdAt: "2026-01-10",
    lastEdited: "2026-01-12",
    area: "塔卫二",
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
    toast.error('操作失败，请重试');
  }
};

// 重新上传蓝图
const handleReupload = async (blueprint) => {
  try {
    if (!blueprint.fileHash) {
      // 没有fileHash，是本地蓝图，提示用户
      toast.warning('本地蓝图不需要重新上传');
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
        toast.success('蓝图重新上传成功');
      } catch (err) {
        // 显示失败提示
        toast.error(err.message || '蓝图重新上传失败');
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
    toast.error('操作失败，请重试');
  }
};

// 分享蓝图
const handleShare = async (blueprint) => {
  try {
    if (!blueprint.fileHash) {
      // 没有fileHash，是本地蓝图，提示用户
      toast.warning('本地蓝图无法分享');
      return;
    }
    
    //console.log("分享蓝图:", blueprint);
    // 这里可以添加分享蓝图的逻辑
  } catch (err) {
    console.error("分享蓝图失败:", err);
    toast.error('操作失败，请重试');
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
    toast.success('蓝图删除成功');
  } catch (err) {
    // 显示失败提示
    toast.error(err.message || '蓝图删除失败');
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
    toast.warning('请先登录后再上传蓝图');
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

// 构造统计卡片数据
const statsData = computed(() => ({
  blueprints: totalBlueprints.value,
  users: uploadedBlueprintsCount.value,
  views: areaStats.value['四号谷地'],
  downloads: areaStats.value['武陵']
}));

// 构造统计卡片标签
const statsLabels = computed(() => ({
  blueprints: '总蓝图数',
  users: '上传蓝图',
  views: '四号谷地',
  downloads: '武陵'
}));

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
    toast.success('蓝图上传成功');
  } catch (err) {
    // 显示失败提示
    toast.error(err.message || '蓝图上传失败');
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
      <Alert
        v-if="!homeStore.userInfo.isLoggedIn"
        title="请先登录以查看和管理您的蓝图"
        type="info"
        show-icon
      >
        <template #default>
          <button
            @click="$emit('openLoginDialog')"
            class="px-4 py-2 text-sm font-medium rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors"
          >
            去登录
          </button>
        </template>
      </Alert>

      <!-- 统计信息卡片 -->
      <div class="stats-section mx-6 mt-6">
        <StatsCard :stats="statsData" :labels="statsLabels" />
      </div>

      <!-- 操作按钮和地区筛选 -->
      <ActionFilter
        v-model:selected-area="selectedArea"
        :areas="areas"
        :is-logged-in="homeStore.userInfo.isLoggedIn"
        :loading="homeStore.loading.blueprints"
        @upload="handleUploadBlueprint"
        class="mx-6 mt-6"
      />

      <!-- 所有蓝图（本地在前，上传在后） -->
      <div class="blueprint-section mx-6 mt-6">
        <div v-if="filteredBlueprints.length === 0" class="text-center py-8">
          <div class="text-gray-500 text-lg">暂无蓝图数据</div>
        </div>
        <div v-else class="blueprint-grid">
          <SelfBlueprintCard
            v-for="blueprint in filteredBlueprints"
            :key="blueprint.id"
            :blueprint="blueprint"
            :loading="homeStore.loading.blueprints"
            @edit="handleEdit"
            @reupload="handleReupload"
            @share="handleShare"
            @delete="handleDelete"
          />
        </div>
      </div>

      <!-- 分页组件 -->
      <div v-if="homeStore.userInfo.isLoggedIn && homeStore.userBlueprintsTotal > 0" class="pagination-container mx-6 mt-6">
        <Pagination
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
      <Dialog v-model:open="uploadDialogVisible">
        <DialogContent max-width="max-w-md">
          <DialogHeader>
            <DialogTitle>上传蓝图</DialogTitle>
          </DialogHeader>
          <el-form
            ref="uploadFormRef"
            :model="uploadForm"
            :rules="uploadFormRules"
            label-width="80px"
            class="space-y-4"
          >
            <el-form-item label="蓝图名称" prop="name">
              <el-input
                v-model="uploadForm.name"
                placeholder="请输入蓝图名称"
                class="!bg-gray-800 !border-gray-700 !text-gray-300"
              />
            </el-form-item>
            <el-form-item label="蓝图描述" prop="description">
              <el-input
                v-model="uploadForm.description"
                type="textarea"
                placeholder="请输入蓝图描述"
                :rows="3"
                class="!bg-gray-800 !border-gray-700 !text-gray-300"
              />
            </el-form-item>
            <el-form-item label="地区" prop="area">
              <el-select
                v-model="uploadForm.area"
                placeholder="请选择地区"
                class="!bg-gray-800 !border-gray-700 !text-gray-300"
              >
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
                <button
                  type="button"
                  class="px-4 py-0.1 rounded bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors"
                >
                  选择文件
                </button>
                <template #tip>
                  <div class="el-upload__tip text-gray-400 text-sm">
                    请选择 .json 格式的文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
          <DialogFooter>
            <button
              class="px-3 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm"
              @click="cancelUpload"
            >
              取消
            </button>
            <button
              class="px-3 py-1.5 rounded bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors text-sm"
              :disabled="uploadLoading"
              @click="submitUploadForm"
            >
              {{ uploadLoading ? '上传中...' : '上传' }}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      <div class="guide-section mx-6 mt-6 mb-6">
        <GuideCard />
      </div>
      
    </el-col>
  </el-row>
</template>

<style scoped>
.blueprint-section {
  margin-bottom: 12px;
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 分页容器样式 */
.pagination-container {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: #111827;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
}



</style>
