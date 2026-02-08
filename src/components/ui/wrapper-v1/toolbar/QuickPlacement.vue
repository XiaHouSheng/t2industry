<script setup>
import { RadioGroupRoot, RadioGroupItem } from 'radix-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['update:modelValue'])

const handleModeChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <RadioGroupRoot
    :model-value="modelValue"
    @update:model-value="handleModeChange"
    class="mr-3 rounded-lg overflow-hidden flex h-8 w-auto min-w-[250px] items-center"
  >
    <RadioGroupItem
      value="turn"
      class="flex-1 px-2 py-2 bg-gray-600 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0 flex items-center justify-center"
    >
      <div class="flex items-center justify-center w-5 h-5">
        <img
          src="@/assets/img/turn.png"
          class="w-[18px] h-[18px]"
        />
      </div>
    </RadioGroupItem>
    <RadioGroupItem
      value="belt"
      class="flex-1 px-2 py-2 bg-gray-600 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0 flex items-center justify-center"
    >
      <div class="flex items-center justify-center w-5 h-5">
        <img
          src="@/assets/img/belt.png"
          class="w-[18px] h-[18px]"
        />
      </div>
    </RadioGroupItem>
    <RadioGroupItem
      value="splitter"
      class="flex-1 px-2 py-2 bg-gray-600 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0 flex items-center justify-center"
    >
      <div class="flex items-center justify-center w-5 h-5">
        <img
          src="@/assets/img/one_to_three.png"
          class="w-[18px] h-[18px]"
        />
      </div>
    </RadioGroupItem>
    <RadioGroupItem
      value="conveyer"
      class="flex-1 px-2 py-2 bg-gray-600 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0 flex items-center justify-center"
    >
      <div class="flex items-center justify-center w-5 h-5">
        <img
          src="@/assets/img/three_to_one.png"
          class="w-[18px] h-[18px]"
        />
      </div>
    </RadioGroupItem>
    <RadioGroupItem
      value="cross"
      class="flex-1 px-2 py-2 bg-gray-600 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0 flex items-center justify-center"
    >
      <div class="flex items-center justify-center w-5 h-5">
        <img
          src="@/assets/img/cross.png"
          class="w-[18px] h-[18px]"
        />
      </div>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<style scoped>
</style>
