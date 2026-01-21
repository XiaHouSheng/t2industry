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
} from "@element-plus/icons-vue";
import { useHomeStore } from "../stores/HomeStore";
import apiClient from "../utils/api-client";

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
      <div class="sheng-side-menu test-border display-flex flex-direation-col">
        <div
          class="sheng-menu-header display-flex flex-direation-col p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md"
        >
          <div
            class="display-flex flex-direation-row align-items-center justify-content-center mb-3"
          >
            <el-avatar
              size="large"
              :icon="User"
              :src="null"
              class="bg-white text-blue-600"
            >
              {{ homeStore.userInfo.avatar }}
            </el-avatar>
          </div>
          <div class="display-flex flex-direation-col align-items-center">
            <el-text
              v-if="homeStore.userInfo.isLoggedIn"
              class="font-bold text-lg mb-1"
            >
              {{ homeStore.userInfo.username }}
            </el-text>
            <el-text v-else class="font-bold text-lg mb-1">未登录</el-text>
            <el-text
              v-if="homeStore.userInfo.isLoggedIn"
              size="small"
              class="text-blue-100 mb-2"
            >
              ID: {{ homeStore.userInfo.id }}
            </el-text>
            <el-text v-else size="small" class="text-blue-100 mb-2 text-center">
              请登录以使用完整功能
            </el-text>
            <div
              v-if="homeStore.userInfo.isLoggedIn"
              class="w-full bg-blue-700 bg-opacity-50 rounded-full h-1 mt-1 mb-1"
            ></div>
            <div
              v-if="homeStore.userInfo.isLoggedIn"
              class="w-full display-flex flex-direation-row justify-content-center gap-2"
            >
              <el-tag
                size="small"
                effect="light"
                class="bg-blue-700 text-white"
              >
                用户
              </el-tag>
            </div>
          </div>
        </div>
        <div class="sheng-menu">
          <div class="sheng-menu-item">
            <el-menu :default-active="activeMenu" @select="handleMenuSelect">
              <el-menu-item index="/home">
                <el-icon><House /></el-icon>
                <span>首页</span>
              </el-menu-item>
              <el-menu-item index="/home/discover">
                <el-icon><Grid /></el-icon>
                <span>发现蓝图</span>
              </el-menu-item>
              <el-menu-item index="/home/self">
                <el-icon><User /></el-icon>
                <span>个人蓝图</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div
          style="margin-top: auto"
          class="sheng-login-cont display-flex flex-direation-column justify-content-center gap-2"
        >
          <el-button color="blue" @click="openLoginDialog" style="width: 100%"
            >登录</el-button
          >
          <el-button
            color="blue"
            @click="openRegisterDialog"
            style="width: 100%"
            >注册</el-button
          >
        </div>

        <!-- 登录对话框 -->
        <el-dialog
          v-model="loginDialogVisible"
          title="用户登录"
          width="450px"
          :close-on-click-modal="false"
        >
          <form @submit.prevent="handleLogin">
            <div style="padding: 0 20px">
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  prefix-icon="User"
                  autocomplete="username"
                ></el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  autocomplete="password"
                ></el-input>
              </div>
              <div v-if="loginError" style="margin-bottom: 20px">
                <el-alert
                  :title="loginError"
                  type="error"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>
          </form>
          <template #footer>
            <span>
              <el-button @click="closeLoginDialog">取消</el-button>
              <el-button
                type="primary"
                :loading="loginLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 注册对话框 -->
        <el-dialog
          v-model="registerDialogVisible"
          title="用户注册"
          width="450px"
          :close-on-click-modal="false"
        >
          <form @submit.prevent="handleRegister">
            <div style="padding: 0 20px">
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  :prefix-icon="User"
                  autocomplete="username"
                ></el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.nickname"
                  placeholder="请输入昵称"
                  :prefix-icon="UserFilled"
                  autocomplete="nickname"
                ></el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.email"
                  placeholder="请输入邮箱"
                  :prefix-icon="Mail"
                  autocomplete="email"
                ></el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.verificationCode"
                  placeholder="请输入验证码"
                  :prefix-icon="Message"
                  autocomplete="one-time-code"
                >
                  <template #append>
                    <el-button
                      :loading="homeStore.sendCodeLoading"
                      :disabled="homeStore.codeCountdown > 0"
                      @click="sendVerificationCode"
                    >
                      {{
                        homeStore.codeCountdown > 0
                          ? `${homeStore.codeCountdown}s后重发`
                          : "发送验证码"
                      }}
                    </el-button>
                  </template>
                </el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  autocomplete="new-password"
                ></el-input>
              </div>
              <div style="margin-bottom: 20px">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请确认密码"
                  :prefix-icon="Check"
                  autocomplete="new-password"
                ></el-input>
              </div>
              <div v-if="registerError" style="margin-bottom: 20px">
                <el-alert
                  :title="registerError"
                  type="error"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>
          </form>
          <template #footer>
            <span>
              <el-button @click="closeRegisterDialog">取消</el-button>
              <el-button
                type="primary"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="sheng-home-main display-flex flex-direation-col test-border">
        <div class="display-flex flex-direation-row">
          <div
            class="display-flex flex-direation-col justify-content-center"
            style="margin-left: 12px;padding-top: 2px"
          >
            <el-icon :size="28"><Grid></Grid></el-icon>
          </div>

          <div
            class="sheng-main-header display-flex flex-direation-col justify-content-center"
          >
            <h2 style="margin: 0">{{ pageTitle }}</h2>
          </div>
        </div>

        <div class="sheng-child-main flex-grow-1">
          <router-view @openLoginDialog="openLoginDialog"></router-view>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.sheng-child-main {
  overflow-y: auto;
  overflow-x: hidden;
  min-height: auto;
  padding: 6px;
}
.sheng-main-header {
  width: 100%;
  height: auto;
  padding: 12px 0 12px 0;
}
.sheng-login-cont {
  padding: 12px;
  margin-top: 10px;
}
.sheng-menu-header {
  margin-bottom: 15px;
}
.sheng-side-menu {
  height: 740px;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.sheng-home-main {
  height: 740px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.sheng-menu {
  margin-bottom: 20px;
}
.sheng-login-cont {
  padding: 0;
  border: none;
}
.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 18px;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-1 {
  margin-top: 4px;
}

.text-center {
  text-align: center;
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

  /* 登录对话框响应式调整 */
  .login-dialog {
    width: 90% !important;
  }

  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer .el-button {
    width: 100% !important;
    margin-bottom: 10px;
  }

  .dialog-footer .el-button:last-child {
    margin-bottom: 0;
  }
}
</style>
