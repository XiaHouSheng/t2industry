<script setup>
import { ref } from "vue";
import { useMachineStore } from "../../stores/MachineStore";
import { useRootStore } from "../../stores/SimStore";
import { machineNameMap } from "../../utils/MachineMap";
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
  port: {
    required: false,
    type: Object,
    default: () => ({
      top: true,
      bottom: true,
    }),
  },
  part: {
    type: Object,
    required: false,
  },
});
//旋转部分
const widthEl = ref(props.el_size.w);
const rotateAngle = ref(0);
const hadnleRotate = () => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  rootStore.gridWidgets[props.gs_id]["rotate"] = rotateAngle.value / 90;
};
</script>

<template>
  <div
    class="max-height-width display-flex flex-direation-col sheng-machine"
    style="justify-content: space-between; background-color: white"
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div v-if="port.top"
      class="display-flex justify-content-center line-inner flex-direation-row"
      style="height: 15px"
    ></div>

    <div
      class="display-flex justify-content-center flex-grow-1 flex-direation-col"
      :style="{ transform: `rotate(${-rotateAngle}deg)` }"
      style="container-type: inline-size"
    >
      <el-text class="self-control-font">{{
        machineNameMap[props.el_name]
      }}</el-text>
    </div>

    <div v-if="port.bottom"
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

@container (max-width: 60px) {
  .self-control-font {
    font-size: 12px;
  }
}

.line-inner {
  background-color: #9494948d;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / 1);
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to top, #fff 1px, transparent 1px);
}

.line-outter {
  background-color: #ffe1898d;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / 1);
  background-image: linear-gradient(to right, #ffffffa2 1px, transparent 1px),
    linear-gradient(to bottom, #ffffffa2 1px, transparent 1px);
}
</style>
