<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
} from "../components/ui/wrapper-v1/card/index.js";
import { toast } from "../components/ui/wrapper-v1/toast/index.js";
import apiParserClient from "../utils/api-parser-client";

const selectedFile = ref(null);
const uploadLoading = ref(false);
const parseLoading = ref(false);
const resultLoading = ref(false);
const jobsLoading = ref(false);
const polling = ref(false);

const uploadData = ref(null);
const previewImageUrl = ref("");
const currentJobId = ref("");
const parseResult = ref(null);
const jobs = ref([]);
const errorMessage = ref("");

const parserStatusTextMap = {
  PARSE_WAIT: "排队中",
  PARSE_PROCESSING: "正在解析",
  PARSE_SUCCESS: "解析完成",
  PARSE_FAILED: "解析失败",
};

const canSubmitParse = computed(() => {
  return Boolean(uploadData.value?.asset_id || uploadData.value?.task_id);
});

const canQueryResult = computed(() => Boolean(currentJobId.value));

const currentStatusText = computed(() => {
  const status = parseResult.value?.status;
  if (!status) return "未开始";
  return parserStatusTextMap[status] || status;
});

const parseResultText = computed(() => {
  const result = parseResult.value?.parse_result;
  if (!result) return "";
  return typeof result === "string" ? result : JSON.stringify(result, null, 2);
});

const parseResultPayload = (rawResult) => {
  if (!rawResult) return null;

  if (typeof rawResult === "string") {
    try {
      return JSON.parse(rawResult);
    } catch (error) {
      return null;
    }
  }

  if (typeof rawResult === "object") {
    return rawResult;
  }

  return null;
};

const parsedResultObject = computed(() => {
  return parseResultPayload(parseResult.value?.parse_result);
});

const downloadFileName = ref("parser-blueprint");

const canDownloadBlueprint = computed(() => {
  const result = parsedResultObject.value;
  return Boolean(result && result.status === "success" && result.blueprint);
});

const parseBackendStatusText = (status) => {
  if (!status) return "未知";
  const map = {
    PARSE_WAIT: "排队中",
    PARSE_PROCESSING: "解析中",
    PARSE_SUCCESS: "成功",
    PARSE_FAILED: "失败",
  };
  return map[status] || status;
};

const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    apiParserClient.setToken(token);
  }
};

const clearError = () => {
  errorMessage.value = "";
};

const handleUploadChange = (file) => {
  selectedFile.value = file?.raw || null;

  if (previewImageUrl.value && previewImageUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewImageUrl.value);
  }

  previewImageUrl.value = selectedFile.value
    ? URL.createObjectURL(selectedFile.value)
    : "";

  clearError();
};

const handleUploadImage = async () => {
  if (!selectedFile.value) {
    toast.warning("先选一张截图再继续哦");
    return;
  }

  try {
    clearError();
    uploadLoading.value = true;
    setAuthToken();

    const response = await apiParserClient.uploadImage(selectedFile.value);
    uploadData.value = response.data;

    toast.success("图片上传成功，下一步可以开始解析啦");
  } catch (error) {
    errorMessage.value = error.message || "上传失败";
    toast.error(errorMessage.value);
  } finally {
    uploadLoading.value = false;
  }
};

const handleSubmitParser = async () => {
  if (!canSubmitParse.value) {
    toast.warning("请先上传图片");
    return;
  }

  try {
    clearError();
    parseLoading.value = true;
    setAuthToken();

    const response = await apiParserClient.submitParser({
      asset_id: uploadData.value.asset_id,
      task_id: uploadData.value.task_id,
    });

    currentJobId.value = response.data;
    toast.success("已开始解析，请稍等几秒");
  } catch (error) {
    errorMessage.value = error.message || "提交解析失败";
    toast.error(errorMessage.value);
  } finally {
    parseLoading.value = false;
  }
};

const handleGetParserResult = async () => {
  if (!currentJobId.value) {
    toast.warning("还没有任务ID，先开始解析吧");
    return;
  }

  try {
    clearError();
    resultLoading.value = true;
    setAuthToken();

    const response = await apiParserClient.getParserResult({
      job_id: currentJobId.value,
    });

    parseResult.value = response.data;
  } catch (error) {
    errorMessage.value = error.message || "查询解析结果失败";
    toast.error(errorMessage.value);
  } finally {
    resultLoading.value = false;
  }
};

const handlePollParserResult = async () => {
  if (!currentJobId.value) {
    toast.warning("还没有任务ID，先开始解析吧");
    return;
  }

  try {
    clearError();
    polling.value = true;
    setAuthToken();

    const response = await apiParserClient.pollParserResult(currentJobId.value, {
      interval: 1200,
      timeout: 120000,
      onProgress: (res) => {
        parseResult.value = res.data;
      },
    });

    parseResult.value = response.data;

    if (response.data?.status === "PARSE_SUCCESS") {
      toast.success("解析完成，结果已更新");
    } else {
      toast.warning("解析结束，但未成功");
    }
  } catch (error) {
    errorMessage.value = error.message || "自动查询失败";
    toast.error(errorMessage.value);
  } finally {
    polling.value = false;
  }
};

