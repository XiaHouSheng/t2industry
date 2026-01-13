<template>
  <!--这个是框选的Dialog-->
  <el-popconfirm
    title="确认删除当前框选的所有传送带？"
    :visible="selectStore.showSelectMenu"
    placement="right-end"
    @cancel="selectStore.hideSelectorAMenu"
    @confirm="selectStore.confirmDelete"
    @hide="selectStore.handleMenuHide"
  >
    <template #reference>
      <div
        class="selection-box"
        v-show="selectStore.showSelect"
        @mousedown="selectStore.handleMouseDown"
        @mousemove="selectStore.handleMouseMove"
        @mouseup="selectStore.handleMouseUp"
      ></div>
    </template>
  </el-popconfirm>

  <!--这个是配平配置的Dialog-->
  <el-dialog
    v-model="rootStore.isRecipeChoose"
    width="50%"
    @close="rootStore.handleDialogRecipeClose"
    :append-to-body="true"
  >
    <div style="height: 60%">
      <RecipeContent></RecipeContent>
    </div>
  </el-dialog>

  <!--这个是取货口配置的Dialog-->
  <el-dialog
    v-model="rootStore.isWareHouseRecipeChoose"
    width="50%"
    @close="rootStore.handleDialogRecipeClose"
    :append-to-body="true"
  >
    <WareHouseContent></WareHouseContent>
  </el-dialog>

  <!--这个是蓝图导入的Dialog-->
  <el-dialog
    v-model="rootStore.isBluePrintImport"
    width="50%"
    @close="rootStore.handleDialogRecipeClose"
    :append-to-body="true"
  >
    <el-upload
      drag
      accept=".json,application/json"
      :on-change="rootStore.handleBluePrintUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖动蓝图文件到此处 <em>或者点击上传</em>
      </div>
    </el-upload>
  </el-dialog>

  <el-row :gutter="6">
    <el-col :span="4">
      <div class="display-flex flex-direation-col sheng-cont-list sidebar">
        <div
          data-gs-widget='{"w":3, "h":1, "noResize":true, "id":"warehouseWithdrawalPort"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">仓库取货口</span>
            </div>
          </div>
        </div>

        <div
          data-gs-widget='{"w":3, "h":1, "noResize":true, "id":"warehouseDepositPort"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">仓库取货口</span>
            </div>
          </div>
        </div>

        <div
          v-for="machine in MachineData"
          :data-gs-widget="gridStackDataProcess(machine)"
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div
              style="
                width: 35px;
                height: 35px;
                background-size: 420px auto;
                margin-left: 6px;
              "
              :style="iconStyle(machine.icon, 35)"
            ></div>
          </div>

          <div class="display-flex flex-direation-col justify-content-center">
            <span style="font-size: 14px">{{ machine.name }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="display-flex flex-direation-row sheng-tool-bar-cont">
        <div class="sheng-tool-bar display-flex flex-direaiton-row">
          <!--电量显示
          <div
            style="width: 180px; height: 100%; background-color: #ffffff"
            class="sheng-test-border"
          >
            <div
              class="display-flex flex-direation-col"
              style="height: 100%; padding: 3px 12px 3px 12px"
            >
              <div class="display-flex flex-direation-row">
                <div
                  class="display-flex flex-direation-col justify-content-center"
                >
                  <img
                    src="@/assets/svg/bleeze.svg"
                    style="width: 14px; height: 14px"
                  />
                </div>

                <el-text size="small" :truncated="true">电力负载：</el-text
                ><el-text size="small" :truncated="true">3000/3000W</el-text>
              </div>
              <div>
                <el-progress
                  :percentage="50"
                  :text-inside="true"
                  style="width: 100%"
                />
              </div>
            </div>
          </div>
          -->
          <!--工具栏-->
          <el-radio-group
            v-model="rootStore.toolbarMode"
            size="default"
            @change="rootStore.handleBeltModeChange"
            class="toolbar-section"
          >
            <el-radio-button label="多带" value="belts" />
            <el-radio-button label="框选" value="select" />
            <el-radio-button label="无" value="default" />
          </el-radio-group>
          
          <!--便捷放置-->
          <el-radio-group
            v-model="rootStore.toolbarMode"
            size="default"
            class="toolbar-section"
          >
            <el-radio-button label="转弯带" value="turn">
              <template #default>
                <div class="toolbar-icon-wrapper">
                  <img
                    src="@/assets/img/turn.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-radio-button>
            <el-radio-button label="带" value="belt">
              <template #default>
                <div class="toolbar-icon-wrapper">
                  <img
                    src="@/assets/img/belt.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-radio-button>
            <el-radio-button label="一分三" value="splitter">
              <template #default>
                <div class="toolbar-icon-wrapper">
                  <img
                    src="@/assets/img/one_to_three.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-radio-button>
            <el-radio-button label="三合一" value="conveyer">
              <template #default>
                <div class="toolbar-icon-wrapper">
                  <img
                    src="@/assets/img/three_to_one.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-radio-button>
            <el-radio-button label="桥" value="cross">
              <template #default>
                <div class="toolbar-icon-wrapper">
                  <img
                    src="@/assets/img/cross.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-radio-button>
          </el-radio-group>
          <!--关联蓝图设置
          <div
            style="
              width: auto;
              height: 100%;
              background-color: #ffffff;
              overflow: hidden;
            "
          >
            <el-dropdown trigger="click">
              <el-button type="primary">
                蓝图关联<el-icon class="el-icon--right"
                  ><arrow-down
                /></el-icon>
              </el-button>
              <template #dropdown>
                <div class="display-flex flex-direation-col" style="padding: 6px">
                    <el-checkbox label="xxx-发电模块" value="Value A" />
                    <el-checkbox label="xxx-冶炼模块" value="Value B" />
                    <el-checkbox label="xxx-制造模块" value="Value C" />
                    <el-checkbox label="xxx-制造模块" value="Value C" />
                </div>
              </template>
            </el-dropdown>
          </div>
          -->
          <!--图层查看
          <div
            style="
              width: auto;
              height: 100%;
              background-color: #ffffff;
              overflow: hidden;
            "
          >
            <el-dropdown trigger="click">
              <el-button type="primary">
                图层设置<el-icon class="el-icon--right"
                  ><arrow-down
                /></el-icon>
              </el-button>
              <template #dropdown>
                <div class="display-flex flex-direation-col" style="padding: 6px">
                    <el-checkbox label="机器" value="Value A" />
                    <el-checkbox label="传送带" value="Value B" />
                    <el-checkbox label="管道" value="Value C" />
                    <el-checkbox label="电力" value="Value C" />
                </div>
              </template>
            </el-dropdown>
          </div>
          -->
          <!--蓝图存储相关-->
          <el-button-group style="overflow: hidden">
            <el-button @click="rootStore.saveBluePrint" primary>
              <template #icon>
                <div>
                  <img
                    src="@/assets/img/save.png"
                    style="width: 18px; height: 18px"
                  />
                </div>
              </template>
            </el-button>
            <el-button @click="rootStore.handleBluePrintImportDialog" primary>
              <img
                src="@/assets/img/import.png"
                style="width: 18px; height: 18px"
              />
            </el-button>
            <el-button @click="rootStore.exportBluePrint" primary>
              <img
                src="@/assets/img/export.png"
                style="width: 18px; height: 18px"
              />
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div
        class="sheng-cont-grid"
        @wheel="rootStore.handleScalingChange_"
        @contextmenu="rootStore.handleRightClick"
        @mousedown="selectStore.handleMouseDown"
        @mousemove="selectStore.handleMouseMove"
        @mouseup="selectStore.handleMouseUp"
      >
        <div
          @click="rootStore.handleLeftClick"
          ref="targetGrid"
          id="grid-stack"
          class="grid-stack"
        ></div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  onMounted,
  nextTick,
  createVNode,
  render,
  getCurrentInstance,
  markRaw,
  ref,
} from "vue";
import { GridStack } from "gridstack";
import { useRootStore } from "../stores/SimStore";
import { useSelectStore } from "../stores/SelectStore";
import { machineComponentMap } from "../utils/MachineMap";
import RecipeContent from "../components/original/RecipeContent.vue";
import WareHouseContent from "../components/original/WareHouseContent.vue";
import { MachineData, iconStyle, gridStackDataProcess } from "../utils/DataMap";
import "gridstack/dist/gridstack.min.css";
const { appContext } = getCurrentInstance();
const rootStore = useRootStore();
const selectStore = useSelectStore();

