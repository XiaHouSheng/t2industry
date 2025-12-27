<script setup>
import { computed } from "vue";
import { RecipeData, toSlot, iconStyle } from "../../utils/DataMap";
import { machineDataFileMap } from "../../utils/MachineMap";
import { useRootStore } from "../../stores/SimStore";
const props = defineProps({
  showBtn: {
    type: Boolean,
    default: true,
  },
  targetId: {
    type: String,
  },
});
const emits = defineEmits(["handleRecipeSelect"]);
/**
 * machineId And itemId -> recipe
 * recipe -> 渲染
 * {
      "time": 2,
      "in": {
        "carbon_mtl": 1
      },
      "out": {
        "carbon_powder": 2
      },
      "producers": [
        "grinder_1"
      ],
      "id": "carbon_powder",
      "name": "碳粉末",
      "category": "material",
      "row": 0,
      "icon": "carbon_powder"
    }

    "carbon_powder": {
    "id": "carbon_powder",
    "position": "-384px 0px",
    "color": "#4c4c4c"
  }
 */

const defaultRecipe = {
  in: {},
  out: {},
  name: "空配方",
};
const rootStore = useRootStore();
const machineId = computed(() => rootStore.recipeChooseId.split("_")[0]);
const machineFileId = computed(() => machineDataFileMap[machineId.value]);

const recipe = computed(() =>
  props.targetId ? RecipeData[machineFileId.value][props.targetId] : defaultRecipe
);

const inputSlots = computed(() => {
  const entries = Object.entries(recipe.value.in);
  return [
    entries[0] ? toSlot(entries[0]) : null,
    entries[1] ? toSlot(entries[1]) : null,
  ];
});

const outputSlots = computed(() => {
  const entries = Object.entries(recipe.value.out);
  return [
    entries[0] ? toSlot(entries[0]) : null,
    entries[1] ? toSlot(entries[1]) : null,
  ];
});

function handleRecipeSelect() {
  emits("handleRecipeSelect", props.targetId);
}
</script>

<template>
  <div class="display-flex flex-direation-col">
    <el-text style="width: 100%; text-align: start">{{ recipe.name }}</el-text>
    <div class="display-flex flex-direation-row sheng-recipe-item">
      <div class="display-flex flex-direation-row sheng-recipe-mat">
        <div
          v-for="(slot, index) in inputSlots"
          :key="index"
          class="display-flex flex-direation-col position-relative"
        >
          <div
            class="recipe-icon"
            :style="slot ? iconStyle(slot.itemId) : {}"
          ></div>
          <span v-if="slot" style="position: absolute; left: 23px; bottom: 0px">
            x{{ slot.count }}
          </span>
        </div>
      </div>
      <div
        class="display-flex flex-direation-col justify-content-center sheng-recipe-cent"
      >
        <el-icon size="15"><DArrowRight /></el-icon>
      </div>
      <div class="display-flex flex-direation-row sheng-recipe-mat">
        <div
          v-for="(slot, index) in outputSlots"
          :key="index"
          class="display-flex flex-direation-col position-relative"
        >
          <div
            class="recipe-icon"
            :style="slot ? iconStyle(slot.itemId) : {}"
          ></div>
          <span v-if="slot" style="position: absolute; left: 23px; bottom: 0px">
            x{{ slot.count }}
          </span>
        </div>
      </div>

      <el-button
        v-if="showBtn"
        @click="handleRecipeSelect"
        class="max-height-width"
        icon="Select"
        type="success"
        plain
      ></el-button>
    </div>
  </div>
</template>

<style scoped>
.sheng-recipe-item {
  height: 64px;
  gap: 6px;
  padding: 3px;
}
.sheng-recipe-mat {
  gap: 6px;
}
.sheng-recipe-cent {
  width: 15px;
}
.recipe-icon {
  width: 64px;
  height: 64px;
  background-repeat: no-repeat;
  background-size: auto;
  border-radius: 4px;
  border: 1px solid gray;
}
.sheng-recipe-mat span {
  color: white;
}
</style>
