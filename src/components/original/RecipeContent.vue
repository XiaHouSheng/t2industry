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
  <div class="display-flex flex-direation-col">
    <div class="display-flex flex-direation-col sheng-recipe-header">
      <h1 class="sheng-recipe-title">
        {{ machineNameMap[machineId] }} 当前配方
      </h1>
      <RecipeItem :target-id="chooseRecipe" :show-btn="false"></RecipeItem>
    </div>
    <h1 class="sheng-recipe-title">{{ machineNameMap[machineId] }} 可选配方</h1>
    <div class="sheng-recipe-grid">
      <RecipeItem
        v-for="value of recipes"
        :target-id="value.id"
        @handle-recipe-select="handleRecipeSelect"
      ></RecipeItem>
    </div>
  </div>
</template>

<style scoped>
.sheng-recipe-title {
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.838),
    rgb(255, 255, 255) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 3px;
}
.sheng-recipe-grid {
  overflow: auto;
  display: grid;
  max-height: 300px;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
}
h1 {
  margin: 0;
  margin-top: 6px;
  margin-bottom: 6px;
  text-align: left;
}
</style>
