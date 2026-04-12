/**
 * API请求客户端
 * 封装了所有后端API的调用方法，方便前端使用
 */
//https://api.t2blueprint.xyz 生产环境用此host
class ApiClient {
  constructor(baseUrl = "http://localhost:5000") {
    this.baseUrl = baseUrl;
    this.searchBlueprintTimer = null;
  }

  /**
   * 构建请求头
   * @param {boolean} isJson - 是否为 JSON 请求
   * @returns {Object} 请求头对象
   */
  getHeaders(isJson = true) {
    if (!isJson) return {};

    return {
      "Content-Type": "application/json",
    };
  }

  /**
   * 统一发起请求（自动携带 Cookie）
   * @param {string} endpoint - 接口路径
   * @param {RequestInit} options - fetch 配置
   * @returns {Promise<any>} 响应数据
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      credentials: "include",
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * 处理响应
   * @param {Response} response - 响应对象
   * @returns {Promise<any>} 响应数据
   */
  async handleResponse(response) {
    let data = null;

    try {
      data = await response.json();
    } catch (err) {
      if (!response.ok) {
        throw new Error(`请求失败 (${response.status})`);
      }
      return { code: 200, data: null, msg: "success" };
    }

    if (!response.ok) {
      throw new Error(
        data?.msg || data?.message || `请求失败 (${response.status})`,
      );
    }

    if (typeof data?.code === "number" && data.code !== 200) {
      throw new Error(data?.msg || "请求失败");
    }

    return data;
  }

  /**
   * 规范化蓝图数据结构（后端 snake_case -> 前端 camelCase）
   * @param {Object} blueprint - 蓝图对象
   * @returns {Object|null}
   */
  normalizeBlueprint(blueprint) {
    if (!blueprint || typeof blueprint !== "object") return null;

    const fileHash = blueprint.file_hash ?? blueprint.fileHash ?? null;
    const biliHref = blueprint.bili_href ?? blueprint.biliHref ?? null;
    const createdAt = blueprint.created_at ?? blueprint.createdAt ?? null;
    const lastEdited = blueprint.last_edited ?? blueprint.lastEdited ?? null;
    const editor = blueprint.editor ?? blueprint.creator?.name ?? null;

    return {
      ...blueprint,
      fileHash,
      biliHref,
      createdAt,
      lastEdited,
      editor,
      creator: { name: editor || "未知作者" },
    };
  }

  /**
   * 规范化分页蓝图响应
   * @param {Object} payload
   * @returns {Object}
   */
  normalizeBlueprintPagePayload(payload = {}) {
    return {
      ...payload,
      items: Array.isArray(payload.items)
        ? payload.items.map((item) => this.normalizeBlueprint(item))
        : [],
    };
  }

  /**
   * 规范化用户信息
   * @param {Object} user
   * @returns {Object|null}
   */
  normalizeUser(user) {
    if (!user || typeof user !== "object") return null;

    return {
      ...user,
      blueprintCount: user.blueprint_count ?? user.blueprintCount ?? 0,
    };
  }

  /**
   * GET请求
   * @param {string} endpoint - 接口路径
   * @param {Object} params - 查询参数
   * @returns {Promise<any>} 响应数据
   */
  async get(endpoint, params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;
      acc[key] = value;
      return acc;
    }, {});

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;

    return this.request(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * POST请求
   * @param {string} endpoint - 接口路径
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} 响应数据
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  /**
   * POST请求（文件上传）
   * @param {string} endpoint - 接口路径
   * @param {FormData} formData - 表单数据
   * @returns {Promise<any>} 响应数据
   */
  async postFile(endpoint, formData) {
    return this.request(endpoint, {
      method: "POST",
      headers: this.getHeaders(false),
      body: formData,
    });
  }

  /**
   * PUT请求
   * @param {string} endpoint - 接口路径
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} 响应数据
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE请求
   * @param {string} endpoint - 接口路径
   * @returns {Promise<any>} 响应数据
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }

  // ==================== 蓝图相关接口 ====================

  async getBlueprints(filters = {}) {
    const response = await this.get("/api/efs/v1/blueprints", filters);
    return {
      ...response,
      data: this.normalizeBlueprintPagePayload(response.data),
    };
  }

  async createBlueprint(blueprintData) {
    const response = await this.post("/api/efs/v1/blueprints", blueprintData);
    return {
      ...response,
      data: this.normalizeBlueprint(response.data),
    };
  }

  async getBlueprintById(id) {
    const response = await this.get(`/api/efs/v1/blueprints/${id}`);
    return {
      ...response,
      data: this.normalizeBlueprint(response.data),
    };
  }

  async updateBlueprint(id, blueprintData) {
    const response = await this.put(
      `/api/efs/v1/blueprints/${id}`,
      blueprintData,
    );
    return {
      ...response,
      data: this.normalizeBlueprint(response.data),
    };
  }

  async deleteBlueprint(id) {
    const response = await this.delete(`/api/efs/v1/blueprints/${id}`);
    return {
      ...response,
      data: this.normalizeBlueprint(response.data),
    };
  }

  /**
   * 上传蓝图文件
   * @param {File} file - 蓝图文件（.json）
   * @returns {Promise<any>} 上传结果（data 为 fileHash）
   */
  async uploadBlueprint(file) {
    const formData = new FormData();
    formData.append("file", file);

    return this.postFile("/api/efs/v1/blueprints/upload", formData);
  }

  /**
   * 下载蓝图文件
   * @param {string} fileHash - 文件哈希
   * @returns {Promise<any>} 文件JSON数据
   */
  async downloadBlueprint(fileHash) {
    return this.get(`/api/efs/v1/blueprints/download/${fileHash}`);
  }

  async searchBlueprints(filters = {}) {
    clearTimeout(this.searchBlueprintTimer);
    return new Promise((resolve, reject) => {
      this.searchBlueprintTimer = setTimeout(async () => {
        const searchFilters = {
          ...filters,
          name: filters.name ?? filters.search,
        };
        delete searchFilters.search;

        const response = await this.get(
          "/api/efs/v1/blueprints/search",
          searchFilters,
        );

        const result = {
          ...response,
          data: this.normalizeBlueprintPagePayload(response.data),
        };

        resolve(result)

      }, 500);
    });
  }

  async getHomepageData() {
    const response = await this.get("/api/efs/v1/blueprints/homepage");
    const homepageData = response.data || {};

    return {
      ...response,
      data: {
        totalBlueprints: homepageData.total_blueprints ?? 0,
        totalUsers: homepageData.total_users ?? 0,
        totalViews: homepageData.total_views ?? 0,
        totalDownloads: homepageData.total_downloads ?? 0,
        hotBlueprints: Array.isArray(homepageData.top_8_blueprints)
          ? homepageData.top_8_blueprints.map((item) =>
              this.normalizeBlueprint(item),
            )
          : [],
      },
    };
  }

  async getUserBlueprints(filters = {}) {
    const response = await this.get("/api/efs/v1/blueprints/self", filters);
    return {
      ...response,
      data: this.normalizeBlueprintPagePayload(response.data),
    };
  }

  // ==================== 用户相关接口 ====================

  async login(credentials) {
    return this.post("/api/efs/v1/auth/login", credentials);
  }

  async sendVerificationCode(data) {
    return this.post("/api/efs/v1/auth/send-captcha", data);
  }

  async register(userData) {
    const { verificationCode, role, ...rest } = userData;
    return this.post("/api/efs/v1/auth/register", {
      ...rest,
      code: verificationCode,
    });
  }

  async getUserInfo() {
    const response = await this.get("/api/efs/v1/user/info");
    return {
      ...response,
      data: this.normalizeUser(response.data),
    };
  }

  // ==================== 模拟相关接口 ====================
  // 注意：模拟相关接口尚未实现

  // ==================== 计算相关接口 ====================
  // 注意：计算相关接口尚未实现

  // ==================== 数据查询接口 ====================

  async getMachines(filters = {}) {
    return this.get("/api/efs/v1/data/machines", filters);
  }

  async getRecipes(filters = {}) {
    return this.get("/api/efs/v1/data/recipes", filters);
  }

  async getMaterials() {
    return this.get("/api/efs/v1/data/materials");
  }
}

// 导出单例实例
const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };
