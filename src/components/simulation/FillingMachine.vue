<script setup>
import { computed, onMounted, ref } from "vue";
import { useRootStore } from "../../stores/SimStore";
import { useMachineStore } from "../../stores/MachineStore";
import { machineNameMap } from "../../utils/MachineMap";
import { iconStyle } from "../../utils/DataMap";
import RecipeList from "../original/RecipeContent.vue";

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
let index = props.rotate || 0;
const currentIndex = ref(index);
let defaultWidth = props.el_size.w;
const widthEl = ref(defaultWidth);
const heightEl = ref(1);
const baseContFlex = ref(null);
const childContInner = ref(null);
const childContOuter = ref(null);

//0->default 1->change 2->default 3->change
const onlyChangeFlexDirection = (index) => {
  if (index == 0) {
    baseContFlex.value.style["flex-direction"] = "column";
    heightEl.value = 1;
    widthEl.value = 6;
    childContInner.value.style["width"] = "auto";
    childContInner.value.style["height"] = "15px";
    childContOuter.value.style["width"] = "auto";
    childContOuter.value.style["height"] = "15px";
  }
  if (index == 1) {
    baseContFlex.value.style["flex-direction"] = "row-reverse";
    heightEl.value = 6;
    widthEl.value = 1;
    childContInner.value.style["width"] = "15px";
    childContInner.value.style["height"] = "auto";
    childContOuter.value.style["width"] = "15px";
    childContOuter.value.style["height"] = "auto";
  }
  if (index == 2) {
    baseContFlex.value.style["flex-direction"] = "column-reverse";
    heightEl.value = 1;
    widthEl.value = 6;
    childContInner.value.style["width"] = "auto";
    childContInner.value.style["height"] = "15px";
    childContOuter.value.style["width"] = "auto";
    childContOuter.value.style["height"] = "15px";
  }
  if (index == 3) {
    baseContFlex.value.style["flex-direction"] = "row";
    heightEl.value = 6;
    widthEl.value = 1;
    childContInner.value.style["width"] = "15px";
    childContInner.value.style["height"] = "auto";
    childContOuter.value.style["width"] = "15px";
    childContOuter.value.style["height"] = "auto";
  }
  /*
  if (index % 2 == 0) {
    if (index == 0) {
      baseContFlex.value.style["flex-direction"] = "row-reverse";
    } else {
      baseContFlex.value.style["flex-direction"] = "row";
    }
    heightEl.value = defaultWidth;
    widthEl.value = 1;
    childContInner.value.style["width"] = "15px";
    childContInner.value.style["height"] = "auto";
    childContOuter.value.style["width"] = "15px";
    childContOuter.value.style["height"] = "auto";
  } else {
    if (index == 1) {
      baseContFlex.value.style["flex-direction"] = "column-reverse";
    } else {
      baseContFlex.value.style["flex-direction"] = "column";
    }
    heightEl.value = 1;
    widthEl.value = defaultWidth;
    childContInner.value.style["height"] = "15px";
    childContInner.value.style["width"] = "auto";
    childContOuter.value.style["height"] = "15px";
    childContOuter.value.style["width"] = "auto";
  }
    */
};

const onlyChangeWidthAHeight = (index) => {
  if (index % 2 == 0) {
    rootStore.rootGrid.update(rootStore.gridWidgetElements[props.gs_id], {
      w: 6,
      h: 4,
    });
  } else {
    rootStore.rootGrid.update(rootStore.gridWidgetElements[props.gs_id], {
      w: 4,
      h: 6,
    });
  }
};

const rotateGridEl = (index) => {
  onlyChangeWidthAHeight(index);
  onlyChangeFlexDirection(index);
};
const hadnleRotate = () => {
  if (index >= 3) {
    index = 0;
  } else {
    index++;
  }
  currentIndex.value = index;
  rotateGridEl(index);
  rootStore.gridWidgets[props.gs_id]["rotate"] = index;
};

const targetItemId = computed(() => {
  return rootStore.gridWidgets[props.gs_id]
    ? rootStore.gridWidgets[props.gs_id].recipe
    : null;
});

const showPipePorts = computed(() => {
  return rootStore.isShowPipePort;
});

const portPosition = computed(() => {
  const rotation = currentIndex.value % 4;
  switch (rotation) {
    case 0:
      return 'right-2';
    case 1:
      return 'bottom-3';
    case 2:
      return 'left-2';
    case 3:
      return 'top-3';
    default:
      return 'right-2';
  }
});

onMounted(() => {
  onlyChangeFlexDirection(index);
})


</script>
<template>
  <div
    class="max-height-width display-flex sheng-machine"
    style="
      justify-content: space-between;
      flex-direction: column;
      background-color: white;
    "
    ref="baseContFlex"
    @contextmenu="machineStore.handleRightClick($event, props.gs_id)"
    @click="hadnleRotate"
  >
    <div
      ref="childContInner"
      class="display-flex justify-content-center line-inner flex-direation-row"
      style="height: 15px"
    ></div>

    <div
      class="display-flex justify-content-center flex-grow-1 flex-direation-col"
    >
      <el-text>{{ machineNameMap[props.el_name] }}</el-text>
      <div class="display-flex flex-direation-row justify-content-center">
        <div
          class="recipe-icon"
          @click="machineStore.handleDialog($event, props.gs_id)"
          :style="targetItemId ? iconStyle(targetItemId, 35) : {}"
        ></div>
      </div>
    </div>

    <div
      ref="childContOuter"
      class="display-flex justify-content-center line-outter flex-direation-col"
      style="height: 15px"
    ></div>

    <div
      v-if="showPipePorts"
      :class="['pipe-port', `pipe-port-${portPosition}`]"
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
  background-color: #9494948d;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / v-bind(heightEl));
  background-image:
    linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
}

.line-outter {
  background-color: #ffe1898d;
  background-size: calc(100% / v-bind(widthEl)) calc(100% / v-bind(heightEl));
  background-image:
    linear-gradient(to right, #fff 1px, transparent 1px),
    linear-gradient(to bottom, #fff 1px, transparent 1px);
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

.pipe-port-right-2 {
  right: -25px;
  top: 37.5%;
}

.pipe-port-left-2 {
  left: 0;
  top: 37.5%;
}

.pipe-port-bottom-3 {
  bottom: -25px;
  left: 62.5%;
}

.pipe-port-top-3 {
  top: 0;
  left: 62.5%;
}
</style>
