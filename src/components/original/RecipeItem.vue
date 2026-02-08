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
  props.targetId
    ? RecipeData[machineFileId.value][props.targetId]
    : defaultRecipe
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
  <div class="flex flex-col border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
    <div class="w-full text-start bg-gray-700 text-gray-300 font-bold px-4 py-2">
      {{ recipe.name }}
    </div>
    <div class="flex flex-row transition-all duration-300 bg-gray-800 h-[64px] gap-[6px] p-[3px] hover:bg-gray-700">
      <div class="flex flex-row gap-[6px]">
        <div
          v-for="(slot, index) in inputSlots"
          :key="index"
          class="flex flex-col relative"
        >
          <div
            class="w-[64px] h-[64px] bg-no-repeat bg-auto rounded-[4px] border border-gray-600"
            :style="slot ? iconStyle(slot.itemId) : {}"
          ></div>
          <span v-if="slot" class="absolute left-[23px] bottom-0 text-gray-300 text-xs">
            x{{ slot.count }}
          </span>
        </div>
      </div>
      <div
        class="flex flex-col justify-center w-[15px]"
      >
        <svg viewBox="0 0 1024 1024" class="w-[15px] h-[15px] text-yellow-400">
          <path fill="currentColor" d="M832 512a32 32 0 0 1 32 32v352a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V192a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H128a32 32 0 0 1-32-32v352a32 32 0 0 1 32 32z"/>
        </svg>
      </div>
      <div class="flex flex-row gap-[6px]">
        <div
          v-for="(slot, index) in outputSlots"
          :key="index"
          class="flex flex-col relative"
        >
          <div
            class="w-[64px] h-[64px] bg-no-repeat bg-auto rounded-[4px] border border-gray-600"
            :style="slot ? iconStyle(slot.itemId) : {}"
          ></div>
          <span v-if="slot" class="absolute left-[23px] bottom-0 text-gray-300 text-xs">
            x{{ slot.count }}
          </span>
        </div>
      </div>

      <button
        v-if="showBtn"
        @click="handleRecipeSelect"
        class="h-full w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-all duration-300 rounded-r-[3px]"
      >
        选择
      </button>
    </div>
  </div>
</template>
