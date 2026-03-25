# t2industry ｜ 塔卫二工业

> 基于《明日方舟：终末地》的工业蓝图编辑与分享工具。  
> 前端项目目录：`EndfieldSimulation`

<div align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-42b883" alt="Vue" />
  <img src="https://img.shields.io/badge/Vite-7.x-646cff" alt="Vite" />
  <img src="https://img.shields.io/badge/Pinia-3.x-f7c948" alt="Pinia" />
  <img src="https://img.shields.io/badge/GridStack-12.x-ff8c00" alt="GridStack" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT" />
</div>

## 项目简介

`t2industry` 是一个面向《明日方舟：终末地》工业玩法的可视化工具，支持：

- 蓝图编辑（机器、传送带、管道）
- 模块化分区管理
- 蓝图导入 / 导出 / 本地保存
- 在线蓝图库浏览与分享
- 基础账号能力（登录、注册、个人蓝图）

当前仓库主要是前端工程，使用 Vue 3 + Vite 构建。

---

## 主要功能

### 1) 蓝图编辑器

- 网格化拖拽编辑（GridStack）
- 支持机器、传送带、管道快速放置
- 选择/框选/批量删除/批量移动
- 缩放、右键拖动画布
- 图层显示开关（机器/传送带/管道/接口）

### 2) 模块管理

- `part0 / part1 / ...` 多模块拆分
- 模块显示与编辑切换
- 模块代码（备注）编辑

### 3) 蓝图能力

- 本地蓝图自动读取（无 hashCode 时）
- 远程蓝图加载（`/editor/:hashCode?`）
- JSON 导入导出

### 4) 蓝图广场与用户能力

- 首页/发现页/个人页
- 蓝图列表、搜索、热门/随机推荐
- 登录、注册、用户信息、Token 校验

---

## 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite 7
- **状态管理**：Pinia
- **网格编辑**：GridStack
- **UI 组件**：Element Plus + Radix Vue（封装）
- **路由**：Vue Router

---

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装与运行

```bash
# 1) 进入项目目录
cd EndfieldSimulation

# 2) 安装依赖
npm install

# 3) 启动开发环境
npm run dev
```

### 构建与预览

```bash
# 构建生产包
npm run build

# 本地预览
npm run preview
```

### GitHub Pages 构建（带 base）

```bash
npm run github
```

---

## 路由说明

- `/home`：主页
- `/home/discover`：发现蓝图
- `/home/self`：个人蓝图
- `/calculate`：配平页面（预留）
- `/editor/:hashCode?`：蓝图编辑器（可选远程 hashCode）

---

## 项目结构（精简）

```text
EndfieldSimulation/
├─ src/
│  ├─ components/
│  │  ├─ simulation/          # 机器、传送带、管道等核心组件
│  │  ├─ original/            # 原有业务组件（配方/仓库）
│  │  └─ ui/wrapper-v1/       # UI 二次封装
│  ├─ paegs/                  # 页面（注：目录名为 paegs）
│  ├─ stores/                 # Pinia 状态
│  ├─ utils/                  # 工具层、数据映射、API 客户端
│  ├─ routers/                # 路由
│  ├─ App.vue
│  └─ main.js
├─ api_documentation.md       # 接口文档
├─ package.json
└─ README.md
```

---

## 开发说明

### 新增机器组件

1. 在 `src/components/simulation/` 新建组件（如 `NewMachine.vue`）
2. 在 `src/utils/MachineComponentMap.js` 注册懒加载映射
3. 在 `src/utils/MachineMap.js` 增加名称映射
4. 在 `src/utils/data/machine.json` 补充机器配置

### API 对接

统一通过：`src/utils/api-client.js` 访问后端。  
详细接口请查看：`api_documentation.md`

---

## 常见问题

### 1) 编辑器打开后没有本地蓝图？

- 仅在浏览器存在 `localStorage.blueprint` 时会自动加载
- 可通过“导入蓝图”上传 JSON

### 2) 远程蓝图如何加载？

访问：`/editor/<hashCode>`，页面会自动请求并加载对应蓝图。

### 3) 构建后资源路径错乱？

- 普通部署使用 `npm run build`
- 若部署到 GitHub Pages 子路径，请使用 `npm run github`

---

## 贡献指南

欢迎提交 Issue / PR。

```bash
git checkout -b feature/your-feature
# coding...
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 许可证

本项目使用 [MIT License](./LICENSE)。

## 免责声明

本项目为非官方工具，与《明日方舟：终末地》官方无直接隶属关系。游戏相关素材与内容版权归其权利方所有。

