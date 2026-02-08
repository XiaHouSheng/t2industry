<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 12
  },
  pageSizes: {
    type: Array,
    default: () => [12, 24, 36]
  },
  total: {
    type: Number,
    default: 0
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'size-change', 'current-change'])

const jumperValue = ref(props.currentPage)

watch(() => props.currentPage, (newVal) => {
  jumperValue.value = newVal
})

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

const startItem = computed(() => {
  return props.total === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.currentPage
  const delta = 2

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= delta + 2) {
      for (let i = 1; i <= delta + 2; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - delta - 1) {
      pages.push(1)
      pages.push('...')
      for (let i = total - delta - 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - delta; i <= current + delta; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('current-change', page)
}

const handlePrev = () => {
  handlePageChange(props.currentPage - 1)
}

const handleNext = () => {
  handlePageChange(props.currentPage + 1)
}

const handleSizeChange = (event) => {
  const size = parseInt(event.target.value)
  emit('update:pageSize', size)
  emit('size-change', size)
}

const handleJumper = () => {
  const page = parseInt(jumperValue.value)
  if (page >= 1 && page <= totalPages.value) {
    handlePageChange(page)
  } else {
    jumperValue.value = props.currentPage
  }
}
</script>

<template>
  <div class="pagination flex items-center justify-between gap-4 flex-wrap">
    <div v-if="layout.includes('total')" class="pagination-total text-sm text-gray-400">
      共 <span class="text-white font-medium">{{ total }}</span> 条
      <span class="mx-2">|</span>
      第 <span class="text-white font-medium">{{ startItem }}-{{ endItem }}</span> 条
    </div>

    <div class="pagination-controls flex items-center gap-2 flex-wrap">
      <div class="pagination-sizes-wrapper relative">
        <select
          v-if="layout.includes('sizes')"
          :value="pageSize"
          @change="handleSizeChange"
          class="pagination-sizes px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer transition-all duration-300 hover:border-gray-600"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }} 条/页
          </option>
        </select>
      </div>

      <button
        v-if="layout.includes('prev')"
        @click="handlePrev"
        :disabled="currentPage === 1"
        class="pagination-btn px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        上一页
      </button>

      <div v-if="layout.includes('pager')" class="pagination-pager flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="page !== '...' ? handlePageChange(page) : null"
          :class="[
            'pagination-page px-4 py-2 rounded-xl border text-sm transition-all duration-300 transform',
            page === currentPage
              ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
              : page === '...'
              ? 'border-transparent bg-transparent text-gray-500 cursor-default'
              : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-600 hover:scale-105 active:scale-95'
          ]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>

      <button
        v-if="layout.includes('next')"
        @click="handleNext"
        :disabled="currentPage === totalPages"
        class="pagination-btn px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        下一页
      </button>

      <div v-if="layout.includes('jumper')" class="pagination-jumper flex items-center gap-2 text-sm text-gray-400">
        <span>前往</span>
        <input
          type="number"
          v-model="jumperValue"
          @keyup.enter="handleJumper"
          :min="1"
          :max="totalPages"
          class="pagination-input w-16 px-3 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-yellow-500 text-center transition-all duration-300 hover:border-gray-600 hover:bg-gray-750"
        />
        <span>页</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination-sizes-wrapper {
  position: relative;
}

.pagination-sizes {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23eab308' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em 1em;
  padding-right: 2rem;
  min-width: 100px;
  cursor: pointer;
}

.pagination-sizes:hover {
  border-color: #eab308;
}

.pagination-sizes:focus {
  outline: none;
  border-color: #eab308;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.2);
}

.pagination-sizes option {
  background-color: #1f2937;
  color: #ffffff;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border: none;
}

.pagination-sizes option:hover,
.pagination-sizes option:focus {
  background-color: #eab308;
  color: #000000;
}

.pagination-sizes option:checked {
  background-color: #eab308;
  color: #000000;
  font-weight: 600;
}

.pagination-input::-webkit-inner-spin-button,
.pagination-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pagination-input[type='number'] {
  -moz-appearance: textfield;
}

.pagination-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
}

.pagination-page {
  min-width: 40px;
}

.pagination-btn {
  min-width: 80px;
}
</style>
