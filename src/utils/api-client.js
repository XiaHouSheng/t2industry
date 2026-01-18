/**
 * API请求客户端
 * 封装了所有后端API的调用方法，方便前端使用
 */

class ApiClient {
  constructor(baseUrl = 'http://117.72.161.160') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  /**
   * 设置认证令牌
   * @param {string} token - JWT令牌
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * 构建请求头
   * @returns {Object} 请求头对象
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 处理响应
   * @param {Response} response - 响应对象
   * @returns {Promise<any>} 响应数据
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  }

  /**
   * GET请求
   * @param {string} endpoint - 接口路径
   * @param {Object} params - 查询参数
   * @returns {Promise<any>} 响应数据
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  /**
   * POST请求
   * @param {string} endpoint - 接口路径
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} 响应数据
   */
  async post(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * POST请求（文件上传）
   * @param {string} endpoint - 接口路径
   * @param {FormData} formData - 表单数据
   * @returns {Promise<any>} 响应数据
   */
  async postFile(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    return this.handleResponse(response);
  }

  /**
   * PUT请求
   * @param {string} endpoint - 接口路径
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} 响应数据
   */
  async put(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE请求
   * @param {string} endpoint - 接口路径
   * @returns {Promise<any>} 响应数据
   */
  async delete(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  /**
   * 下载文件
   * @param {string} endpoint - 接口路径
   * @returns {Promise<Blob>} 文件blob对象
   */
  async downloadFile(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('下载失败');
    }

    return await response.blob();
  }

  // ==================== 蓝图相关接口 ====================

  /**
   * 获取蓝图列表
   * @param {Object} filters - 筛选条件
   * @returns {Promise<any>} 蓝图列表
   */
  async getBlueprints(filters = {}) {
    return this.get('/api/efs/v1/blueprints', filters);
  }

  /**
   * 创建蓝图
   * @param {Object} blueprintData - 蓝图数据
   * @returns {Promise<any>} 创建的蓝图
   */
  async createBlueprint(blueprintData) {
    return this.post('/api/efs/v1/blueprints', blueprintData);
  }

  /**
   * 获取蓝图详情
   * @param {number} id - 蓝图ID
   * @returns {Promise<any>} 蓝图详情
   */
  async getBlueprintById(id) {
    return this.get(`/api/efs/v1/blueprints/${id}`);
  }

  /**
   * 更新蓝图
   * @param {number} id - 蓝图ID
   * @param {Object} blueprintData - 蓝图数据
   * @returns {Promise<any>} 更新后的蓝图
   */
  async updateBlueprint(id, blueprintData) {
    return this.put(`/api/efs/v1/blueprints/${id}`, blueprintData);
  }

  /**
   * 删除蓝图
   * @param {number} id - 蓝图ID
   * @returns {Promise<any>} 删除结果
   */
  async deleteBlueprint(id) {
    return this.delete(`/api/efs/v1/blueprints/${id}`);
  }

  /**
   * 上传蓝图文件
   * @param {number} blueprintId - 蓝图ID
   * @param {File} file - 蓝图文件
   * @returns {Promise<any>} 上传结果
   */
  async uploadBlueprint(blueprintId, file) {
    const formData = new FormData();
    formData.append('blueprintFile', file);
    formData.append('id', blueprintId);

    return this.postFile('/api/efs/v1/blueprints/upload', formData);
  }

  /**
   * 下载蓝图文件
   * @param {string} fileName - 文件名
   * @returns {Promise<Blob>} 文件blob对象
   */
  async downloadBlueprint(fileName) {
    return this.downloadFile(`/download/${fileName}`);
  }

  /**
   * 搜索蓝图
   * @param {Object} filters - 搜索条件
   * @param {string} filters.search - 搜索关键词（按名称搜索）
   * @param {string} filters.sortBy - 排序字段（例如 'views'）
   * @param {string} filters.sortOrder - 排序顺序（'asc' 或 'desc'）
   * @param {number} filters.page - 页码
   * @param {number} filters.limit - 每页数量
   * @returns {Promise<any>} 搜索结果
   */
  async searchBlueprints(filters = {}) {
    return this.get('/api/efs/v1/blueprints/search', filters);
  }

  /**
   * 获取主页数据
   * @returns {Promise<any>} 主页数据，包含总蓝图数量、总用户数、总浏览量、总下载数量、热门蓝图和随机蓝图
   */
  async getHomepageData() {
    return this.get('/api/efs/v1/blueprints/homepage');
  }

  /**
   * 获取用户自己的蓝图
   * @param {Object} filters - 筛选条件
   * @returns {Promise<any>} 用户的蓝图列表
   */
  async getUserBlueprints(filters = {}) {
    return this.get('/api/efs/v1/blueprints/self', filters);
  }

  // ==================== 用户相关接口 ====================

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<any>} 登录结果
   */
  async login(credentials) {
    return this.post('/api/efs/v1/user/login', credentials);
  }

  /**
   * 发送验证码
   * @param {Object} data - 数据
   * @param {string} data.email - 邮箱
   * @returns {Promise<any>} 发送结果
   */
  async sendVerificationCode(data) {
    return this.post('/api/efs/v1/user/send-verification-code', data);
  }

  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.password - 密码
   * @param {string} userData.nickname - 用户昵称
   * @param {string} userData.email - 用户邮箱
   * @param {string} userData.verificationCode - 验证码
   * @returns {Promise<any>} 注册结果
   */
  async register(userData) {
    // 移除role字段，确保角色固定为user
    const { role, ...dataWithoutRole } = userData;
    return this.post('/api/efs/v1/user/register', dataWithoutRole);
  }

  /**
   * 获取用户信息
   * @returns {Promise<any>} 用户信息
   */
  async getUserInfo() {
    return this.get('/api/efs/v1/user/info');
  }

  /**
   * 验证Token
   * @returns {Promise<any>} 验证结果
   */
  async validateToken() {
    return this.get('/api/efs/v1/user/validate');
  }

  // ==================== 模拟相关接口 ====================
  // 注意：模拟相关接口尚未实现

  // ==================== 计算相关接口 ====================
  // 注意：计算相关接口尚未实现

  // ==================== 数据查询接口 ====================

  /**
   * 获取机器列表
   * @param {Object} filters - 筛选条件
   * @returns {Promise<any>} 机器列表
   */
  async getMachines(filters = {}) {
    return this.get('/api/efs/v1/data/machines', filters);
  }

  /**
   * 获取配方列表
   * @param {Object} filters - 筛选条件
   * @returns {Promise<any>} 配方列表
   */
  async getRecipes(filters = {}) {
    return this.get('/api/efs/v1/data/recipes', filters);
  }

  /**
   * 获取材料列表
   * @returns {Promise<any>} 材料列表
   */
  async getMaterials() {
    return this.get('/api/efs/v1/data/materials');
  }
}

// 导出单例实例
const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };
