<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  House,
  Grid,
  User,
  UserFilled,
  View,
  Share,
  Link,
  Lock,
  Message,
  Check,
} from "@element-plus/icons-vue";
import { useHomeStore } from "../stores/HomeStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/wrapper-v1/dialog/index.js";
import {
  SelfCard,
  SidebarMenu,
  LoginActions,
} from "../components/ui/wrapper-v1/sidebar/index.js";
const router = useRouter();
const route = useRoute();
const homeStore = useHomeStore();

// 计算当前活动的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 计算页面标题
const pageTitle = computed(() => {
  switch (route.path) {
    case "/home":
      return "蓝图中枢 - HUB";
    case "/home/discover":
      return "发现蓝图 - DISCOVER";
    case "/home/self":
      return "个人蓝图 - SELF";
    default:
      return "我的";
  }
});

// 登录对话框
const loginDialogVisible = ref(false);

// 注册对话框
const registerDialogVisible = ref(false);

// 登录/注册模式切换
const isLogin = ref(true);

// 登录表单
const loginForm = ref({
  username: "",
  password: "",
});

// 注册表单
const registerForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  email: "",
  verificationCode: "",
});

// 验证码相关状态使用store中的状态

// 登录加载状态
const loginLoading = ref(false);

// 注册加载状态
const registerLoading = ref(false);

// 登录错误信息
const loginError = ref("");

// 注册错误信息
const registerError = ref("");

// 处理菜单选择
const handleMenuSelect = (key) => {
  router.push(key);
};

// 打开登录对话框
const openLoginDialog = () => {
  loginDialogVisible.value = true;
  loginError.value = "";
};

// 关闭登录对话框
const closeLoginDialog = () => {
  loginDialogVisible.value = false;
  loginError.value = "";
};

// 打开注册对话框
const openRegisterDialog = () => {
  registerDialogVisible.value = true;
  registerError.value = "";
};

// 关闭注册对话框
const closeRegisterDialog = () => {
  registerDialogVisible.value = false;
  registerError.value = "";
};

// 处理登录
const handleLogin = async () => {
  try {
    loginLoading.value = true;
    loginError.value = "";

    // 调用登录API
    const response = await homeStore.login(loginForm.value);

    // 登录成功，关闭对话框
    closeLoginDialog();

    // 刷新数据
    await homeStore.refreshData();
  } catch (err) {
    loginError.value = err.message || "登录失败";
    console.error("登录失败:", err);
  } finally {
    loginLoading.value = false;
  }
};

// 发送验证码
const sendVerificationCode = async () => {
  try {
    if (!registerForm.value.email) {
      registerError.value = "请输入邮箱";
      return;
    }

    registerError.value = "";

    // 调用store中的发送验证码方法
    const result = await homeStore.sendVerificationCode(
      registerForm.value.email,
    );

    // 提示成功
    registerError.value = result.message;
  } catch (err) {
    registerError.value = err.message || "发送验证码失败";
    console.error("发送验证码失败:", err);
  }
};

// 处理注册
const handleRegister = async () => {
  try {
    // 验证密码
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      registerError.value = "两次输入的密码不一致";
      return;
    }

    // 验证必要字段
    if (
      !registerForm.value.username ||
      !registerForm.value.password ||
      !registerForm.value.email ||
      !registerForm.value.verificationCode ||
      !registerForm.value.nickname
    ) {
      registerError.value = "请填写所有必要字段";
      return;
    }

    registerLoading.value = true;
    registerError.value = "";

    // 调用注册API
    const response = await homeStore.register({
      username: registerForm.value.username,
      password: registerForm.value.password,
      nickname: registerForm.value.nickname,
      email: registerForm.value.email,
      verificationCode: registerForm.value.verificationCode,
    });

    // 注册成功，关闭注册对话框并打开登录对话框
    closeRegisterDialog();
    loginError.value = "注册成功，请登录";
    openLoginDialog();

    // 清空注册表单
    registerForm.value = {
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      email: "",
      verificationCode: "",
    };

    // 重置倒计时
    homeStore.clearCountdown();
  } catch (err) {
    registerError.value = err.message || "注册失败";
    console.error("注册失败:", err);
  } finally {
    registerLoading.value = false;
  }
};

