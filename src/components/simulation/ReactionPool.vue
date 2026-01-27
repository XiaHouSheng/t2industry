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
  rotate: {
    type: Number,
    default: 0,
  },
});
//旋转部分
const widthEl = ref(props.el_size.w);
const rotateAngle = ref(props.rotate * 90);
const hadnleRotate = () => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  rootStore.gridWidgets[props.gs_id]["rotate"] = rotateAngle.value / 90;
};
//配方配置对话框
const targetItemId = computed(() => {
  return rootStore.gridWidgets[props.gs_id] ? rootStore.gridWidgets[props.gs_id].recipe : null;
});

//液体管口显示控制
const showPipePorts = computed(() => {
  return rootStore.isShowPipePort;
});
</script>

<template>
  <div
    class="max-height-width display-flex flex-direation-col sheng-machine"
    style="justify-content: space-between; background-color: white;position: relative;"
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div
      class="line-marker line-inner-2"
    ></div>
    <div
      class="line-marker line-inner-4"
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
      class="line-marker line-outter-2"
    ></div>
    <div
      class="line-marker line-outter-4"
    ></div>

    <div
      v-if="showPipePorts"
      class="pipe-port pipe-port-left-1"
    ></div>
    <div
      v-if="showPipePorts"
      class="pipe-port pipe-port-left-3"
    ></div>
    <div
      v-if="showPipePorts"
      class="pipe-port pipe-port-right-1"
    ></div>
    <div
      v-if="showPipePorts"
      class="pipe-port pipe-port-right-3"
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

.line-marker {
  position: absolute;
  width: 20%;
  height: 15px;
  background-image: linear-gradient(to bottom, #fff 1px, transparent 1px);
  background-size: 1px 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.line-inner-2 {
  top: 0;
  left: 20%;
  background-color: #9494948d;
}

.line-inner-4 {
  top: 0;
  left: 60%;
  background-color: #9494948d;
}

.line-outter-2 {
  bottom: 0;
  left: 20%;
  background-color: #ffe2898d;
}

.line-outter-4 {
  bottom: 0;
  left: 60%;
  background-color: #ffe2898d;
}

.pipe-port {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #4a90e2;
  border: 2px solid #2c5aa0;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.pipe-port-left-1 {
  left: 0;
  top: 30%;
}

.pipe-port-left-3 {
  left: 0;
  top: 70%;
}

.pipe-port-right-1 {
  right: -25px;
  top: 30%;
  background-color: #ffe2898d;
}

.pipe-port-right-3 {
  right: -25px;
  top: 70%;
  background-color: #ffe2898d;
}

</style>
