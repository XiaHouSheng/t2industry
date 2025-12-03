<script setup>
import { ref } from "vue";
import { useRootStore } from "../../stores/SimStore";

const rootStore = useRootStore();
const props = defineProps({
  gs_id: {
    required: true,
    type: String,
  },
  el_name: {
    type: String,
  },
});
//机器设置接口
const handleOpenDialog = () => {};
//右键删除机器
const handleRightClick = (event) => {
  event.preventDefault();
  if (rootStore.isBeltConnecting) {
    rootStore.cancelBeltConnect();
    return;
  }
  rootStore.rootGrid.removeWidget(rootStore.gridWidgets[props.gs_id]);
  delete rootStore.gridWidgets[props.gs_id];
};
//进出口事件
const handleBeltConnect = (event, which) => {
  event.stopPropagation();
  if (!rootStore.isBeltConnecting) {
    //inner outter specific
    rootStore.startBeltConnect(event, which, props.gs_id);
  } else {
    rootStore.compeleteBeltConnect();
  }
};
</script>

<template>
  <div
    class="max-height-width display-flex flex-direation-col justify-content-center"
    @contextmenu="handleRightClick"
  >
    <div
      class="display-flex flex-direation-row justify-content-center"
    >
      <!-- inner数量 = width=3 -->
    </div>
    <div class="display-flex flex-direation-row justify-content-center">
    </div>
    <div
      class="display-flex flex-direation-row justify-content-center"
    >
      <!-- outer数量 = width=3 -->
      <el-button
        @click="handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
    </div>
  </div>
</template>

<style scoped></style>