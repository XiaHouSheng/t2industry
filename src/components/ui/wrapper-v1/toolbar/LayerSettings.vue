<script setup>
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem } from 'radix-vue'
import { SwitchRoot, SwitchThumb } from 'radix-vue'

const props = defineProps({
  showSupplierExtent: {
    type: Boolean,
    default: false
  },
  showBelts: {
    type: Boolean,
    default: true
  },
  showPipes: {
    type: Boolean,
    default: true
  },
  showPipePort: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:showSupplierExtent', 'update:showBelts', 'update:showPipes', 'update:showPipePort'])

const handleSupplierExtentChange = (value) => {
  emit('update:showSupplierExtent', value)
}

const handleBeltsChange = (value) => {
  emit('update:showBelts', value)
}

const handlePipesChange = (value) => {
  emit('update:showPipes', value)
}

const handlePipePortChange = (value) => {
  emit('update:showPipePort', value)
}
</script>

<template>
  <div>
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        class="px-4 py-2 text-sm text-gray-300 bg-gray-600 border border-gray-600 rounded hover:bg-gray-500 hover:text-yellow-400 hover:border-yellow-400 transition-all duration-300 flex items-center gap-2 h-8 w-auto min-w-[100px]"
      >
        图层设置
        <svg viewBox="0 0 1024 1024" class="w-4 h-4">
          <path fill="currentColor" d="M840.4 300H183.6c-19.7 0-38.1 7.4-51.6 21.6L512 608.4 892 321.6c-13.5-14.2-31.9-21.6-51.6-21.6H183.6c-19.7 0-38.1 7.4-51.6 21.6L512 608.4 892 321.6c-13.5-14.2-31.9-21.6-51.6-21.6z"/>
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <Transition
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <DropdownMenuContent
            class="bg-gray-900 border border-gray-700 rounded-lg shadow-lg min-w-[180px] overflow-hidden p-1"
            align="start"
          >
        <DropdownMenuItem
          class="flex justify-between items-center p-2 px-4 hover:bg-gray-800 transition-colors duration-300 rounded cursor-pointer"
        >
          <span class="text-sm text-gray-300">供电范围</span>
          <SwitchRoot
            :checked="showSupplierExtent"
            @click.stop
            @update:checked="handleSupplierExtentChange"
            class="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 data-[state=checked]:bg-yellow-400"
          >
            <SwitchThumb
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-4"
            />
          </SwitchRoot>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex justify-between items-center p-2 px-4 hover:bg-gray-800 transition-colors duration-300 rounded cursor-pointer"
        >
          <span class="text-sm text-gray-300">传送带</span>
          <SwitchRoot
            :checked="showBelts"
            @click.stop
            @update:checked="handleBeltsChange"
            class="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 data-[state=checked]:bg-yellow-400"
          >
            <SwitchThumb
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-4"
            />
          </SwitchRoot>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex justify-between items-center p-2 px-4 hover:bg-gray-800 transition-colors duration-300 rounded cursor-pointer"
        >
          <span class="text-sm text-gray-300">管道</span>
          <SwitchRoot
            :checked="showPipes"
            @click.stop
            @update:checked="handlePipesChange"
            class="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 data-[state=checked]:bg-yellow-400"
          >
            <SwitchThumb
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-4"
            />
          </SwitchRoot>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex justify-between items-center p-2 px-4 hover:bg-gray-800 transition-colors duration-300 rounded cursor-pointer"
        >
          <span class="text-sm text-gray-300">液体管口</span>
          <SwitchRoot
            :checked="showPipePort"
            @click.stop
            @update:checked="handlePipePortChange"
            class="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 data-[state=checked]:bg-yellow-400"
          >
            <SwitchThumb
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-4"
            />
          </SwitchRoot>
        </DropdownMenuItem>
      </DropdownMenuContent>
          </Transition>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>

<style scoped>
</style>
