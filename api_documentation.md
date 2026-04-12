# T2Industry Backend API 文档

## 基础信息

- **Base URL**: `http://localhost:5000/api/efs/v1`
- **Content-Type**: `application/json`

## 响应格式

所有接口返回统一的 JSON 格式：

```json
{
    "code": 200,
    "data": { ... },
    "msg": "success"
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功，正常返回数据 |
| 400 | 请求参数错误/格式不正确 |
| 401 | 未登录/登录过期/身份验证失败 |
| 403 | 权限不足，禁止访问 |
| 404 | 资源不存在/接口路径错误 |
| 429 | 过多请求，请求频率超过限制 |
| 500 | 服务器内部错误（代码异常） |
| 501 | 服务器不支持该请求方法/功能未实现 |

---

## 认证模块

### 1. 用户登录

**POST** `/auth/login`

**限流**: 5次/分钟

**请求体**:
```json
{
    "username": "string (4-50字符，字母数字下划线)",
    "password": "string (4-50字符)"
}
```

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: empty or invalid request body / username and password are required / Invalid username / Invalid password
- `401`: username or password is incorrect
- `403`: username or password is incorrect (用户不存在或被禁用)

**Cookie**: 登录成功后自动设置 `token` Cookie (HttpOnly, 7天有效期)

---

### 2. 用户注册

**POST** `/auth/register`

**限流**: 5次/分钟

**请求体**:
```json
{
    "username": "string (4-50字符，字母数字下划线)",
    "password": "string (4-50字符，非空)",
    "nickname": "string (2-50字符，字母数字下划线中文)",
    "email": "string (有效邮箱格式)",
    "code": "string (6位数字验证码)"
}
```

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "username": "testuser",
        "nickname": "测试用户",
        "role": "user",
        "blueprint_count": 0
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: empty or invalid request body / invalid request body / Invalid username / Invalid password / Invalid nickname / Invalid email / Invalid code / Invalid code or expired code
- `500`: Register failed, please try again

---

### 3. 发送验证码

**POST** `/auth/send-captcha`

**限流**: 3次/分钟

**请求体**:
```json
{
    "email": "string (有效邮箱格式)"
}
```

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "success": true
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: empty or invalid request body / invalid request body / Invalid email / Email already exists
- `500`: Send code failed, please try again

---

## 蓝图模块

### 1. 获取蓝图列表

**GET** `/blueprints`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| area | string | 否 | 区域筛选: `四号谷地` 或 `武陵`，不传则查询全部 |
| sortBy | string | 是 | 排序字段: `views` |
| sortOrder | string | 是 | 排序方向: `asc` 或 `desc` |
| page | int | 否 | 页码，默认 1 |
| limit | int | 否 | 每页数量，默认 10，最大 30 |

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "items": [
            {
                "id": 1,
                "name": "蓝图名称",
                "description": "蓝图描述",
                "area": "四号谷地",
                "thumbnail": null,
                "views": 100,
                "downloads": 10,
                "file_hash": "abc123def456789abc123def456789ab",
                "bili_href": "BV1234567890",
                "created_at": "2024-01-01",
                "last_edited": "2024-01-01",
                "editor": "用户昵称"
            }
        ],
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: page and limit must be integers / page and limit must be greater than 0 / sortOrder must be 'asc' or 'desc' / sortBy must be 'views' / area must be '四号谷地', or '武陵'

---

### 2. 创建蓝图

**POST** `/blueprints`

**需要认证**: Cookie Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 蓝图名称 (2-50字符，字母数字下划线中文) |
| description | string | 是 | 蓝图描述 (2-50字符，字母数字下划线中文) |
| area | string | 是 | 区域: `四号谷地` 或 `武陵` |
| biliHref | string | 否 | B站BV号 (格式: BV + 10位字母数字) |
| fileHash | string | 是 | 文件哈希 (32位十六进制) |

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "name": "蓝图名称",
        "description": "蓝图描述",
        "area": "四号谷地",
        "thumbnail": null,
        "views": 0,
        "downloads": 0,
        "file_hash": "abc123def456789abc123def456789ab",
        "bili_href": null,
        "created_at": "2024-01-01",
        "last_edited": "2024-01-01",
        "editor": "用户昵称"
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: name, description, area, and fileHash are required / name must be 2-50 characters... / description must be 2-50 characters... / area must be '四号谷地', or '武陵' / biliHref must be a valid BV hash / Invalid file hash / File not found / You have already created this blueprint
- `401`: User not found or disabled
- `403`: User not authenticated
- `500`: Failed to create blueprint

---

### 3. 获取蓝图详情

**GET** `/blueprints/{id}`

**路径参数**:
- `id`: 蓝图ID (整数)

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "name": "蓝图名称",
        "description": "蓝图描述",
        "area": "四号谷地",
        "thumbnail": null,
        "views": 100,
        "downloads": 10,
        "file_hash": "abc123def456789abc123def456789ab",
        "bili_href": "BV1234567890",
        "created_at": "2024-01-01",
        "last_edited": "2024-01-01",
        "editor": "用户昵称"
    },
    "msg": "success"
}
```

