<script setup>
import { nextTick, ref } from "vue";
// 新增导入 MachineStore 并实例化
import { useMachineStore } from "../../stores/MachineStore";
import { useRootStore } from "../../stores/SimStore";
const rootStore = useRootStore();
const machineStore = useMachineStore();
const props = defineProps({
  gs_id: {
    required: true,
    type: String,
  },
  el_name: {
    type: String,
  },
  el_size: {
    required: true,
    type: Object,
  },
});

const widthEl = ref(props.el_size.w);
const rotateAngle = ref(0);
const hadnleRotate = () => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  rootStore.gridWidgetsRotate[props.gs_id] = rotateAngle.value / 90;
};
</script>

<template>
  <div
    class="max-height-width display-flex flex-direation-col"
    style="justify-content: space-between; background-color: white"
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div
      class="display-flex justify-content-center line-inner flex-direation-row"
      style="height: 15px"
    ></div>

    <div
      class="display-flex justify-content-center flex-grow-1 flex-direation-col"
      :style="{ transform: `rotate(${-rotateAngle}deg)` }"
    >
      <el-text>{{ props.el_name }}</el-text>
      <el-text>配方</el-text>
    </div>

    <div
      class="display-flex justify-content-center line-outter flex-direation-col"
      style="height: 15px"
    ></div>
  </div>
</template>

<style scoped>
.line-inner {
  background-color: #8bc34a;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / v-bind(1));
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
}

.line-outter {
  background-color: #e51c23;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / 1);
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
}
</style>
