<script setup>
import { computed, nextTick, ref } from "vue";
import { useMachineStore } from "../../stores/MachineStore";
import { useRootStore } from "../../stores/SimStore";
import { machineNameMap } from "../../utils/MachineMap";
import { iconStyle } from "../../utils/DataMap";

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
//旋转部分
const widthEl = ref(props.el_size.w);
const rotateAngle = ref(0);
const hadnleRotate = () => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  rootStore.gridWidgets[props.gs_id]["rotate"] = rotateAngle.value / 90;
};
//配方配置对话框
const targetItemId = computed(() => {
  return rootStore.gridWidgets[props.gs_id] ? rootStore.gridWidgets[props.gs_id].recipe : null;
});
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
      <el-text>{{ machineNameMap[props.el_name] }}</el-text>
      <div class="display-flex flex-direation-row justify-content-center">
        <div
          class="recipe-icon"
          @click="machineStore.handleDialog($event,props.gs_id)"
          :style="targetItemId ? iconStyle(targetItemId, 35) : {}"
        ></div>
      </div>
    </div>

    <div
      class="display-flex justify-content-center line-outter flex-direation-col"
      style="height: 15px"
    ></div>
  </div>
</template>

<style scoped>
.recipe-icon {
  width: 35px;
  height: 35px;
  background-repeat: no-repeat;
  background-size: 420px auto;
  border-radius: 4px;
  border: 1px solid gray;
}
.line-inner {
  background-color: #949494;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / v-bind(1));
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
}

.line-outter {
  background-color: #ffe289;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / 1);
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
}
</style>
