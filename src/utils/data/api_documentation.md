# 接口文档

## 1. 蓝图相关接口

### 1.1 获取蓝图列表
- **接口路径**: `/api/efs/v1/blueprints`
- **请求方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | --- | --- | --- | --- |
  | area | string | 否 | 按地区筛选蓝图 |
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 1,
        "name": "基础生产蓝图",
        "description": "包含基础的资源生产机器",
        "createdAt": "2026-01-10",
        "lastEdited": "2026-01-12",
        "area": "四号谷地",
        "thumbnail": "url",
        "creator": {
          "id": 1,
          "name": "username"
        }
      }
    ]
  }
  ```

### 1.2 创建蓝图
- **接口路径**: `/api/efs/v1/blueprints`
- **请求方法**: `POST`
- **请求头**: 需要认证
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **请求体**:
  ```json
  {
    "name": "新蓝图名称",
    "description": "蓝图描述",
    "area": "四号谷地"
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 2,
      "name": "新蓝图名称",
      "description": "蓝图描述",
      "createdAt": "2026-01-14",
      "lastEdited": "2026-01-14",
      "area": "四号谷地",
      "creator": {
        "id": 1,
        "name": "username"
      }
    }
  }
  ```

### 1.3 获取蓝图详情
- **接口路径**: `/api/efs/v1/blueprints/{id}`
- **请求方法**: `GET`
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "基础生产蓝图",
      "description": "包含基础的资源生产机器",
      "createdAt": "2026-01-10",
      "lastEdited": "2026-01-12",
      "area": "四号谷地",
      "thumbnail": "url",
      "creator": {
        "id": 1,
        "name": "username"
      }
    }
  }
  ```

### 1.4 更新蓝图
- **接口路径**: `/api/efs/v1/blueprints/{id}`
- **请求方法**: `PUT`
- **请求头**: 需要认证
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **特殊认证**：系统会验证发起请求的用户是否为蓝图的所有者，只有蓝图所有者才能更新蓝图
- **请求体**:
  ```json
  {
    "name": "更新后的蓝图名称",
    "description": "更新后的描述",
    "area": "四号谷地"
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "更新后的蓝图名称",
      "description": "更新后的描述",
      "createdAt": "2026-01-10",
      "lastEdited": "2026-01-14",
      "area": "四号谷地",
      "creator": {
        "id": 1,
        "name": "username"
      }
    }
  }
  ```

### 1.5 删除蓝图
- **接口路径**: `/api/efs/v1/blueprints/{id}`
- **请求方法**: `DELETE`
- **请求头**: 需要认证
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **特殊认证**：系统会验证发起请求的用户是否为蓝图的所有者，只有蓝图所有者才能删除蓝图
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success"
  }
  ```

### 1.6 上传蓝图
- **接口路径**: `/api/efs/v1/blueprints/upload`
- **请求方法**: `POST`
- **请求头**: 需要认证
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **请求体**: `multipart/form-data`
  | 参数名 | 类型 | 必填 | 描述 |
  | --- | --- | --- | --- |
  | blueprintFile | file | 是 | 蓝图文件 (仅支持JSON文件) |
  | id | number | 是 | 蓝图ID (用于指定要更新的蓝图) |
- **特殊逻辑**：系统会检查指定的蓝图ID是否存在且属于当前用户，然后上传文件并更新数据库中的md5值和浏览者列表
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 103,
      "fileHash": "new_file_hash",
      "lastEdited": "2026-01-14"
    }
  }
  ```

### 1.7 下载蓝图
- **接口路径**: `/download/{fileName}`
- **请求方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | --- | --- | --- | --- |
  | fileName | string | 是 | 文件名 (蓝图文件的MD5哈希值 + .json) |
- **响应数据**: 蓝图文件 (JSON格式)

## 2. 模拟相关接口

### 2.1 保存模拟配置
- **接口路径**: `/api/simulation/save`
- **请求方法**: `POST`
- **请求体**:
  ```json
  {
    "name": "模拟配置名称",
    "description": "配置描述",
    "data": { /* 模拟配置数据 */ }
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "模拟配置名称",
      "description": "配置描述",
      "createdAt": "2026-01-14"
    }
  }
  ```

### 2.2 获取模拟配置列表
- **接口路径**: `/api/simulation/configs`
- **请求方法**: `GET`
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 1,
        "name": "模拟配置名称",
        "description": "配置描述",
        "createdAt": "2026-01-14"
      }
    ]
  }
  ```

### 2.3 获取模拟配置详情
- **接口路径**: `/api/simulation/configs/{id}`
- **请求方法**: `GET`
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "模拟配置名称",
      "description": "配置描述",
      "createdAt": "2026-01-14",
      "data": { /* 模拟配置数据 */ }
    }
  }
  ```

## 3. 计算相关接口

