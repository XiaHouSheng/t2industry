<script setup>
import { RadioGroupRoot, RadioGroupItem } from 'radix-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'belt'
  }
})

const emit = defineEmits(['update:modelValue'])

const handleModeChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="mr-3">
    <RadioGroupRoot
      :model-value="modelValue"
      @update:model-value="handleModeChange"
      class="rounded-lg overflow-hidden flex h-8 w-auto min-w-[150px] bg-gray-600 items-center"
    >
      <RadioGroupItem
        value="belt"
        class="flex-1 px-3 py-2 text-sm text-gray-300 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0"
      >
        传送带
      </RadioGroupItem>
      <RadioGroupItem
        value="pipe"
        class="flex-1 px-3 py-2 text-sm text-gray-300 cursor-pointer transition-all duration-300 hover:text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900 border-r border-gray-700 last:border-r-0"
      >
        管道
      </RadioGroupItem>
    </RadioGroupRoot>
  </div>
</template>

<style scoped>
</style>
