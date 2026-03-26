# T2 Industry Parser Backend API 文档

## 1. 基础信息

- **Base URL**: `http://{host}:{port}/cli`
- **统一返回结构**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

- `code=200` 表示成功，其他常见错误码：`400/401/403/404/409/429/500`
- 受保护接口需携带 JWT：
  - Header: `Authorization: Bearer <token>`

---

## 2. 接口列表

1. 上传图片：`POST /upload`
2. 提交解析：`POST /parser`
3. 查询解析结果：`GET /parser/result`
4. 查询当前用户任务列表：`GET /parser/jobs`

---

## 3. 详细接口说明

## 3.1 上传图片

- **URL**: `POST /upload`
- **Content-Type**: `multipart/form-data`
- **鉴权**: 需要

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| file | File | 是 | 待上传图片 |

### 成功响应示例

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "image_url": "http://localhost:8080/cli/temp/xxx.png",
    "asset_id": "2f7e0f0f-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "task_id": "2f7e0f0f-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

> 说明：`task_id` 为兼容旧前端保留字段，当前语义等同 `asset_id`。

---

## 3.2 提交解析任务

- **URL**: `POST /parser`
- **鉴权**: 需要
- **说明**: 推荐传 `asset_id`；兼容旧参数 `task_id`（会按 `asset_id` 处理）

### 请求参数（form/query）

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| asset_id | String | 否 | 图片资产ID（推荐） |
| task_id | String | 否 | 兼容旧字段，等同 asset_id |

> `asset_id` 和 `task_id` 至少传一个。

### 成功响应示例

```json
{
  "code": 200,
  "msg": "已加入解析队列！",
  "data": "b89f30d8-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

> `data` 为 `job_id`。

### 常见失败

- `400`: `asset_id 不能为空`
- `401`: 未登录或登录过期
- `403`: 无权操作该图片资源
- `404`: 图片资源不存在或已过期
- `409`: 资源缺少图片路径，无法解析
- `429`: 请求过于频繁

---

## 3.3 查询解析结果

- **URL**: `GET /parser/result`
- **鉴权**: 需要
- **说明**: 推荐传 `job_id`；兼容旧参数 `task_id`（会按 `job_id` 处理）

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| job_id | String | 否 | 解析任务ID（推荐） |
| task_id | String | 否 | 兼容旧字段，等同 job_id |

> `job_id` 和 `task_id` 至少传一个。

### 成功响应示例

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
    "parse_result": "...",
    "error_msg": null,
    "create_time": "2026-03-23T10:00:00.000+08:00",
    "update_time": "2026-03-23T10:00:05.000+08:00"
  }
}
```

### 状态字段说明

`status` 可能值：
- `PARSE_WAIT`
- `PARSE_PROCESSING`
- `PARSE_SUCCESS`
- `PARSE_FAILED`

---

## 3.4 查询当前用户任务列表

- **URL**: `GET /parser/jobs`
- **鉴权**: 需要
- **说明**: 返回当前用户的 `job_id` 列表（新到旧）

### 成功响应示例

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

- 当前配置会限制每个用户最多保留最近 N 条任务（默认 `15`）：
  - 配置项：`security.parse.max-jobs-per-user`

---

## 4. cURL 示例

### 4.1 上传

```bash
curl -X POST "http://localhost:8080/cli/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@./test.png"
```

### 4.2 提交解析

```bash
curl -X POST "http://localhost:8080/cli/parser" \
  -H "Authorization: Bearer <token>" \
  -d "asset_id=<asset_id>"
```

### 4.3 查询结果

```bash
curl "http://localhost:8080/cli/parser/result?job_id=<job_id>" \
  -H "Authorization: Bearer <token>"
```

### 4.4 查询任务列表

```bash
curl "http://localhost:8080/cli/parser/jobs" \
  -H "Authorization: Bearer <token>"
```