const testRef = ref(null);

onMounted(async () => {
  await nextTick();
  //初始化
  const targetGridEl = document.querySelector("#grid-stack");
  const targetGridCont = document.querySelector(".sheng-cont-grid");
  const selector = document.querySelector(".selection-box");
  selectStore.initSelector(selector);
  rootStore.initGrid(targetGridEl, targetGridCont, appContext);
  //拖拽克隆
  const selfClone = (element) => {
    const cloneNode = element.cloneNode(true);
    cloneNode.replaceChildren(); // 清空内容，仅做视觉 clone
    cloneNode.classList.remove("sheng-cont-item", "sheng-cont-item-spec");
    const elConfig = JSON.parse(cloneNode.getAttribute("data-gs-widget")); // 读取配置
    const rootId = elConfig.id;
    const gsId = `${rootId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    elConfig.id = gsId;
    cloneNode.setAttribute("data-gs-widget", JSON.stringify(elConfig));
    return cloneNode;
  };
  //添加回调
  rootStore.rootGrid.on("added", function (event, items) {
    const item = items[0];
    const el = item.el;

    if (!el.classList.contains("sidebar-item")) return;

    const rootId = item.id.split("_")[0];
    // 存入 store
    rootStore.gridWidgets[item.id] = { rotate: 0, recipe: "" };
    rootStore.gridWidgetElements[item.id] = el;
    // 渲染 Vue 组件
    const vnode = createVNode(machineComponentMap[rootId], {
      gs_id: item.id,
      el_name: rootId,
      el_size: { w: item.w, h: item.h },
    });
    vnode.appContext = appContext;
    render(vnode, el);
  });
  //拖拽设置
  GridStack.setupDragIn(".sidebar-item", { helper: selfClone });
});
</script>

<style scoped>
.sheng-cont-grid {
  overflow: scroll;
  height: var(--sheng-self-simulation-grid-height);
  background-color: #f5f7fa;
  border-radius: 4px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.sheng-test-border {
  border: 1px dashed #409eff;
  box-sizing: border-box;
}

.sheng-cont-list {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.08);
  overflow-y: scroll;
  height: var(--sheng-self-simulation-list-height);
  background-color: #ffffff;
  padding: 12px;
  gap: 8px;
  border-radius: 0 4px 4px 0;
}

.sheng-cont-item {
  min-height: 56px;
  overflow: hidden;
  transition: all 0.2s ease;
  color: #333333;
  background-color: #f9fafc;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  gap: 12px;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}

.sheng-cont-item:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #c6e2ff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
  transform: translateX(2px);
}

.sheng-item--active {
  background: #ecf5ff;
  border: 1px solid #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.selection-box {
  position: fixed;
  z-index: 999;
  border: 2px dashed #409eff;
  border-radius: 4px;
  background-color: rgba(64, 158, 255, 0.1);
}

.grid-stack {
  background-color: var(--sheng-grid-bg);
  background-size: calc(100% / 72) calc(100% / 72);
  background-image: linear-gradient(
      to right,
      var(--sheng-grid-line) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, var(--sheng-grid-line) 1px, transparent 1px);
}

:deep(.grid-stack-item) {
  text-align: center;
  border: 1px dashed var(--sheng-grid-item-outline);
  box-sizing: border-box;
  border-radius: 4px;
  transition: all 0.2s ease;
}

:deep(.grid-stack-item:hover) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.sheng-tool-bar {
  width: 100%;
  height: 40px;
  gap: 8px;
  align-items: center;
  padding: 0 12px;
}

.sheng-tool-bar-cont {
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 4px 4px 0 0;
}

.toolbar-section {
  margin-right: 12px;
  border-radius: 4px;
  padding: 0;
}

.toolbar-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* 工具栏按钮样式优化 */
:deep(.el-radio-group) {
  margin-right: 12px;
}

:deep(.el-radio-button__inner) {
  border-radius: 2px;
  margin-right: 0;
  padding: 6px 10px;
  transition: all 0.2s ease;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 2px 0 0 2px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 2px 2px 0;
}

:deep(.el-radio-button .toolbar-icon-wrapper) {
  margin: 0 auto;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: none;
}

:deep(.el-radio-button__inner:hover) {
  border-color: #c6e2ff;
}

:deep(.el-button-group) {
  margin-left: auto;
  border-radius: 2px;
  padding: 0;
}

:deep(.el-button) {
  border-radius: 2px;
  transition: all 0.2s ease;
  margin: 0;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
}

:deep(.el-button:hover) {
  border-color: #c6e2ff;
  color: #409eff;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
  color: #ffffff;
}

/* 滚动条样式优化 */
.sheng-cont-list::-webkit-scrollbar,
.sheng-cont-grid::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.sheng-cont-list::-webkit-scrollbar-track,
.sheng-cont-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.sheng-cont-list::-webkit-scrollbar-thumb,
.sheng-cont-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.sheng-cont-list::-webkit-scrollbar-thumb:hover,
.sheng-cont-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .sheng-cont-item {
    min-height: 48px;
    padding: 6px 10px;
  }
  
  .sheng-tool-bar {
    height: auto;
    flex-wrap: wrap;
    padding: 8px;
  }
}
</style>
