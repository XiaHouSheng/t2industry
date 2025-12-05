<script setup>
import { ref } from "vue";
import { useRootStore } from "../../stores/SimStore";
import { useMachineStore } from "../../stores/MachineStore";

const rootStore = useRootStore();
const machineStore = useMachineStore()
const props = defineProps({
  gs_id: {
    required: true,
    type: String,
  },
  el_name: {
    type: String,
  },
});
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
      <!-- inner数量 = width=3 -->
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
      <!-- outer数量 = width=3 -->
      <el-button
        @click="machineStore.handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
      <el-button
        @click="machineStore.handleBeltConnect($event,'outter')"
        class="sim-outer-btn"
        round
      ></el-button>
    </div>
  </div>
</template>

<style scoped></style>