<script setup>
import RecipeItem from "./RecipeItem.vue";
import { machineDataFileMap, machineNameMap } from "../../utils/MachineMap";
import { RecipeData } from "../../utils/DataMap";
import { useRootStore } from "../../stores/SimStore";
import { computed } from "vue";

const rootStore = useRootStore();
const chooseRecipe = computed(() => {
  return rootStore.gridWidgets[rootStore.recipeChooseId]
    ? rootStore.gridWidgets[rootStore.recipeChooseId].recipe
    : null;
});
const machineId = computed(() => rootStore.recipeChooseId.split("_")[0]);
const machineFileId = computed(() => machineDataFileMap[machineId.value]);
const recipes = computed(() => Object.values(RecipeData[machineFileId.value]));
function handleRecipeSelect(targetId) {
  rootStore.gridWidgets[rootStore.recipeChooseId].recipe = targetId;
}
</script>

<template>
  <div class="flex flex-col bg-gray-900 rounded-lg p-4">
    <div class="flex flex-col mb-4">
      <h1 class="bg-gray-800 rounded-[3px] m-0 mt-[6px] mb-[6px] text-left text-gray-300 px-4 py-2">
        {{ machineNameMap[machineId] }} 当前配方
      </h1>
      <RecipeItem :target-id="chooseRecipe" :show-btn="false"></RecipeItem>
    </div>
    <h1 class="bg-gray-800 rounded-[3px] m-0 mt-[6px] mb-[6px] text-left text-gray-300 px-4 py-2">{{ machineNameMap[machineId] }} 可选配方</h1>
    <div class="overflow-auto max-h-[300px] grid grid-cols-2 gap-[6px] custom-scrollbar">
      <RecipeItem
        v-for="value of recipes"
        :target-id="value.id"
        @handle-recipe-select="handleRecipeSelect"
      ></RecipeItem>
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
