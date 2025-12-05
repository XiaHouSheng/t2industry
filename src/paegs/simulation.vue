<template>
  <div
    class="selection-box"
    @mousedown="selectStore.handleMouseDown"
    @mousemove="selectStore.handleMouseMove"
    @mouseup="selectStore.handleMouseUp"
  ></div>
  <el-row :gutter="6" class="container">
    <el-col :span="4">
      <div
        class="sheng-cont-tool-bar max-width sheng-test-border display-flex flex-direation-row justify-content-center"
      >
        <el-radio-group
          v-model="radioGroupValue"
          size="large"
          @change="rootStore.handleBeltModeChange"
        >
          <el-radio-button label="开" value="open" />
          <el-radio-button label="关" value="close" />
        </el-radio-group>
      </div>
      <div class="sheng-cont-list sidebar sheng-test-border">
        <!--data-gs-widget后续直接生成，目前便于测试先这么整-->
        <!--data-gs-widget也可以用于传递参数，如inner与outer数量等-->
        <!-- 3x3 尺寸机器 -->
        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"refineryFurnace"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">精炼炉</el-text>
        </div>

        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"crusher"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">粉碎机</el-text>
        </div>

        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"accessoryMachine"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">配件机</el-text>
        </div>

        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"shapingMachine"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">塑型机</el-text>
        </div>

        <div
          data-gs-widget='{"w":3, "h":3, "noResize":true, "id":"protocolStorageBox"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">协议存储箱</el-text>
        </div>

        <!-- 5x5 尺寸机器 -->
        <div
          data-gs-widget='{"w":5, "h":5, "noResize":true, "id":"seedHarvester"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">采种机</el-text>
        </div>

        <div
          data-gs-widget='{"w":5, "h":5, "noResize":true, "id":"planter"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">种植机</el-text>
        </div>

        <!-- 6x4 尺寸机器 -->
        <div
          data-gs-widget='{"w":6, "h":4, "noResize":true, "id":"equipmentComponentMachine"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">装备原件机</el-text>
        </div>

        <div
          data-gs-widget='{"w":6, "h":4, "noResize":true, "id":"fillingMachine"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">罐装机</el-text>
        </div>

        <div
          data-gs-widget='{"w":6, "h":4, "noResize":true, "id":"packagingMachine"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">封装机</el-text>
        </div>

        <div
          data-gs-widget='{"w":6, "h":4, "noResize":true, "id":"grinder"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">研磨机</el-text>
        </div>

        <!-- 3x1 尺寸机器 -->
        <div
          gs-h="1"
          data-gs-widget='{"w":3, "h":1, "noResize":true, "id":"warehouseDepositPort"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">仓库存货口</el-text>
        </div>

        <div
          data-gs-widget='{"w":3, "h":1, "noResize":true, "id":"warehouseWithdrawalPort"}'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">仓库取货口</el-text>
        </div>
      </div>
    </el-col>
    <el-col :span="20">
      <div
        class="sheng-cont-grid"
        @wheel="rootStore.handleScalingChange"
        @contextmenu="rootStore.handleRightClick"
        @mousedown="selectStore.handleMouseDown"
        @mousemove="selectStore.handleMouseMove"
        @mouseup="selectStore.handleMouseUp"
      >
        <div
          @click="rootStore.handleBeltNode"
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
  ref,
  getCurrentInstance,
} from "vue";
import { GridStack } from "gridstack";
import { useRootStore } from "../stores/SimStore";
import { useSelectStore } from "../stores/SelectStore";
import {
  machineComponentMap,
  machineNameMap,
} from "../components/simulation/MachineMap";
import "gridstack/dist/gridstack.min.css";
const { appContext } = getCurrentInstance();
const rootStore = useRootStore();
const selectStore = useSelectStore();
const radioGroupValue = ref("close");
onMounted(async () => {
  await nextTick();
  //初始化
  const targetGridEl = document.querySelector("#grid-stack");
  const targetGridCont = document.querySelector(".sheng-cont-grid");
  const selector = document.querySelector(".selection-box");
  selectStore.initSelector(selector);
  rootStore.initGrid(targetGridEl, targetGridCont);
  //自定义克隆函数，用于拖拽添加
  const selfClone = (element) => {
    //拷贝待加入的cell
    let cloneNode = element.cloneNode(true);
    cloneNode.replaceChildren();
    cloneNode.classList.remove("sheng-cont-item");
    //唯一id分配
    const root_id = JSON.parse(
      cloneNode.attributes.getNamedItem("data-gs-widget").nodeValue
    ).id;
    const gs_id =
      root_id + `-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(gs_id);
    //cell元素存储，用于删除与定位
    rootStore.gridWidgets[gs_id] = cloneNode;
    //vue组件映射 | 这个函数计划并入组件作为参数
    const vnode = createVNode(machineComponentMap[root_id], {
      gs_id: gs_id,
      el_name: machineNameMap[root_id],
    });
    vnode.appContext = appContext;
    render(vnode, cloneNode);
    return cloneNode;
  };
  //拖拽设置
  GridStack.setupDragIn(".sidebar-item", { helper: selfClone });
});
</script>

<style scoped>
.sheng-cont-grid {
  overflow-y: scroll;
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
  overflow-y: scroll;
  height: var(--sheng-self-simulation-list-height);
  padding: 0 3px 0 3px;
}
.sheng-cont-item {
  min-height: 60px;
}
.sidebar-item {
  overflow: hidden;
}
.selection-box {
  position: fixed;
  z-index: 999;
  border: 2px dashed #0e0e0e;
  border-radius: 4px;
}

:deep(.grid-stack-item) {
  text-align: center;
  background: #fff;
  border: 1px dashed #409eff;
  border-radius: 4px;
  box-sizing: border-box; /* 确保尺寸不会被边框影响 */
}
</style>
