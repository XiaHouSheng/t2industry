<template>
  <!--这个是框选的Dialog-->
  <el-popconfirm
    title="确认删除当前框选的所有传送带/管道？"
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
        <!--协议核心-->
        <div
          data-gs-widget='{"w":9, "h":9, "noResize":true, "id":"protocolCore"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">协议核心</span>
            </div>
          </div>
        </div>
        <!--仓库取货口-->
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
        <!--仓库存货口-->
        <div
          data-gs-widget='{"w":3, "h":1, "noResize":true, "id":"warehouseDepositPort"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">仓库存货口</span>
            </div>
          </div>
        </div>
        <!--供电桩-->
        <div
          data-gs-widget='{"w":2, "h":2, "noResize":true, "id":"powerSupplier"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">供电桩</span>
            </div>
          </div>
        </div>
        <!--协议存储箱-->
        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"protocolStorageBox"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">协议存储箱</span>
            </div>
          </div>
        </div>
        <!--储液罐-->
        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"liquidContainer"}'
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
        >
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 3px"
          >
            <div class="display-flex flex-direation-col justify-content-center">
              <span style="font-size: 14px">储液罐</span>
            </div>
          </div>
        </div>
        <!--已有ICON的蓝图-->
        <div
          v-for="machine in MachineData"
          :data-gs-widget="gridStackDataProcess(machine)"
          class="sheng-cont-item sidebar-item display-flex flex-direation-row"
          style="position: relative"
        >
          <div
            class="sheng-cont-item-bg"
            :style="iconStyle(machine.icon, 120, '#ffffff00')"
          ></div>
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
            style="width: 180px; height: 100%; background-color: var(--el-color-white)"
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

          <!--快速放置模式-->
          <div style="margin-right: 12px">
            <el-radio-group v-model="rootStore.quickPlaceMode" size="small">
              <el-radio-button label="belt" value="belt"
                >传送带</el-radio-button
              >
              <el-radio-button label="pipe" value="pipe">管道</el-radio-button>
            </el-radio-group>
          </div>
          <!--图层设置-->
          <div style="margin-left: auto">
            <el-dropdown trigger="click">
              <el-button>
                图层设置<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <div
                  class="layer-dropdown"
                  style="border-radius: 4px; overflow: hidden"
                >
                  <div class="layer-item">
                    <span>供电范围</span>
                    <el-switch
                      v-model="rootStore.isShowSupplierExtent"
                      size="small"
                      :checked="false"
                    />
                  </div>
                  <div class="layer-item">
                    <span>传送带</span>
                    <el-switch
                      v-model="rootStore.isShowBelts"
                      size="small"
                      :checked="true"
                    />
                  </div>
                  <div class="layer-item">
                    <span>液体管口</span>
                    <el-switch
                      v-model="rootStore.isShowPipePort"
                      size="small"
                      :checked="true"
                    />
                  </div>
                </div>
              </template>
            </el-dropdown>
          </div>

          <!--模块滤镜-->
          <div style="margin-right: 12px">
            <el-dropdown trigger="click">
              <el-button>
                模块滤镜<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <div
                  class="module-filter-dropdown"
                  style="border-radius: 4px; overflow: hidden"
                >
                  <div
                    v-for="(part, index) in rootStore.parts"
                    :key="index"
                    class="layer-item"
                  >
                    <div style="flex: 1; display: flex; align-items: center">
                      <el-switch
                        v-model="part.show"
                        size="small"
                        @change="
                          (value) => rootStore.handlePartShowChange(part, value)
                        "
                      />
                      <span style="margin-left: 3px">{{ part.name }}</span>
                    </div>
                    <div class="item-actions">
                      <el-button
                        size="small"
                        icon="EditPen"
                        :type="
                          part.name === rootStore.editPartChoose
                            ? 'primary'
                            : ''
                        "
                        @click="rootStore.selectEditPart(part.name)"
                        round
                      >
                      </el-button>
                      <el-button
                        size="small"
                        icon="DocumentCopy"
                        round
                        @click="rootStore.copyEditCode(index)"
                      >
                      </el-button>
                      <el-button
                        v-bind="{ disabled: index === 0 }"
                        size="small"
                        icon="Delete"
                        round
                        @click="rootStore.deletePart(index)"
                      >
                      </el-button>
                    </div>
                  </div>

                  <!--Toolbar底部控制栏-->
                  <div class="layer-item" style="background-color: #f9f9f9">
                    <div style="flex: 1; display: flex; align-items: center">
                      <span style="font-weight: 500">添加新模块</span>
                    </div>
                    <div class="item-actions">
                      <el-button size="small" icon="EditPen" round disabled>
                      </el-button>
                      <el-button
                        size="small"
                        icon="DocumentCopy"
                        round
                        disabled
                      >
                      </el-button>
                      <el-button
                        size="small"
                        type="primary"
                        icon="Plus"
                        round
                        @click="rootStore.addNewPart"
                      >
                      </el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-dropdown>
          </div>

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
          class="sheng-overlay"
          @click="beltIndicator.handleOverlayClick"
        ></div>
        <div
          @click="rootStore.handleLeftClick"
          class="pipe-grid"
          id="pipe-grid"
          style="background-color: transparent"
          :style="{
            pointerEvents:
              rootStore.quickPlaceMode === 'pipe' ? 'auto' : 'none',
          }"
        ></div>
        <div
          @click="rootStore.handleLeftClick"
          id="grid-stack"
          class="grid-stack bottom-grid-bg"
          style="background-color: transparent"
          :style="{
            pointerEvents:
              rootStore.quickPlaceMode === 'belt' ? 'auto' : 'none',
          }"
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
  watch,
  onUnmounted,
} from "vue";
import { GridStack } from "gridstack";
import { useRootStore } from "../stores/SimStore";
import { useSelectStore } from "../stores/SelectStore";
import { machineComponentMap } from "../utils/MachineMap";
import RecipeContent from "../components/original/RecipeContent.vue";
import WareHouseContent from "../components/original/WareHouseContent.vue";
import { MachineData, iconStyle, gridStackDataProcess } from "../utils/DataMap";
import "gridstack/dist/gridstack.min.css";
import beltIndicator from "../utils/beltIndicator";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

