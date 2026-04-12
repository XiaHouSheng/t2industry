import { defineStore } from 'pinia';
import apiClient from '../utils/api-client';

export const useHomeStore = defineStore('home', {
  state: () => ({
    // 用户信息
    userInfo: {
      isLoggedIn: false,
      username: '',
      id: '',
      avatar: 'user'
    },
        // 统计数据
    totalBlueprints: 0,
    totalUserBlueprints: 0,
    totalUsers: 0,
    totalViews: 0,
    totalDownloads: 0,
    // 热门蓝图
    hotBlueprints: [],
    // 蓝图列表
    allBlueprints: [],
    discoverBlueprints: [],
    // 用户蓝图分页相关
    userBlueprintsPage: 1,
    userBlueprintsLimit: 10,
    userBlueprintsTotal: 0,
    userBlueprintsArea: null,
    // 筛选条件
    searchQuery: '',
    selectedArea: '',
    // 分页相关
    currentPage: 1,
    pageSize: 10,
    total: 0,
    // 验证码相关
    codeCountdown: 0,
    sendCodeLoading: false,
    // 加载状态
    loading: {
      stats: false,
      blueprints: false,
      discover: false,
      user: false
    },
    // 错误信息
    error: null
  }),

  actions: {
    resolveFileHash(uploadResponse) {
      const payload = uploadResponse?.data;

      if (typeof payload === 'string') {
        return payload;
      }

      return payload?.fileHash || payload?.file_hash || payload?.hash || '';
    },

    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = {
        isLoggedIn: true,
        username: info.nickname || info.username || '',
        id: info.id || '',
        avatar: info.avatar || 'user',
        role: info.role || 'user'
      };
    },

    // 注册
    async register(userData) {
      try {
        this.loading.user = true;
        const response = await apiClient.register(userData);
        return response;
      } catch (err) {
        this.error = err.message || '注册失败';
        throw err;
      } finally {
        this.loading.user = false;
      }
    },

    // 发送验证码
    async sendVerificationCode(email) {
      try {
        if (!email) {
          throw new Error('请输入邮箱');
        }

        this.sendCodeLoading = true;
        this.error = null;

        await apiClient.sendVerificationCode({ email });

        this.codeCountdown = 60;
        this.startCountdown();

        return { success: true, message: '验证码已发送，请查收' };
      } catch (err) {
        this.error = err.message || '发送验证码失败';
        throw err;
      } finally {
        this.sendCodeLoading = false;
      }
    },

    // 开始倒计时
    startCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }

      this.countdownTimer = setInterval(() => {
        if (this.codeCountdown > 0) {
          this.codeCountdown--;
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
      }, 1000);
    },

    // 清除倒计时
    clearCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.codeCountdown = 0;
      }
    },

    // 清除用户信息（登出）
    clearUserInfo() {
      this.userInfo = {
        isLoggedIn: false,
        username: '',
        id: '',
        avatar: 'user'
      };
    },

    // 检查登录状态
    async checkLoginStatus() {
      // 当前后端使用 HttpOnly Cookie 维护登录态
      await this.loadUserInfo();
    },

    // 加载用户信息
    async loadUserInfo() {
      try {
        this.loading.user = true;
        const response = await apiClient.getUserInfo();
        this.setUserInfo(response.data || {});
      } catch (err) {
        this.clearUserInfo();
      } finally {
        this.loading.user = false;
      }
    },

    // 登录
    async login(credentials) {
      try {
        this.loading.user = true;
        const response = await apiClient.login(credentials);

        // 登录成功后通过 /user/info 获取完整用户信息
        await this.loadUserInfo();
        return response.data;
      } catch (err) {
        this.error = err.message || '登录失败';
        throw err;
      } finally {
        this.loading.user = false;
      }
    },

        // 登出
    logout() {
      // Cookie 由后端控制，这里仅清理前端状态
      this.clearUserInfo();
    },

    // 上传文件并创建蓝图
    async createUserBlueprint({ name, description, area, file }) {
      const uploadResponse = await apiClient.uploadBlueprint(file);
      const fileHash = this.resolveFileHash(uploadResponse);

      if (!fileHash) {
        throw new Error('上传失败：未获取到文件哈希');
      }

      return await apiClient.createBlueprint({
        name,
        description,
        area,
        fileHash
      });
    },

    // 重新上传蓝图文件并更新 fileHash
    async reuploadBlueprint(blueprintId, file) {
      const uploadResponse = await apiClient.uploadBlueprint(file);
      const fileHash = this.resolveFileHash(uploadResponse);

      if (!fileHash) {
        throw new Error('重新上传失败：未获取到文件哈希');
      }

      return await apiClient.updateBlueprint(blueprintId, { fileHash });
    },

    // 删除用户蓝图
    async deleteUserBlueprint(blueprintId) {
      return await apiClient.deleteBlueprint(blueprintId);
    },

    // 加载统计数据
    async loadStats() {
      try {
        this.loading.stats = true;
        const response = await apiClient.getHomepageData();
        const homepageData = response.data || {};

        this.totalBlueprints = homepageData.totalBlueprints || 0;
        this.totalUsers = homepageData.totalUsers || 0;
        this.totalViews = homepageData.totalViews || 0;
        this.totalDownloads = homepageData.totalDownloads || 0;

        this.hotBlueprints = Array.isArray(homepageData.hotBlueprints)
          ? homepageData.hotBlueprints.slice(0, 7)
          : [];
      } catch (err) {
        this.error = err.message || '加载统计数据失败';
        console.error('加载统计数据失败:', err);
      } finally {
        this.loading.stats = false;
      }
    },

    // 加载蓝图列表
    async loadBlueprints(filters = {}) {
      try {
        this.loading.blueprints = true;
        const response = await apiClient.getUserBlueprints({
          sortBy: filters.sortBy || 'views',
          sortOrder: filters.sortOrder || 'desc',
          page: filters.page || this.userBlueprintsPage,
          limit: filters.limit || this.userBlueprintsLimit,
          area: filters.area || this.userBlueprintsArea,
        });

        this.allBlueprints = Array.isArray(response.data?.items) ? response.data.items : [];

                this.userBlueprintsTotal = response.data?.total || 0;
                this.userBlueprintsPage = response.data?.page || 1;
                this.userBlueprintsLimit = response.data?.limit || 10;
                this.totalUserBlueprints = this.userBlueprintsTotal;

                this.totalViews = Array.isArray(this.allBlueprints)
          ? this.allBlueprints.reduce((sum, bp) => sum + (bp.views || 0), 0)
          : 0;
        this.totalDownloads = Array.isArray(this.allBlueprints)
          ? this.allBlueprints.reduce((sum, bp) => sum + (bp.downloads || 0), 0)
          : 0;
      } catch (err) {
        this.error = err.message || '加载蓝图失败';
                this.allBlueprints = [];
        this.userBlueprintsTotal = 0;
        this.totalUserBlueprints = 0;
      } finally {
        this.loading.blueprints = false;
      }
    },

    // 刷新数据
    async refreshData() {
      if (this.userInfo.isLoggedIn) {
        await Promise.all([
          this.loadStats(),
          this.loadBlueprints()
        ]);
        return;
      }

      await this.loadStats();
    },

    // 加载发现页面蓝图数据（支持分页和筛选）
    async loadDiscoverBlueprints(page = 1, filters = {}) {
      try {
        this.loading.discover = true;
        this.error = null;

        const searchFilters = {
          search: filters.search || this.searchQuery,
          area: filters.area || this.selectedArea,
          sortBy: 'views',
          sortOrder: 'desc',
          page,
          limit: filters.limit || this.pageSize
        };

        const response = await apiClient.searchBlueprints(searchFilters);
        this.discoverBlueprints = Array.isArray(response.data?.items) ? response.data.items : [];
        this.total = response.data?.total || 0;
        this.currentPage = page;
        this.searchQuery = filters.search || this.searchQuery;
        this.selectedArea = filters.area || this.selectedArea;
      } catch (err) {
        this.error = err.message || '加载蓝图失败';
        console.error('加载发现页面蓝图失败:', err);
        this.discoverBlueprints = [];
        this.total = 0;
      } finally {
        this.loading.discover = false;
      }
    },

    // 设置搜索和筛选条件
    setSearchFilters(filters) {
      if (filters.search !== undefined) {
        this.searchQuery = filters.search;
      }
      if (filters.area !== undefined) {
        this.selectedArea = filters.area;
      }
      if (filters.page !== undefined) {
        this.currentPage = filters.page;
      }
      if (filters.pageSize !== undefined) {
        this.pageSize = filters.pageSize;
      }
    },

    async getBlueprintById(blueprintId) {
      return await apiClient.getBlueprintById(blueprintId);
    }
  }
});
