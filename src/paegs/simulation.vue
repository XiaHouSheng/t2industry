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

  <el-row :gutter="6" class="container">
    <el-col :span="3">
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
                border-radius: 3px;
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
    <el-col :span="21">
      <div
        class="display-flex flex-direation-row justify-content-center sheng-tool-bar-cont"
      >
        <div class="display-flex flex-direation-col">
          <div class="sheng-tool-bar display-flex flex-direaiton-row">
            <el-radio-group
              v-model="rootStore.toolbarMode"
              size="default"
              @change="rootStore.handleBeltModeChange"
              style="overflow: hidden"
            >
              <el-radio-button label="多带" value="belts" />
              <el-radio-button label="框选" value="select" />
              <el-radio-button label="无" value="default" />
            </el-radio-group>

            <el-radio-group
              v-model="rootStore.toolbarMode"
              size="default"
              style="overflow: hidden"
            >
              <el-radio-button label="转弯带" value="turn">
                <template #default>
                  <img
                    src="@/assets/img/turn.png"
                    style="width: 18px; height: 18px"
                  />
                </template>
              </el-radio-button>
              <el-radio-button label="带" value="belt">
                <template #default>
                  <img
                    src="@/assets/img/belt.png"
                    style="width: 18px; height: 18px"
                  />
                </template>
              </el-radio-button>
              <el-radio-button label="一分三" value="splitter">
                <template #default>
                  <img
                    src="@/assets/img/one_to_three.png"
                    style="width: 18px; height: 18px"
                  />
                </template>
              </el-radio-button>
              <el-radio-button label="三合一" value="conveyer">
                <template #default>
                  <img
                    src="@/assets/img/three_to_one.png"
                    style="width: 18px; height: 18px"
                  />
                </template>
              </el-radio-button>
              <el-radio-button label="桥" value="cross">
                <template #default>
                  <img
                    src="@/assets/img/cross.png"
                    style="width: 18px; height: 18px"
                  />
                </template>
              </el-radio-button>
            </el-radio-group>

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
}
.sheng-cont-tool-bar {
  height: var(--sheng-self-simulation-list-head-height);
}

.sheng-test-border {
  border: 1px dashed #409eff;
  box-sizing: border-box;
  border-radius: 4px;
}

.sheng-cont-list {
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.08);
  overflow-y: scroll;
  height: var(--sheng-self-simulation-list-height);
  background-color: var(--sheng-sidebar-bg);
  border-radius: 3px;
  padding: 6px;
  gap: 3px;
}
.sheng-cont-item {
  min-height: 48px;
  overflow: hidden;
  transition: 0.1s;
  color: var(--sheng-item-text);
  background-color: var(--sheng-item-bg);
  border: solid 2px #323731;
  border-radius: 3px;
  box-sizing: border-box;
  gap: 12px;
}

.sheng-cont-item:hover {
  background: var(--sheng-item-hover-bg);
  color: var(--sheng-item-hover-text);
}

.sheng-item--active {
  background: var(--sheng-item-active-bg);
  border-left: 2px solid var(--sheng-item-accent);
}

.selection-box {
  position: fixed;
  z-index: 999;
  border: 2px dashed #0e0e0e;
  border-radius: 4px;
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
  border-radius: 4px;
  box-sizing: border-box; /* 确保尺寸不会被边框影响 */
}

.sheng-tool-bar {
  width: auto;
  height: 30px;
  gap: 3px;
}
.sheng-tool-bar-cont {
  width: 100%;
  padding: 5px;
  background-color: #e0e3e8; /* 浅灰色，比网格背景稍深 */
  border-bottom: 1px solid #b0b8c0; /* 可选，增加分隔感 */
  border-radius: 6px 6px 0 0;
}
</style>
