<script setup>
const props = defineProps({
  selectedArea: {
    type: String,
    default: ''
  },
  areas: {
    type: Array,
    default: () => []
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectedArea', 'upload'])

const handleAreaChange = (event) => {
  emit('update:selectedArea', event.target.value)
}

const handleUpload = () => {
  emit('upload')
}
</script>

<template>
  <div class="action-filter-section flex items-center gap-3 flex-wrap">
    <div class="filter-section relative">
      <select
        :value="selectedArea"
        @change="handleAreaChange"
        class="w-48 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer transition-all duration-300 hover:border-gray-600 appearance-none"
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
    <div class="action-section">
      <button
        @click="handleUpload"
        :disabled="!isLoggedIn"
        :class="[
          'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2',
          !isLoggedIn || loading
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
        ]"
      >
        <svg
          v-if="loading"
          class="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0 4.411 3.589 8 8 8s8-3.589 8-8a7.962 7.962 0 01-2.709-5.291z"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        上传蓝图
      </button>
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

select:focus {
  outline: none;
  border-color: #eab308;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.2);
}
</style>
