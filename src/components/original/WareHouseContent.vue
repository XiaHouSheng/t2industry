<script setup>
import { computed } from "vue";
import { useRootStore } from "../../stores/SimStore";
import { ItemData, MatData, iconStyle } from "../../utils/DataMap";

const rootStore = useRootStore();
const props = defineProps({
  gs_id: {
    type: String,
  },
});
const matSelect = (targetItemId) => {
  rootStore.gridWidgets[props.gs_id].recipe = targetItemId;
};
const defaultRecipe = computed(() => {
  return rootStore.gridWidgets[props.gs_id]
    ? rootStore.gridWidgets[props.gs_id].recipe
    : null;
});
const finalValue = computed(() =>
  defaultRecipe.value
    ? { name: ItemData[defaultRecipe.value].name, icon_id: defaultRecipe.value }
    : { name: "未选择", icon_id: "" }
);
</script>

<template>
  <div class="dialog-container">
    <div class="display-flex flex-direation-row">
      <div
        class="flex-grow-1 display-flex flex-direation-col justify-content-center position-relative"
      >
        <div
          class="position-absolute display-flex flex-direation-row justify-content-center"
          style="left: 0; top: 0; height: 30px; width: 100%"
        >
          <h1>仓库取货口-当前输出</h1>
        </div>
        <div
          class="display-flex flex-direation-row justify-content-center position-relative"
        >
          <div
            class="mat-item"
            :style="[
              iconStyle(finalValue.icon_id),
              {
                width: `${64}px`,
              },
            ]"
          >
            <div
              style="top: 64px; width: 64px; text-align: center"
              class="display-flex flex-direation-row justify-content-center position-absolute"
            >
              <el-text>{{ finalValue.name }}</el-text>
            </div>
          </div>
        </div>
      </div>
      <div class="choose-mat-grid">
        <div
          v-for="material in MatData"
          :style="[iconStyle(material.icon)]"
          class="position-relative mat-item"
        >
          <div
            @click="matSelect(material.id)"
            class="mat-item-hover position-absolute max-height-width"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-container {
  width: 100%;
}
.choose-mat-grid {
  display: grid;
  grid-template-columns: repeat(6, 64px);
  max-height: 384px;
  row-gap: 3px;
  column-gap: 3px;
  overflow-y: scroll;
}
.mat-item {
  height: 64px;
  border-radius: 3px;
}
.mat-item-hover {
  transition: 0.1s;
}

.mat-item:hover .mat-item-hover {
  background-color: rgba(255, 255, 255, 0.379);
  border-radius: 3px;
}
.mat-item:active .mat-item-hover {
  background-color: rgba(0, 0, 0, 0.311);
  border-radius: 3px;
}

h1 {
  margin: 0;
  text-align: center;
}
</style>
