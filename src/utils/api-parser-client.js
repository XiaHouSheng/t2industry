/**
 * Parser API 客户端
 * 对应文档：api_parser_doc.md
 * Base URL 示例：http://{host}:{port}/cli
 */
class ApiParserClient {
  constructor(baseUrl = "/cli") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = null;
  }

  /** 设置 JWT token */
  setToken(token) {
    this.token = token;
  }

  /** 清理 JWT token */
  clearToken() {
    this.token = null;
  }

  /** 构建请求头 */
  getHeaders(extraHeaders = {}) {
    const headers = { ...extraHeaders };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  /** 统一响应处理（同时兼容 HTTP 状态码与业务 code） */
  async handleResponse(response) {
    let payload = null;

    try {
      payload = await response.json();
    } catch (error) {
      throw new Error("响应解析失败，请检查服务是否正常");
    }

    if (!response.ok) {
      throw new Error(payload?.msg || payload?.message || `请求失败(${response.status})`);
    }

    if (payload?.code !== 200) {
      throw new Error(payload?.msg || payload?.message || "业务请求失败");
    }

    return payload;
  }

  /**
   * 通用请求
   * @param {string} endpoint
   * @param {RequestInit} options
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, options);
      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("网络请求失败，请检查服务地址或网络连接");
      }
      throw error;
    }
  }

  /**
   * 上传图片
   * POST /upload
   * @param {File|Blob} file
   * @param {{width:number,height:number}} options
   * @returns {Promise<{code:number,msg:string,data:{image_url:string,asset_id:string,width:number,height:number}}>} 
   */
  async uploadImage(file, options = {}) {
    if (!file) {
      throw new Error("file 不能为空");
    }

    const width = Number(options.width);
    const height = Number(options.height);

    if (!Number.isInteger(width) || width <= 0) {
      throw new Error("width 必须是正整数");
    }

    if (!Number.isInteger(height) || height <= 0) {
      throw new Error("height 必须是正整数");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("width", String(width));
    formData.append("height", String(height));

    return this.request("/upload", {
      method: "POST",
      headers: this.getHeaders(),
      body: formData,
    });
  }

  /**
   * 提交解析任务
   * POST /parser
   * 至少传 asset_id 或 task_id（兼容旧字段）
   * @param {{asset_id?:string, task_id?:string}} params
   * @returns {Promise<{code:number,msg:string,data:string}>} data 为 job_id
   */
  async submitParser(params = {}) {
    const { asset_id, task_id } = params;
    const id = asset_id || task_id;

    if (!id) {
      throw new Error("asset_id 和 task_id 至少传一个");
    }

    const body = new URLSearchParams();
    if (asset_id) {
      body.append("asset_id", asset_id);
    } else {
      body.append("task_id", task_id);
    }

    return this.request("/parser", {
      method: "POST",
      headers: this.getHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body,
    });
  }

  /**
   * 查询解析结果
   * GET /parser/result
   * 推荐 job_id，兼容 task_id
   * @param {{job_id?:string, task_id?:string}} params
   */
  async getParserResult(params = {}) {
    const { job_id, task_id } = params;
    const id = job_id || task_id;

    if (!id) {
      throw new Error("job_id 和 task_id 至少传一个");
    }

    const query = new URLSearchParams();
    if (job_id) {
      query.append("job_id", job_id);
    } else {
      query.append("task_id", task_id);
    }

    return this.request(`/parser/result?${query.toString()}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * 查询当前用户任务列表
   * GET /parser/jobs
   */
  async getParserJobs() {
    return this.request("/parser/jobs", {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * 简易轮询：直到成功/失败/超时
   * @param {string} jobId
   * @param {{interval?:number, timeout?:number, onProgress?:(result:any)=>void}} options
   */
  async pollParserResult(jobId, options = {}) {
    const {
      interval = 1000,
      timeout = 60000,
      onProgress,
    } = options;

    if (!jobId) {
      throw new Error("jobId 不能为空");
    }

    const startedAt = Date.now();

    while (true) {
      const result = await this.getParserResult({ job_id: jobId });
      const status = result?.data?.status;

      if (typeof onProgress === "function") {
        onProgress(result);
      }

      if (status === "PARSE_SUCCESS" || status === "PARSE_FAILED") {
        return result;
      }

      if (Date.now() - startedAt > timeout) {
        throw new Error("轮询超时，请稍后重试");
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

const apiParserClient = new ApiParserClient();

export default apiParserClient;
export { ApiParserClient };