// 处理登出
const handleLogout = () => {
  homeStore.logout();
};

// 初始化
const init = async () => {
  // 检查登录状态
  homeStore.checkLoginStatus();

  // 加载数据
  await homeStore.refreshData();
};

// 初始化时加载数据
onMounted(() => {
  init();
});

// 组件卸载时清理
onUnmounted(() => {
  // 清理倒计时（现在在store中管理）
  homeStore.clearCountdown();
});
</script>

<template>
  <el-row :gutter="6">
    <el-col :span="4">
      <div class="h-[780px] p-[15px] bg-[#111827] shadow-xl flex flex-col">
        <SelfCard :userInfo="homeStore.userInfo" />
        <div class="h-px bg-gray-800 my-2"></div>
        <SidebarMenu :active-menu="activeMenu" @select="handleMenuSelect" />
        <LoginActions @login="openLoginDialog" @register="openRegisterDialog" />

        <!-- 登录对话框 -->
        <Dialog v-model:open="loginDialogVisible">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>用户登录</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <div class="relative">
                  <User
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="loginForm.username"
                    type="text"
                    placeholder="请输入用户名"
                    autocomplete="username"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div class="relative">
                  <Lock
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    autocomplete="password"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div
                v-if="loginError"
                class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {{ loginError }}
              </div>
            </form>
            <DialogFooter>
              <button
                @click="closeLoginDialog"
                class="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                @click="handleLogin"
                :disabled="loginLoading"
                class="px-4 py-2 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
              >
                {{ loginLoading ? "登录中..." : "登录" }}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- 注册对话框 -->
        <Dialog v-model:open="registerDialogVisible">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>用户注册</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleRegister" class="space-y-4">
              <div>
                <div class="relative">
                  <User
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="registerForm.username"
                    type="text"
                    placeholder="请输入用户名"
                    autocomplete="username"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div class="relative">
                  <UserFilled
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="registerForm.nickname"
                    type="text"
                    placeholder="请输入昵称"
                    autocomplete="nickname"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div class="relative">
                  <Message
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="请输入邮箱"
                    autocomplete="email"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <Check
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                    />
                    <input
                      v-model="registerForm.verificationCode"
                      type="text"
                      placeholder="请输入验证码"
                      autocomplete="one-time-code"
                      class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    @click="sendVerificationCode"
                    :disabled="
                      homeStore.sendCodeLoading || homeStore.codeCountdown > 0
                    "
                    class="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap min-w-[120px]"
                  >
                    {{
                      homeStore.codeCountdown > 0
                        ? `${homeStore.codeCountdown}s后重发`
                        : "发送验证码"
                    }}
                  </button>
                </div>
              </div>
              <div>
                <div class="relative">
                  <Lock
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="registerForm.password"
                    type="password"
                    placeholder="请输入密码"
                    autocomplete="new-password"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div class="relative">
                  <Check
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="请确认密码"
                    autocomplete="new-password"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-850 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              <div
                v-if="registerError"
                class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {{ registerError }}
              </div>
            </form>
            <DialogFooter>
              <button
                @click="closeRegisterDialog"
                class="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                @click="handleRegister"
                :disabled="registerLoading"
                class="px-4 py-2 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
              >
                {{ registerLoading ? "注册中..." : "注册" }}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="h-[780px] bg-[#1a1a1a] shadow-xl flex flex-col">
        <img
            src="https://patchwiki.biligame.com/images/zmd/0/0a/7oc2v8kqfgzaltfwm42og404l57kha4.png"
            alt="装饰图片"
            class="absolute top-1/2 left-3/5 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] object-contain opacity-50 pointer-events-none z-0"
          />
        <div class="flex-1 overflow-y-auto overflow-x-hidden relative">
          <router-view @openLoginDialog="openLoginDialog"></router-view>
          
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
/* 滚动条美化 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sheng-side-menu {
    height: auto;
    padding: 10px;
  }
  .sheng-home-main {
    height: auto;
  }
  .sheng-menu-header {
    flex-direction: column;
    text-align: center;
  }
  .sheng-menu-header > div:first-child {
    margin-bottom: 10px;
  }
}
</style>
