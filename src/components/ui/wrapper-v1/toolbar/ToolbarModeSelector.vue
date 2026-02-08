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
    class="mr-3 rounded-lg overflow-hidden flex h-8 w-auto min-w-[200px] items-center"
  >
    <RadioGroupItem
      value="belts"
      class="flex-1 px-3 py-2 text-sm text-gray-300 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 bg-gray-600 last:border-r-0"
    >
      多带
    </RadioGroupItem>
    <RadioGroupItem
      value="select"
      class="flex-1 px-3 py-2 text-sm text-gray-300 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 bg-gray-600 last:border-r-0"
    >
      框选
    </RadioGroupItem>
    <RadioGroupItem
      value="default"
      class="flex-1 px-3 py-2 text-sm text-gray-300 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 bg-gray-600 last:border-r-0"
    >
      无
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<style scoped>
</style>
