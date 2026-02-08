<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedArea: {
    type: String,
    default: ''
  },
  areas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:searchQuery', 'update:selectedArea', 'search'])

const localSearchQuery = ref(props.searchQuery)
const localSelectedArea = ref(props.selectedArea)

const handleSearchInput = () => {
  emit('update:searchQuery', localSearchQuery.value)
  emit('search')
}

const handleAreaChange = () => {
  emit('update:selectedArea', localSelectedArea.value)
  emit('search')
}

watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal
})

watch(() => props.selectedArea, (newVal) => {
  localSelectedArea.value = newVal
})
</script>

<template>
  <div class="search-filter-section mb-2.5 sticky top-0 z-10 bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
    <div class="flex gap-3">
      <div class="flex-1">
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="localSearchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="输入关键字检索蓝图"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 hover:border-gray-600 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.2)]"
          />
        </div>
      </div>
      <div class="w-48">
        <div class="relative">
          <select
            v-model="localSelectedArea"
            @change="handleAreaChange"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer transition-all duration-300 hover:border-gray-600 appearance-none focus:shadow-[0_0_0_3px_rgba(234,179,8,0.2)]"
          >
            <option value="">全部地区</option>
            <option v-for="area in areas" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
          <svg
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 8l4 4 4-4"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select option {
  background-color: #1f2937;
  color: #ffffff;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border: none;
}

select option:hover,
select option:focus {
  background-color: #eab308;
  color: #000000;
}

select option:checked {
  background-color: #eab308;
  color: #000000;
  font-weight: 600;
}
</style>