const handleUseJob = (jobId) => {
  currentJobId.value = jobId;
  toast.info("已选中历史任务");
};

const downloadBlueprintData = (sourceResult, fileName) => {
  let blueprintData = sourceResult.blueprint;
  if (typeof blueprintData === "string") {
    try {
      blueprintData = JSON.parse(blueprintData);
    } catch (error) {
      // blueprint 为普通字符串时，直接按 JSON 字符串导出
    }
  }

  const baseName = (fileName || "parser-blueprint").trim();
  const safeName = (baseName || "parser-blueprint").replace(/[\\/:*?"<>|]/g, "_");
  const finalName = safeName.endsWith(".json") ? safeName : `${safeName}.json`;

  const blob = new Blob([JSON.stringify(blueprintData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalName;
  link.click();
  URL.revokeObjectURL(url);
};

const handleDownloadBlueprint = () => {
  const result = parsedResultObject.value;

  if (!result) {
    toast.warning("当前结果不是可下载格式");
    return;
  }

  if (result.status !== "success") {
    toast.warning(result.error || "解析未成功，无法下载蓝图");
    return;
  }

  if (!result.blueprint) {
    toast.warning("没有可下载的蓝图数据");
    return;
  }

  downloadBlueprintData(result, downloadFileName.value);
  toast.success("蓝图已下载");
};

const handleDownloadHistoryJob = (job) => {
  const parsed = parseResultPayload(job?.resultData?.parse_result);

  if (!parsed || parsed.status !== "success" || !parsed.blueprint) {
    toast.warning("该历史任务暂无可下载蓝图");
    return;
  }

  downloadBlueprintData(parsed, `${downloadFileName.value || "parser-blueprint"}-${job.jobId.slice(0, 8)}`);
  toast.success("历史蓝图已下载");
};

onUnmounted(() => {
  if (previewImageUrl.value && previewImageUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewImageUrl.value);
  }
});

const handleGetJobs = async () => {
  try {
    clearError();
    jobsLoading.value = true;
    setAuthToken();

    const response = await apiParserClient.getParserJobs();
    const jobIds = response.data?.job_ids || [];

    const settled = await Promise.allSettled(
      jobIds.map((jobId) =>
        apiParserClient.getParserResult({ job_id: jobId }),
      ),
    );

    jobs.value = jobIds.map((jobId, index) => {
      const item = settled[index];
      if (item.status === "fulfilled") {
        const resultData = item.value?.data;
        const parsed = parseResultPayload(resultData?.parse_result);
        const canDownload = Boolean(
          parsed && parsed.status === "success" && parsed.blueprint,
        );

        return {
          jobId,
          status: resultData?.status || "UNKNOWN",
          statusText: parseBackendStatusText(resultData?.status),
          canDownload,
          resultData,
        };
      }

      return {
        jobId,
        status: "UNKNOWN",
        statusText: "查询失败",
        canDownload: false,
        resultData: null,
      };
    });
  } catch (error) {
    errorMessage.value = error.message || "查询任务列表失败";
    toast.error(errorMessage.value);
  } finally {
    jobsLoading.value = false;
  }
};

onMounted(() => {
  setAuthToken();
});
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <Alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />

      <div class="mx-6 mt-6 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>蓝图截图解析</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="tips-row">
              <span class="step-chip">1. 上传截图</span>
              <span class="step-chip">2. 开始解析</span>
              <span class="step-chip">3. 查看结果</span>
            </div>
            <p class="text-gray-400 text-sm mt-2">
              给玩家用的简化流程：按顺序点按钮就行，不需要懂接口参数。
            </p>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>操作区</CardTitle>
          </CardHeader>
          <CardContent>
            <el-upload
              drag
              action=""
              :auto-upload="false"
              :show-file-list="true"
              accept="image/*"
              :on-change="handleUploadChange"
              :limit="1"
              class="w-full"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">把游戏截图拖进来，或者 <em>点击选择</em></div>
              <template #tip>
                <div class="text-gray-400 mt-2">支持 png / jpg / jpeg / webp</div>
              </template>
            </el-upload>

            <div class="action-group">
              <button
                class="primary-btn"
                :disabled="uploadLoading || !selectedFile"
                @click="handleUploadImage"
              >
                {{ uploadLoading ? "上传中..." : "上传截图" }}
              </button>

              <button
                class="primary-btn"
                :disabled="parseLoading || !canSubmitParse"
                @click="handleSubmitParser"
              >
                {{ parseLoading ? "解析提交中..." : "开始解析" }}
              </button>

              <button
                class="secondary-btn"
                :disabled="polling || !canQueryResult"
                @click="handlePollParserResult"
              >
                {{ polling ? "自动查询中..." : "自动查询结果" }}
              </button>

              <button
                class="secondary-btn"
                :disabled="resultLoading || !canQueryResult"
                @click="handleGetParserResult"
              >
                {{ resultLoading ? "查询中..." : "手动刷新结果" }}
              </button>
            </div>

            <div class="mt-4">
              <label class="block text-sm text-gray-400 mb-2">高级选项：任务ID（可不填）</label>
              <input
                v-model="currentJobId"
                type="text"
                placeholder="如果你有历史任务ID，可以填在这里"
                class="w-full px-3 py-2 rounded border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </CardContent>
        </Card>

                <Card>
          <CardHeader>
            <CardTitle>截图预览（预留）</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="image-preview-box">
              <img
                v-if="previewImageUrl || uploadData?.image_url"
                :src="previewImageUrl || uploadData?.image_url"
                alt="上传截图预览"
                class="preview-image"
              />
              <div v-else class="preview-empty">
                这里会显示你上传的截图
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>结果区</CardTitle>
          </CardHeader>

          <CardContent>
                        <div class="status-box">
              <p><span class="text-gray-400">当前状态：</span>{{ currentStatusText }}</p>
              <p><span class="text-gray-400">任务ID：</span>{{ currentJobId || "-" }}</p>
              <p><span class="text-gray-400">错误信息：</span>{{ parseResult?.error_msg || "无" }}</p>
            </div>

            <div class="download-row">
              <input
                v-model="downloadFileName"
                type="text"
                placeholder="输入下载文件名"
                class="download-name-input"
              />
              <button
                class="primary-btn"
                :disabled="!canDownloadBlueprint"
                @click="handleDownloadBlueprint"
              >
                下载蓝图JSON
              </button>
            </div>

            <el-input
              :model-value="parseResultText"
              type="textarea"
              :rows="12"
              readonly
              placeholder="解析结果会显示在这里"
            />
          </CardContent>
        </Card>
      </div>

      <div class="mx-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>历史任务</CardTitle>
          </CardHeader>
          <CardContent>
            <button class="secondary-btn" :disabled="jobsLoading" @click="handleGetJobs">
              {{ jobsLoading ? "加载中..." : "刷新历史任务" }}
            </button>

            <div class="mt-4 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                            <div
                v-for="job in jobs"
                :key="job.jobId"
                class="task-item"
              >
                <div class="task-main">
                  <span class="truncate">{{ job.jobId }}</span>
                  <span class="task-status">{{ job.statusText }}</span>
                </div>
                <div class="task-actions">
                  <button class="mini-btn" @click="handleUseJob(job.jobId)">选中</button>
                  <button
                    class="mini-btn secondary-mini-btn"
                    :disabled="!job.canDownload"
                    @click="handleDownloadHistoryJob(job)"
                  >
                    下载
                  </button>
                </div>
              </div>

              <div v-if="!jobsLoading && jobs.length === 0" class="text-sm text-gray-500 py-2">
                暂无历史任务
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  background-color: #1f2937;
  border: 1px dashed #4b5563;
  color: #d1d5db;
}

:deep(.el-upload__text) {
  color: #d1d5db;
}

:deep(.el-textarea__inner) {
  background-color: #111827;
  color: #e5e7eb;
  border: 1px solid #374151;
}

.bg-gray-850 {
  background-color: #111827;
}

.tips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #fcd34d;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.primary-btn,
.secondary-btn,
.mini-btn {
  border-radius: 6px;
  transition: all 0.2s;
}

.primary-btn {
  padding: 8px 12px;
  background: #facc15;
  color: #111827;
}

.primary-btn:hover {
  background: #fde047;
}

.secondary-btn {
  padding: 8px 12px;
  border: 1px solid #4b5563;
  background: #1f2937;
  color: #d1d5db;
}

.secondary-btn:hover {
  background: #374151;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-box {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #111827;
  color: #d1d5db;
  font-size: 14px;
}

.image-preview-box {
  width: 100%;
  height: 100%;
  min-height: 360px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-empty {
  color: #6b7280;
  font-size: 14px;
}

.task-item {

  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #111827;
  color: #d1d5db;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.task-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.task-status {
  font-size: 12px;
  color: #9ca3af;
}

.task-actions {
  display: flex;
  gap: 6px;
}

.download-row {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}


.download-name-input {
  flex: 1;
  min-width: 220px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #4b5563;
  background: #111827;
  color: #e5e7eb;
  outline: none;
}

.download-name-input:focus {
  border-color: #facc15;
  box-shadow: 0 0 0 1px #facc15;
}

.mini-btn {
  padding: 4px 8px;
  font-size: 12px;
  background: #facc15;
  color: #111827;
}

.secondary-mini-btn {
  background: #1f2937;
  border: 1px solid #4b5563;
  color: #d1d5db;
}

.secondary-mini-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mini-btn:hover {
  background: #fde047;
}

.mini-btn.secondary-mini-btn:hover {
  background: #374151;
}

</style>


  