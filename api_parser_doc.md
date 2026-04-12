# T2 Industry Parser Backend API 文档

## 1. 基础信息

- **Base URL**: `http://{host}:{port}/cli`
- **认证方式**: `Authorization: Bearer <token>`
- **返回结构**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 常见 code

- `200`: 成功
- `400`: 参数错误
- `401`: 未登录或登录过期
- `403`: 无权限
- `404`: 资源不存在
- `409`: 业务状态冲突
- `429`: 请求频繁
- `500`: 服务端异常

---

## 2. 接口目录

1. `POST /upload` 上传图片并创建资产（Asset）
2. `POST /parser` 基于资产创建解析任务（Job）
3. `GET /parser/result` 查询任务结果
4. `GET /parser/jobs` 查询当前用户所有任务 ID

---

## 3. 数据模型说明

### 3.1 Asset（图片资产）

- `asset_id`: 图片资源ID
- `image_url`: 可访问图片地址
- `width`: 蓝图宽度（前端上传传入）
- `height`: 蓝图高度（前端上传传入）

### 3.2 Parse Job（解析任务）

- `job_id`: 解析任务ID
- `asset_id`: 关联的图片资源ID
- `status`: `PARSE_WAIT | PARSE_PROCESSING | PARSE_SUCCESS | PARSE_FAILED`
- `parse_result`: 解析结果
- `error_msg`: 错误信息

---

## 4. 详细接口

## 4.1 上传图片并创建资产

- **URL**: `POST /upload`
- **鉴权**: 需要
- **Content-Type**: `multipart/form-data`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| file | File | 是 | 图片文件 |
| width | Integer | 是 | 蓝图宽度，必须 > 0 |
| height | Integer | 是 | 蓝图高度，必须 > 0 |

### 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "image_url": "http://localhost:8080/cli/temp/xxx.png",
    "asset_id": "2f7e0f0f-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "width": 1920,
    "height": 1080
  }
}
```

### 失败示例

- `400`: 文件为空 / width 非正整数 / height 非正整数
- `401`: 未登录

---

## 4.2 提交解析任务

- **URL**: `POST /parser`
- **鉴权**: 需要
- **说明**: 新接口推荐传 `asset_id`；兼容旧字段 `task_id`（按 `asset_id` 处理）

### 请求参数（form 或 query）

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| asset_id | String | 否 | 资产ID（推荐） |
| task_id | String | 否 | 兼容字段，等同 asset_id |

> `asset_id` 与 `task_id` 至少传一个。

### 成功响应

```json
{
  "code": 200,
  "msg": "已加入解析队列！",
  "data": "b89f30d8-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

> `data` 即 `job_id`。

### 失败说明

- `400`: `asset_id 不能为空`
- `401`: 未登录
- `403`: 无权操作该图片资源
- `404`: 图片资源不存在或已过期
- `409`: 资源缺少图片路径，无法解析
- `429`: 请求频繁

---

## 4.3 查询解析结果

- **URL**: `GET /parser/result`
- **鉴权**: 需要
- **说明**: 推荐传 `job_id`；兼容旧字段 `task_id`（按 `job_id` 处理）

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| job_id | String | 否 | 任务ID（推荐） |
| task_id | String | 否 | 兼容字段，等同 job_id |

> `job_id` 与 `task_id` 至少传一个。

### 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "job_id": "b89f30d8-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "task_id": "b89f30d8-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "asset_id": "2f7e0f0f-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "status": "PARSE_SUCCESS",
    "image_url": "http://localhost:8080/cli/temp/xxx.png",
    "width": 1920,
    "height": 1080,
    "parse_result": "...",
    "error_msg": null,
    "create_time": "2026-03-23T10:00:00.000+08:00",
    "update_time": "2026-03-23T10:00:05.000+08:00"
  }
}
```

---

## 4.4 查询当前用户任务列表

- **URL**: `GET /parser/jobs`
- **鉴权**: 需要
- **说明**: 返回当前用户的 `job_id` 列表（按时间倒序）

### 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "job_ids": [
      "job-id-3",
      "job-id-2",
      "job-id-1"
    ],
    "total": 3
  }
}
```

### 备注

- 当前默认每个用户最多保留最近 `15` 条任务
- 配置项：`security.parse.max-jobs-per-user`

---

## 5. cURL 示例

### 5.1 上传

```bash
curl -X POST "http://localhost:8080/cli/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@./test.png" \
  -F "width=1920" \
  -F "height=1080"
```

### 5.2 提交解析

```bash
curl -X POST "http://localhost:8080/cli/parser" \
  -H "Authorization: Bearer <token>" \
  -d "asset_id=<asset_id>"
```

### 5.3 查询结果

```bash
curl "http://localhost:8080/cli/parser/result?job_id=<job_id>" \
  -H "Authorization: Bearer <token>"
```

### 5.4 查询任务列表

```bash
curl "http://localhost:8080/cli/parser/jobs" \
  -H "Authorization: Bearer <token>"
```
