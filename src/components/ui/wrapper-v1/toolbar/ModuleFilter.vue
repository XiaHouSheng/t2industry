<script setup>
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "radix-vue";
import { SwitchRoot, SwitchThumb } from "radix-vue";
import { watch } from "vue";
import { useRootStore } from "@/stores/SimStore";

const rootStore = useRootStore();

const props = defineProps({
  parts: {
    type: Array,
    default: () => [],
  },
  editPartChoose: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "selectEditPart",
  "copyEditCode",
  "deletePart",
  "addNewPart",
]);

watch(
  () => props.parts,
  (newParts, oldParts) => {
    if (oldParts) {
      newParts.forEach((newPart, index) => {
        rootStore.handlePartShowChange(newPart, newPart.show);
      });
    }
  },
  { deep: true },
);

const handleSelectEditPart = (name) => {
  emit("selectEditPart", name);
};

const handleCopyEditCode = (index) => {
  emit("copyEditCode", index);
};

const handleDeletePart = (index) => {
  emit("deletePart", index);
};

const handleAddNewPart = () => {
  emit("addNewPart");
};
</script>

<template>
  <div class="mr-3">
    <DropdownMenuRoot modal>
      <DropdownMenuTrigger
        class="px-4 py-2 text-sm text-gray-300 bg-gray-600 border border-gray-600 rounded hover:bg-gray-500 hover:text-yellow-400 hover:border-yellow-400 transition-all duration-300 flex items-center gap-2 h-8 w-auto min-w-[100px]"
      >
        模块滤镜
        <svg viewBox="0 0 1024 1024" class="w-4 h-4">
          <path
            fill="currentColor"
            d="M840.4 300H183.6c-19.7 0-38.1 7.4-51.6 21.6L512 608.4 892 321.6c-13.5-14.2-31.9-21.6-51.6-21.6H183.6c-19.7 0-38.1 7.4-51.6 21.6L512 608.4 892 321.6c-13.5-14.2-31.9-21.6-51.6-21.6z"
          />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <Transition
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <DropdownMenuContent
            class="bg-gray-900 border border-gray-700 rounded-lg shadow-lg min-w-[180px] overflow-hidden p-1"
            align="start"
          >
          <DropdownMenuItem
            v-for="(part, index) in parts"
            :key="index"
            class="flex justify-between items-center p-2 px-4 hover:bg-gray-800 transition-colors duration-300 rounded cursor-pointer"
          >
            <div class="flex-1 flex items-center">
              <SwitchRoot
                v-model:checked="part.show"
                @click.stop
                class="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 data-[state=checked]:bg-yellow-400 mr-3"
              >
                <SwitchThumb
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-4"
                />
              </SwitchRoot>
              <span class="text-sm text-gray-300 mr-[6px]">{{
                part.name
              }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click.stop="handleSelectEditPart(part.name)"
                :class="[
                  'p-1 rounded-full transition-all duration-300',
                  part.name === editPartChoose
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700',
                ]"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M832 512a32 32 0 0 1 32 32v352a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V192a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H224v640h608V544a32 32 0 0 1 32-32z"
                  />
                  <path
                    fill="currentColor"
                    d="M469.952 554.24l52.8-52.8 224 224-52.8 52.8-224-224zM872.704 196.544l-45.248-45.248a32 32 0 0 0-45.248 0L524.8 408.704l45.248 45.248 302.656-257.408a32 32 0 0 0 0-45.248z"
                  />
                </svg>
              </button>
              <button
                @click.stop="handleCopyEditCode(index)"
                class="p-1 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-gray-700 transition-all duration-300"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                  />
                  <path
                    fill="currentColor"
                    d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128z"
                  />
                </svg>
              </button>
              <button
                :disabled="index === 0"
                @click.stop="handleDeletePart(index)"
                :class="[
                  'p-1 rounded-full transition-all duration-300',
                  index === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-400 hover:bg-gray-700',
                ]"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 0 1 32 32v96a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-96a32 32 0 0 1 32-32h256zm64 0h192v-64H416v64zM192 352h640v576a64 64 0 0 1-64 64H256a64 64 0 0 1-64-64V352zm320 224v192h64V576H512z"
                  />
                </svg>
              </button>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            class="flex justify-between items-center p-2 px-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 rounded cursor-pointer"
          >
            <div class="flex-1 flex items-center">
              <span class="text-sm font-medium text-gray-300">添加新模块</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                disabled
                class="p-1 rounded-full text-gray-600 cursor-not-allowed"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M832 512a32 32 0 0 1 32 32v352a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V192a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H224v640h608V544a32 32 0 0 1 32-32z"
                  />
                  <path
                    fill="currentColor"
                    d="M469.952 554.24l52.8-52.8 224 224-52.8 52.8-224-224zM872.704 196.544l-45.248-45.248a32 32 0 0 0-45.248 0L524.8 408.704l45.248 45.248 302.656-257.408a32 32 0 0 0 0-45.248z"
                  />
                </svg>
              </button>
              <button
                disabled
                class="p-1 rounded-full text-gray-600 cursor-not-allowed"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                  />
                  <path
                    fill="currentColor"
                    d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128z"
                  />
                </svg>
              </button>
              <button
                @click.stop="handleAddNewPart"
                class="p-1 rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300"
              >
                <svg viewBox="0 0 1024 1024" class="w-4 h-4">
                  <path
                    fill="currentColor"
                    d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
                  />
                </svg>
              </button>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
          </Transition>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>

<style scoped></style>
