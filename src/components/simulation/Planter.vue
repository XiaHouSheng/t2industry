<script setup>
import { ref } from "vue";
import { useRootStore } from "../../stores/SimStore";
// 1. 新增导入 MachineStore 并实例化
import { useMachineStore } from "../../stores/MachineStore";
const machineStore = useMachineStore()

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
// 2. 已删除 handleOpenDialog、handleRightClick、handleBeltConnect 所有方法
</script>

<template>
  <div
    class="max-height-width display-flex flex-direation-col"
    style="justify-content: space-between"
     
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
  >
    <div
      class="display-flex flex-direation-row justify-content-center"
    >
      <!-- inner数量 = width=5：所有按钮绑定 machineStore 并补充 gs_id 参数 -->
      <el-button
        @click="machineStore.handleBeltConnect($event, 'inner', props.gs_id)"
        class="sim-inner-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'inner', props.gs_id)"
        class="sim-inner-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'inner', props.gs_id)"
        class="sim-inner-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'inner', props.gs_id)"
        class="sim-inner-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'inner', props.gs_id)"
        class="sim-inner-btn"
        round
      ></el-button>
    </div>
    <div class="display-flex flex-direation-row justify-content-center">
      {{ props.el_name }}
    </div>
    <div
      class="display-flex flex-direation-row justify-content-center"
    >
      <!-- outer数量 = width=5：所有按钮绑定 machineStore 并补充 gs_id 参数 -->
      <el-button
        @click="machineStore.handleBeltConnect($event, 'outter', props.gs_id)"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'outter', props.gs_id)"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'outter', props.gs_id)"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'outter', props.gs_id)"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event, 'outter', props.gs_id)"
        class="sim-outer-btn"
        round
      ></el-button>
    </div>
  </div>
</template>

<style scoped></style>