**错误响应**:
- `404`: Blueprint not found

---

### 4. 更新蓝图

**PUT** `/blueprints/{id}`

**需要认证**: Cookie Token

**路径参数**:
- `id`: 蓝图ID (整数)

**请求体** (所有字段可选):
```json
{
    "name": "string (2-50字符，字母数字下划线中文)",
    "description": "string (2-50字符)",
    "area": "string (四号谷地 或 武陵)",
    "biliHref": "string (BV号)",
    "fileHash": "string (32位十六进制)"
}
```

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "name": "更新后的名称",
        "description": "更新后的描述",
        "area": "四号谷地",
        "thumbnail": null,
        "views": 100,
        "downloads": 10,
        "file_hash": "abc123def456789abc123def456789ab",
        "bili_href": "BV1234567890",
        "created_at": "2024-01-01",
        "last_edited": "2024-01-02",
        "editor": "用户昵称"
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: No data provided / name must be 2-50 characters... / description must be 2-50 characters... / area must be '四号谷地', or '武陵' / biliHref must be a valid BV hash / Invalid file hash
- `403`: User not authenticated / User not found or disabled / Permission denied
- `404`: Blueprint not found
- `500`: Failed to update blueprint

---

### 5. 删除蓝图

**DELETE** `/blueprints/{id}`

**需要认证**: Cookie Token

