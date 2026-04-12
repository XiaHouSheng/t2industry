<script setup>
const { isLoggedIn } = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['login', 'register', 'logout'])
</script>

<template>
  <div class="sidebar-login-actions flex flex-col justify-center gap-2">
    <template v-if="!isLoggedIn">
      <button
        @click="emit('login')"
        class="w-full px-4 py-2.5 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors font-medium"
      >
        登录
      </button>
      <button
        @click="emit('register')"
        class="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
      >
        注册
      </button>
    </template>

    <button
      v-else
      @click="emit('logout')"
      class="w-full px-4 py-2.5 rounded-lg border border-red-700 bg-red-900/30 text-red-300 hover:bg-red-800/40 transition-colors font-medium"
    >
      退出登录
    </button>
  </div>
</template>

<style scoped>
.sidebar-login-actions {
  padding: 1rem;
  margin-top: auto;
}
</style>
