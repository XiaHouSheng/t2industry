<script setup>
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      isLoggedIn: false,
      username: '',
      id: '',
      avatar: ''
    })
  }
})
</script>

<template>
  <div class="self-card flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50 shadow-lg">
    <div class="flex-shrink-0">
      <div class="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500 text-xl font-bold border-2 border-yellow-500/30">
        {{ userInfo.avatar || (userInfo.isLoggedIn ? userInfo.username?.charAt(0) : '未') }}
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <h3 v-if="userInfo.isLoggedIn" class="font-bold text-base mb-1 text-white truncate">
        {{ userInfo.username }}
      </h3>

      <h3 v-else class="font-bold text-base mb-1 text-white">未登录</h3>

      <p v-if="userInfo.isLoggedIn" class="text-xs text-gray-400 mb-1.5 truncate">
        ID: {{ userInfo.id }}
      </p>

      <p v-else class="text-xs text-gray-400 mb-1.5 truncate">
        请登录以使用完整功能
      </p>

      <div
        v-if="userInfo.isLoggedIn"
        class="inline-flex items-center gap-2"
      >
        <span class="px-2 py-0.5 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          用户
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