**路径参数**:
- `id`: 蓝图ID (整数)

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "name": "已删除的蓝图",
        "description": "描述",
        "area": "四号谷地",
        "thumbnail": null,
        "views": 100,
        "downloads": 10,
        "file_hash": "abc123def456789abc123def456789ab",
        "bili_href": null,
        "created_at": "2024-01-01",
        "last_edited": "2024-01-01",
        "editor": "用户昵称"
    },
    "msg": "success"
}
```

**错误响应**:
- `403`: User not authenticated / User not found or disabled / Permission denied
- `404`: Blueprint not found
- `500`: Failed to delete blueprint

---

### 6. 上传蓝图文件

**POST** `/blueprints/upload`

**需要认证**: Cookie Token

**Content-Type**: `multipart/form-data`

**请求参数**:
- `file`: JSON文件 (最大 20MB)

**成功响应**:
```json
{
    "code": 200,
    "data": "abc123def456789abc123def456789ab",
    "msg": "success"
}
```

**错误响应**:
- `400`: No file part / File must be a JSON file / Empty file / File size must be less than 20MB
- `403`: User not authenticated / User not found or disabled
- `500`: Failed to upload blueprint

---

### 7. 下载蓝图文件

**GET** `/blueprints/download/{file_hash}`

**路径参数**:
- `file_hash`: 文件哈希 (32位十六进制)

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "key1": "value1",
        "key2": "value2"
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: Invalid file hash
- `500`: Failed to download blueprint

---

### 8. 搜索蓝图

**GET** `/blueprints/search`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 蓝图名称关键词 |
| sortBy | string | 否 | 排序字段: `views` (默认) |
| sortOrder | string | 否 | 排序方向: `asc` 或 `desc` (默认) |
| page | int | 否 | 页码，默认 1 |
| limit | int | 否 | 每页数量，默认 10，最大 30 |

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "items": [
            {
                "id": 1,
                "name": "蓝图名称",
                "description": "蓝图描述",
                "area": "四号谷地",
                "thumbnail": null,
                "views": 100,
                "downloads": 10,
                "file_hash": "abc123def456789abc123def456789ab",
                "bili_href": null,
                "created_at": "2024-01-01",
                "last_edited": "2024-01-01",
                "editor": "用户昵称"
            }
        ],
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: sortBy must be 'views' / sortOrder must be 'asc' or 'desc' / page and limit must be integers / page and limit must be greater than 0 / limit must be less than 30

---

### 9. 获取主页数据

**GET** `/blueprints/homepage`

**缓存**: 60秒

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "total_blueprints": 1000,
        "total_users": 500,
        "total_views": 50000,
        "total_downloads": 5000,
        "top_8_blueprints": [
            {
                "id": 1,
                "name": "热门蓝图",
                "description": "描述",
                "area": "四号谷地",
                "thumbnail": null,
                "views": 1000,
                "downloads": 100,
                "file_hash": "abc123def456789abc123def456789ab",
                "bili_href": null,
                "created_at": "2024-01-01",
                "last_edited": "2024-01-01",
                "editor": "用户昵称"
            }
        ]
    },
    "msg": "success"
}
```

---

### 10. 获取个人蓝图

**GET** `/blueprints/self`

**需要认证**: Cookie Token

**缓存**: 60秒

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sortBy | string | 否 | 排序字段: `views` (默认) |
| sortOrder | string | 否 | 排序方向: `asc` 或 `desc` (默认) |
| page | int | 否 | 页码，默认 1 |
| limit | int | 否 | 每页数量，默认 10，最大 30 |

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "items": [
            {
                "id": 1,
                "name": "我的蓝图",
                "description": "描述",
                "area": "四号谷地",
                "thumbnail": null,
                "views": 100,
                "downloads": 10,
                "file_hash": "abc123def456789abc123def456789ab",
                "bili_href": null,
                "created_at": "2024-01-01",
                "last_edited": "2024-01-01",
                "editor": "用户昵称"
            }
        ],
        "total": 10,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    },
    "msg": "success"
}
```

**错误响应**:
- `400`: sortBy must be 'views' / sortOrder must be 'asc' or 'desc' / page and limit must be integers / page and limit must be greater than 0 / limit must be less than 30
- `403`: User not authenticated / User not found or disabled

---

## 用户模块

### 1. 获取用户信息

**GET** `/user/info`

**需要认证**: Cookie Token

**缓存**: 60秒

**成功响应**:
```json
{
    "code": 200,
    "data": {
        "id": 1,
        "username": "testuser",
        "nickname": "测试用户",
        "role": "user",
        "blueprint_count": 5
    },
    "msg": "success"
}
```

**错误响应**:
- `403`: User not found or disabled

---

## 认证说明

需要认证的接口通过 Cookie 携带 Token：

```
Cookie: token=<token>
```

登录成功后，服务器会自动设置 Cookie：
- 名称: `token`
- 属性: HttpOnly
- 有效期: 7天

---

## 限流说明

| 接口 | 限流 |
|------|------|
| `/auth/login` | 5次/分钟 |
| `/auth/register` | 5次/分钟 |
| `/auth/send-captcha` | 3次/分钟 |

超过限流返回：
```json
{
    "code": 429,
    "data": null,
    "msg": "Too many requests"
}
```
