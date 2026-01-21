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
    class="max-height-width display-flex flex-direation-row sheng-machine"
    style="background-color: white;"
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div
      class="display-flex justify-content-center flex-direation-col"
      style="width: calc(100% * 1 / 9); height: 100%; max-height: calc(100% * 7 / 9); margin: auto 0"
    >
      <div class="outter-block" style="height: 14.28%"></div>
      <div class="empty-block" style="height: 28.57%"></div>
      <div class="outter-block" style="height: 14.28%"></div>
      <div class="empty-block" style="height: 28.57%"></div>
      <div class="outter-block" style="height: 14.28%"></div>
    </div>

    <div
      class="display-flex flex-grow-1 flex-direation-col justify-content-space-between"
      style="width: calc(100% * 7 / 9)"
    >
      <div
        class="display-flex justify-content-center line-inner flex-direation-row"
        style="height: 15px; width: 100%"
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

      <div
        class="display-flex justify-content-center line-inner flex-direation-col"
        style="height: 15px; width: 100%"
      ></div>
    </div>

    <div
      class="display-flex justify-content-center flex-direation-col"
      style="width: calc(100% * 1 / 9); height: 100%; max-height: calc(100% * 7 / 9); margin: auto 0"
    >
      <div class="outter-block" style="height: 14.28%"></div>
      <div class="empty-block" style="height: 28.57%"></div>
      <div class="outter-block" style="height: 14.28%"></div>
      <div class="empty-block" style="height: 28.57%"></div>
      <div class="outter-block" style="height: 14.28%"></div>
    </div>
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
  background-size: calc(100% / 7) calc(100% / 1);
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to top, #fff 1px, transparent 1px);
}

.line-outter {
  background-color: #ffe1898d;
  background-size: calc(100% / 7) calc(100% / 1);
  background-image: linear-gradient(to right, #ffffffa2 1px, transparent 1px),
    linear-gradient(to bottom, #ffffffa2 1px, transparent 1px);
}

.line-left {
  background-color: #9494948d;
  background-size: calc(100% / 1) calc(100% / 7);
  background-image: linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
  height: 100%;
  max-height: calc(100% * 7 / 9);
  margin: auto 0;
}

.line-right {
  background-color: #ffe1898d;
  background-size: calc(100% / 1) calc(100% / 7);
  background-image: linear-gradient(to right, #ffffffa2 1px, transparent 1px),
    linear-gradient(to bottom, #ffffffa2 1px, transparent 1px);
  height: 100%;
  max-height: calc(100% * 7 / 9);
  margin: auto 0;
}

.sheng-machine {
  width: 100%;
  height: 100%;
  max-width: 9grid;
  max-height: 9grid;
}

.justify-content-space-between {
  justify-content: space-between;
}

.outter-block {
  background-color: #ffe1898d;
  border: 1px solid #ffffffa2;
}

.empty-block {
  background-color: transparent;
  border: 1px solid #ffffffa2;
  border-top: none;
  border-bottom: none;
}
</style>