### 3.1 执行生产计算
- **接口路径**: `/api/calculate/production`
- **请求方法**: `POST`
- **请求体**:
  ```json
  {
    "recipeId": "recipe_1",
    "targetOutput": 100, /* 目标产量 */
    "inputMaterials": { /* 输入材料配置 */ }
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "requiredMachines": [ /* 所需机器列表 */ ],
      "materialConsumption": { /* 材料消耗 */ },
      "energyConsumption": 1000, /* 能量消耗 */
      "productionTime": 3600 /* 生产时间(秒) */
    }
  }
  ```

## 4. 数据查询接口

### 4.1 获取机器列表
- **接口路径**: `/api/data/machines`
- **请求方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | --- | --- | --- | --- |
  | type | string | 否 | 机器类型筛选 |
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": "machine_1",
        "name": "粉碎机",
        "type": "crusher",
        "energyConsumption": 100,
        "output": 2,
        "recipes": ["recipe_1", "recipe_2"]
      }
    ]
  }
  ```

### 4.2 获取配方列表
- **接口路径**: `/api/data/recipes`
- **请求方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | --- | --- | --- | --- |
  | machineType | string | 否 | 按机器类型筛选 |
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": "recipe_1",
        "name": "石料粉碎",
        "input": {
          "stone": 1
        },
        "output": {
          "crushedStone": 2
        },
        "machineType": "crusher",
        "time": 2 /* 生产时间(秒) */
      }
    ]
  }
  ```

### 4.3 获取材料列表
- **接口路径**: `/api/data/materials`
- **请求方法**: `GET`
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": "stone",
        "name": "石料",
        "type": "raw",
        "description": "基础建筑材料"
      }
    ]
  }
  ```

## 5. 用户相关接口

### 5.1 用户登录
- **接口路径**: `/api/efs/v1/user/login`
- **请求方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "jwt_token",
      "user": {
        "id": 1,
        "username": "user1",
        "nickname": "用户1",
        "role": "admin"
      }
    }
  }
  ```
- **说明**: 登录成功后，token会被自动设置到cookie中，后续请求会自动携带token，无需手动在请求头中添加。

### 5.2 用户注册
- **接口路径**: `/api/efs/v1/user/register`
- **请求方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "newuser",
    "password": "password123",
    "nickname": "新用户",
    "role": "user" // 可选，默认值为"user"，可选值："user", "admin"
  }
  ```
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 2,
      "username": "newuser",
      "nickname": "新用户",
      "role": "user"
    }
  }
  ```

### 5.3 获取用户信息
- **接口路径**: `/api/efs/v1/user/info`
- **请求方法**: `GET`
- **请求头**:
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "username": "user1",
      "nickname": "用户1",
      "role": "admin",
      "blueprintCount": 5,
      "uploadedBlueprintCount": 2
    }
  }
  ```

### 5.4 验证Token
- **接口路径**: `/api/efs/v1/user/validate`
- **请求方法**: `GET`
- **请求头**:
  | 头名称 | 值 |
  | --- | --- |
  | Authorization | Bearer jwt_token (可选，默认从cookie获取) |
- **响应数据**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "valid": true,
      "userId": 1,
      "username": "user1",
      "role": "admin"
    }
  }
  ```

## 6. 接口统一响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": { /* 响应数据 */ }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## 7. 错误码说明

| 错误码 | 说明 |
| --- | --- |
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 501 | 接口未实现 |

## 8. 角色管理说明

### 8.1 角色类型

| 角色 | 描述 | 权限范围 |
| --- | --- | --- |
| user | 普通用户 | 可以上传和管理自己的蓝图，查看公开的蓝图和数据 |
| admin | 管理员 | 拥有所有权限，包括管理用户、删除任意蓝图等 |

### 8.2 基于角色的访问控制

系统使用角色中间件实现基于角色的访问控制，具体使用方式如下：

1. **管理员权限**：使用 `RoleMiddleware.isAdmin()` 中间件，仅允许管理员访问
2. **普通用户权限**：使用 `RoleMiddleware.isUser()` 中间件，允许普通用户和管理员访问
3. **自定义角色权限**：使用 `RoleMiddleware.hasRole('role1', 'role2')` 中间件，允许指定角色访问

### 8.3 权限示例

#### 仅管理员可访问的接口
```javascript
// 示例：管理员才能删除用户
this.router.delete('/users/:id', this.authMiddleware, RoleMiddleware.isAdmin(), this.userController.deleteUser.bind(this.userController));
```

#### 普通用户可访问的接口
```javascript
// 示例：普通用户可以上传蓝图
this.router.post('/upload', this.authMiddleware, RoleMiddleware.isUser(), upload.single('blueprintFile'), this.blueprintController.uploadBlueprint.bind(this.blueprintController));
```