const { appContext } = getCurrentInstance();
const rootStore = useRootStore();
const selectStore = useSelectStore();
const route = useRoute();
const hashCode = route.params.hashCode;

onMounted(async () => {
  await nextTick();
  //初始化
  const targetGridEl = document.querySelector("#grid-stack");
  const targetGridCont = document.querySelector(".sheng-cont-grid");
  const selector = document.querySelector(".selection-box");
  const overLay = document.querySelector(".sheng-overlay");
  const pipeGrid = document.querySelector("#pipe-grid");
  selectStore.initSelector(selector);
  rootStore.initGrid(targetGridEl, targetGridCont, overLay, appContext);
  rootStore.initPipeGrid(pipeGrid);
  // 根据是否有hashCode参数加载相应的蓝图
  if (hashCode) {
    try {
      ElMessage.info(`正在加载蓝图: ${hashCode}`);
      await rootStore.loadBlueprintByHashCode(hashCode);
      ElMessage.success(`蓝图 ${hashCode} 加载成功！`);
    } catch (error) {
      console.error("加载蓝图失败：", error);
      ElMessage.error(`加载蓝图失败: ${error.message}`);
    }
  } else {
    // 没有hashCode参数，加载本地蓝图
    try {
      const localBlueprint = rootStore.loadLocalBlueprint();
      if (localBlueprint) {
        ElMessage.success("本地蓝图加载成功！");
      }
    } catch (error) {
      console.error("加载本地蓝图失败：", error);
      ElMessage.error(`加载本地蓝图失败: ${error.message}`);
    }
  }

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
  rootStore.rootGrid.on("dropped", (event, prev, next) => {
    if (!rootStore.rootPipeGrid.isAreaEmpty(next.x, next.y, next.w, next.h)) {
      rootStore.rootGrid.removeWidget(next.el, true);
      ElMessage.error("该位置已被占用，请选择其他位置");
      return;
    }
  });
  rootStore.rootGrid.on("added", (event, items) => {
    const item = items[0];
    const el = item.el;
    const rootId = item.id.split("_")[0];
    // 存入 store
    if (!el.classList.contains("sidebar-item")) return;

    rootStore.gridWidgets[item.id] = {
      rotate: 0,
      recipe: "",
      part: rootStore.editPartChoose,
    };
    rootStore.gridWidgetElements[item.id] = el;
    rootStore.partsWidgetId[rootStore.editPartChoose].add(item.id);
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

// 监听路由参数变化，当hashCode变化时重新加载蓝图
const stopWatcher = watch(
  () => route.params.hashCode,
  async (newHashCode, oldHashCode) => {
    // 清空当前蓝图
    rootStore.clearBlueprint();

    if (newHashCode && newHashCode !== oldHashCode) {
      // 有新的hashCode参数，加载远程蓝图
      try {
        ElMessage.info(`正在加载蓝图: ${newHashCode}`);
        await rootStore.loadBlueprintByHashCode(newHashCode);
        ElMessage.success(`蓝图 ${newHashCode} 加载成功！`);
      } catch (error) {
        console.error("加载蓝图失败：", error);
        ElMessage.error(`加载蓝图失败: ${error.message}`);
      }
    } else if (!newHashCode && oldHashCode) {
      // 从有hashCode变为无hashCode，加载本地蓝图
      try {
        ElMessage.info("正在加载本地蓝图...");
        const localBlueprint = rootStore.loadLocalBlueprint();
        if (localBlueprint) {
          ElMessage.success("本地蓝图加载成功！");
        } else {
          ElMessage.info("无本地蓝图数据");
        }
      } catch (error) {
        console.error("加载本地蓝图失败：", error);
        ElMessage.error(`加载本地蓝图失败: ${error.message}`);
      }
    }
  },
);

// 添加新模块

// 组件卸载时停止监听
onUnmounted(() => {
  stopWatcher();
});
</script>

<style scoped>
.sheng-cont-grid {
  position: relative;
  overflow: scroll;
  height: var(--sheng-self-simulation-grid-height);
  background-color: var(--sheng-root-bg);
  border-radius: 4px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.bottom-grid-bg {
  background-color: var(--sheng-grid-bg);
  background-size: calc(100% / 72) calc(100% / 72);
  background-image:
    linear-gradient(to right, var(--sheng-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--sheng-grid-line) 1px, transparent 1px);
}

.grid-stack {
  /*margin: 400px 0 0 400px;*/
  position: absolute;
  transform-origin: 0 0;
  left: 0;
  right: 0;
}

.pipe-grid {
  position: absolute;
  transform-origin: 0 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.sheng-overlay {
  position: absolute;
  left: 0;
  right: 0;
  width: 3017px;
  height: 3017px;
  transform-origin: 0 0;
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0);
}

.sheng-test-border {
  border: 1px dashed var(--sim-color-primary);
  box-sizing: border-box;
}

.sheng-cont-list {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.08);
  overflow-y: scroll;
  height: var(--sheng-self-simulation-list-height);
  background-color: var(--el-color-white);
  padding: 12px;
  gap: 8px;
  border-radius: 0 4px 4px 0;
}

.sheng-cont-item {
  min-height: 56px;
  overflow: hidden;
  transition: all 0.2s ease;
  color: var(--el-text-color-primary);
  background-color: var(--sim-color-primary-bg);
  border: 1px solid var(--el-border-color-light);
  box-sizing: border-box;
  gap: 12px;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}

.sheng-cont-item:hover {
  background: var(--sim-color-primary-bg);
  color: var(--sim-color-primary);
  border-color: var(--sim-color-primary-lighter);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
  transform: translateX(2px);
}

.sheng-cont-item:hover > .sheng-cont-item-bg {
  opacity: 0.5;
}

.sheng-item--active {
  background: var(--sim-color-primary-bg);
  border: 1px solid var(--sim-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.selection-box {
  position: fixed;
  z-index: 999;
  border: 2px dashed var(--sim-color-primary);
  border-radius: 4px;
  background-color: rgba(64, 158, 255, 0.1);
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
  background-color: var(--sim-color-primary-bg);
  border-bottom: 1px solid var(--el-border-color-light);
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

.toolbar-switch {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.layer-dropdown {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  transition: background-color 0.3s;
}

.layer-item:hover {
  background-color: #f5f7fa;
}

.layer-item span {
  font-size: 14px;
  color: #303133;
}

.layer-item + .layer-item {
  border-top: 1px solid #f0f2f5;
}

.module-filter-dropdown {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
}

.filter-actions {
  padding: 8px 16px;
  border-top: 1px solid #f0f2f5;
  margin-top: 4px;
}

.filter-actions .el-button {
  transition: all 0.3s;
}

.filter-actions .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.item-actions {
  display: flex;
  align-items: center;
}

.item-actions .el-button {
  margin-left: 4px;
  transition: all 0.3s;
}

.item-actions .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sheng-cont-item-bg {
  background-size: 1440px 1440px;
  position: absolute;
  top: -30px;
  left: 50%;
  width: 120px;
  height: 120px;
  opacity: 0.2;
  transition: opacity 0.3s ease;
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
