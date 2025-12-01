<template>
  <el-row :gutter="6" class="container">
    <el-col :span="4">
      <div class="sheng-cont-list sidebar sheng-test-border">
        <div
          v-for="value in 1"
          data-gs-widget='{"w":3, "h":3, "noResize":true }'
          class="sheng-cont-item sidebar-item sheng-test-border display-flex flex-direation-row"
        >
          <div class="grid-stack-content"></div>
          <el-text class="list-span">传送带</el-text>
        </div>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="sheng-cont-grid">
        <div ref="targetGrid" class="grid-stack"></div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, nextTick, createVNode, render } from "vue";
import { GridStack } from "gridstack";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";
import "gridstack/dist/gridstack.min.css";

const NUM_COLUMN = 32;
const targetGrid = ref(null);
let grid = null;

const selfClone = (element) => {
  let cloneNode = element.cloneNode(true);
  cloneNode.replaceChildren()
  const vnode = createVNode(
    ConveyerBelt,
  );
  render(vnode,cloneNode)
  return cloneNode;
};

onMounted(async () => {
  await nextTick();
  grid = GridStack.init({
    cellHeight: targetGrid.value.clientWidth / NUM_COLUMN,
    minRow: 12,
    allowNewRow: true,
    float: true,
    acceptWidgets: function (el) {
      return true;
    },
  });
  GridStack.setupDragIn(".sidebar-item", { helper: selfClone });
  grid.column(NUM_COLUMN);
});
</script>

<style scoped>
.sheng-cont-grid {
  overflow-y: scroll;
  max-height: 100%;
  height: var(--sheng-self-simulation-list-height);
}
.sheng-test-border {
  border: 1px dashed #409eff;
  box-sizing: border-box;
  border-radius: 4px;
}
.sheng-cont-list {
  overflow-y: scroll;
  overflow-y: hidden;
  max-height: 100%;
  height: var(--sheng-self-simulation-list-height);
  padding: 0 3px 0 3px;
}
.sheng-cont-item {
  min-height: 60px;
  margin: 0 0 6px 0;
  padding: 0 6px 0 6px;
}
:deep(.grid-stack-item) {
  text-align: center;
  background: #fff;
  border: 1px dashed #409eff;
  border-radius: 4px;
  box-sizing: border-box; /* 确保尺寸不会被边框影响 */
}
</style>
