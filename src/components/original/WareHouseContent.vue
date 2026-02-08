<script setup>
import { computed } from "vue";
import { useRootStore } from "../../stores/SimStore";
import { ItemData, MatData, iconStyle } from "../../utils/DataMap";

const rootStore = useRootStore();
const matSelect = (targetItemId) => {
  rootStore.gridWidgets[rootStore.materialChooseId].recipe = targetItemId;
};
const defaultRecipe = computed(() => {
  return rootStore.gridWidgets[rootStore.materialChooseId]
    ? rootStore.gridWidgets[rootStore.materialChooseId].recipe
    : null;
});
const finalValue = computed(() =>
  defaultRecipe.value
    ? { name: ItemData[defaultRecipe.value].name, icon_id: defaultRecipe.value }
    : { name: "未选择", icon_id: "" },
);
</script>

<template>
  <div class="w-full p-4">
    <div class="flex flex-row gap-4">
      <div class="w-80 flex flex-1 flex-col justify-center relative">
        <div
          class="absolute flex flex-row justify-center bg-gray-800 rounded-[3px] px-4 py-2"
          style="left: 0; top: 0; width: 100%"
        >
          <h1 class="m-0 text-center text-gray-100 text-sm">仓库取货口-当前输出</h1>
        </div>
        <div class="flex flex-row justify-center relative mt-12">
          <div
            class="h-[64px] rounded-[3px] group border border-gray-600"
            :style="[
              iconStyle(finalValue.icon_id),
              {
                width: `${64}px`,
              },
            ]"
          >
            <div
              class="absolute flex flex-row justify-center transition-[0.1s] rounded-[3px] group-hover:bg-white/38 group-active:bg-black/31 max-h-full w-full"
              style="top: 64px; width: 64px; text-align: center"
            >
              <el-text class="text-gray-100 text-xs">{{ finalValue.name }}</el-text>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-[repeat(6,64px)] max-h-[384px] gap-1 overflow-y-auto p-3 border border-gray-700 bg-gray-800 rounded-lg custom-scrollbar"
      >
        <div
          v-for="material in MatData"
          :style="[iconStyle(material.icon)]"
          class="relative h-[64px] rounded-[3px] group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
          @click="matSelect(material.id)"
        >
          <div
            class="absolute transition-[0.1s] rounded-[3px] group-hover:bg-white/38 group-active:bg-black/31 max-h-full w-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.custom-scrollbar::-webkit-scrollbar-corner {
  background: #1f2937;
}
</style>
