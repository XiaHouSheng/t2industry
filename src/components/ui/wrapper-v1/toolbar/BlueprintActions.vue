<script setup>
const emit = defineEmits(['save', 'import', 'export'])
</script>

<template>
  <div class="flex overflow-hidden rounded-lg border border-gray-600 h-8 w-auto min-w-[140px]">
    <button
      @click="emit('save')"
      class="px-4 py-2 bg-gray-600 border-r border-gray-600 text-gray-300 hover:bg-gray-500 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center h-8"
    >
      <img
        src="@/assets/img/save.png"
        class="w-[18px] h-[18px]"
      />
    </button>
    <button
      @click="emit('import')"
      class="px-4 py-2 bg-gray-600 border-r border-gray-600 text-gray-300 hover:bg-gray-500 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center h-8"
    >
      <img
        src="@/assets/img/import.png"
        class="w-[18px] h-[18px]"
      />
    </button>
    <button
      @click="emit('export')"
      class="px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center h-8"
    >
      <img
        src="@/assets/img/export.png"
        class="w-[18px] h-[18px]"
      />
    </button>
  </div>
</template>

<style scoped>
</style>
