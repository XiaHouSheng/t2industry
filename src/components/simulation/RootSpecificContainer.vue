<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRootStore } from "../../stores/SimStore";
import { useMachineStore } from "../../stores/MachineStore";
import { iconStyle } from "../../utils/DataMap";
import { objectEntries, useElementSize } from "@vueuse/core";
import WareHouseContent from "../original/WareHouseContent.vue";
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
  is_deposit: {
    type: Boolean,
  },
});

let index = 0;
let defaultWidth = props.el_size.w;
const dialogVisible = ref(false);
const widthEl = ref(defaultWidth);
const heightEl = ref(1);
const containerElement = ref(null);
const indexRef = ref(index);
const targetItemId = computed(() => {
  return rootStore.gridWidgets[props.gs_id] ? rootStore.gridWidgets[props.gs_id].recipe : null;
});

const { height, width } = useElementSize(containerElement);

//旋转设置
const rotateGridEl = (index) => {
  rootStore.gridWidgets[props.gs_id]["rotate"] = index;
  if (index % 2 == 0) {
    rootStore.rootGrid.update(rootStore.gridWidgetElements[props.gs_id], {
      w: props.el_size.h,
      h: props.el_size.w,
    });
    if (index == 0) {
      containerElement.value.style["flex-direction"] = "row-reverse";
    } else {
      containerElement.value.style["flex-direction"] = "row";
    }
    heightEl.value = defaultWidth;
    widthEl.value = 1;
  } else {
    rootStore.rootGrid.update(rootStore.gridWidgetElements[props.gs_id], {
      w: props.el_size.w,
      h: props.el_size.h,
    });
    if (index == 1) {
      containerElement.value.style["flex-direction"] = "column-reverse";
    } else {
      containerElement.value.style["flex-direction"] = "column";
    }
    heightEl.value = 1;
    widthEl.value = defaultWidth;
  }
};
const hadnleRotate = () => {
  rotateGridEl(index);
  index = index >= 3 ? 0 : index + 1;
  indexRef.value = index;
};
//配方配置对话框
const handleDialog = (event) => {
  event.stopPropagation();
  dialogVisible.value = true;
};
//AI优化版 ICON大小自适应
const iconAutoSize = computed(() => {
  const h = height.value,
    w = width.value,
    isEven = indexRef.value % 2 === 0;
  const calcVal = (isEven ? h : w) * 0.8;
  return {
    backgroundSize: `${(calcVal / 64) * 768}px auto`,
    ...(isEven
      ? { height: `${calcVal}px`, left: `${(w - calcVal) / 2}px` }
      : { width: `${calcVal}px`, top: `${(h - calcVal) / 2}px` }),
    ...iconStyle(targetItemId.value, calcVal),
  };
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    width="50%"
    @close="rootStore.handleDialogRecipeClose"
    :append-to-body="true"
  >
    <WareHouseContent :gs_id="props.gs_id"></WareHouseContent>
  </el-dialog>

  <div
    ref="containerElement"
    class="max-height-width display-flex"
    style="justify-content: center; flex-direction: column"
    :class="props.is_deposit ? 'line-inner' : 'line-outter'"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div v-if="!is_deposit" class="recipe-icon" @click="handleDialog" :style="iconAutoSize"></div>
  </div>
</template>

<style scoped>
.recipe-icon {
  position: absolute;
  aspect-ratio: 1/1;
  background-repeat: no-repeat;
  border-radius: 4px;
  border: 1px solid gray;
}
.line-inner {
  background-color: #949494;
}

.line-outter {
  background-color: #ffe289;
}
</style>
