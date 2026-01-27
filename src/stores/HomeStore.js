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
    // 筛选条件
    searchQuery: '',
    selectedArea: '',
    // 分页相关
    currentPage: 1,
    pageSize: 12,
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
    // 设置用户信息
    setUserInfo(info) {
      //console.log("setUserInfo",info)
      this.userInfo = {
        isLoggedIn: true,
        username: info.nickname || '',
        id: info.id || '',
        avatar: info.avatar || 'user',
        role: 'user' // 固定为user，不可外部传入
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
        
        // 调用发送验证码API
        await apiClient.sendVerificationCode({ email });
        
        // 开始倒计时
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
      // 清除之前的计时器
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
    checkLoginStatus() {
      //console.log("checkLoginStatus")
      const token = localStorage.getItem('token');
      if (token) {
        apiClient.setToken(token);
        this.loadUserInfo();
      }
    },
    
    // 加载用户信息
    async loadUserInfo() {
      try {
        this.loading.user = true;
        const response = await apiClient.getUserInfo();
        //console.log(response)
        this.setUserInfo(response.data || {});
      } catch (err) {
        console.error('加载用户信息失败:', err);
        // 如果加载失败，清除token
        localStorage.removeItem('token');
        apiClient.setToken(null);
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
        if (response.data.token) {
          // 保存token
          apiClient.setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          
          // 设置用户信息
          this.setUserInfo(response.data.user || {});
          return response.data;
        }
      } catch (err) {
        this.error = err.message || '登录失败';
        throw err;
      } finally {
        this.loading.user = false;
      }
    },
    
    // 登出
    logout() {
      // 清除token
      apiClient.setToken(null);
      localStorage.removeItem('token');
      
      // 清除用户信息
      this.clearUserInfo();
    },
    
    // 加载统计数据
    async loadStats() {
      try {
        this.loading.stats = true;
        // 使用新的主页数据接口获取统计数据
        const response = await apiClient.getHomepageData();
        const homepageData = response.data || {};
        
        // 更新统计数据
        this.totalBlueprints = homepageData.totalBlueprints || 0;
        this.totalUsers = homepageData.totalUsers || 0;
        this.totalViews = homepageData.totalViews || 0;
        this.totalDownloads = homepageData.totalDownloads || 0;
        
        // 更新热门蓝图
        this.hotBlueprints = Array.isArray(homepageData.hotBlueprints) ? homepageData.hotBlueprints.slice(0, 4) : [];
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
        // 使用新的获取用户蓝图接口
        const response = await apiClient.getUserBlueprints({
          sortBy: filters.sortBy || 'createdAt',
          sortOrder: filters.sortOrder || 'desc',
          page: filters.page || this.userBlueprintsPage,
          limit: filters.limit || this.userBlueprintsLimit
        });
        // 确保allBlueprints始终是数组
        this.allBlueprints = Array.isArray(response.data?.items) ? response.data.items : [];
        
        // 更新用户蓝图分页相关数据
        this.userBlueprintsTotal = response.data?.total || 0;
        this.userBlueprintsPage = response.data?.page || 1;
        this.userBlueprintsLimit = response.data?.limit || 10;
        
        // 计算热门蓝图（按浏览量排序）
        this.hotBlueprints = [...this.allBlueprints]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);
        
        // 更新统计数据
        this.totalBlueprints = this.allBlueprints.length;
        // 确保在使用reduce之前allBlueprints是数组
        this.totalViews = Array.isArray(this.allBlueprints) ? this.allBlueprints.reduce((sum, bp) => sum + (bp.views || 0), 0) : 0;
        this.totalDownloads = Array.isArray(this.allBlueprints) ? this.allBlueprints.reduce((sum, bp) => sum + (bp.downloads || 0), 0) : 0;
      } catch (err) {
        this.error = err.message || '加载蓝图失败';
        // 出错时确保allBlueprints是数组
        this.allBlueprints = [];
        this.userBlueprintsTotal = 0;
      } finally {
        this.loading.blueprints = false;
      }
    },
    
    // 刷新数据
    async refreshData() {
      await Promise.all([
        this.loadStats(),
        this.loadBlueprints()
      ]);
    },
    
    // 加载发现页面蓝图数据（支持分页和筛选）
    async loadDiscoverBlueprints(page = 1, filters = {}) {
      try {
        this.loading.discover = true;
        this.error = null;
        
        // 构建筛选条件
        const searchFilters = {
          search: filters.search || this.searchQuery,
          area: filters.area || this.selectedArea,
          sortBy: 'views',
          sortOrder: 'desc',
          page: page,
          limit: filters.limit || this.pageSize
        };
        
        // 使用搜索接口获取蓝图列表
        const response = await apiClient.searchBlueprints(searchFilters);
        // 确保discoverBlueprints始终是数组
        this.discoverBlueprints = Array.isArray(response.data?.items) ? response.data.items : [];
        // 更新总条数
        this.total = response.data?.total || 0;
        // 更新当前页码
        this.currentPage = page;
        // 更新搜索和筛选条件
        this.searchQuery = filters.search || this.searchQuery;
        this.selectedArea = filters.area || this.selectedArea;
      } catch (err) {
        this.error = err.message || '加载蓝图失败';
        console.error('加载发现页面蓝图失败:', err);
        // 出错时确保discoverBlueprints是数组
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
    },

  }
});
