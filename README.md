# t2industry ｜ 塔卫二工业

一个面向《明日方舟：终末地》玩家的蓝图工具站，提供 **蓝图编辑、解析、分享与管理** 能力。  
前端主工程目录：`EndfieldSimulation`

<div align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-42b883" alt="Vue" />
  <img src="https://img.shields.io/badge/Vite-7.x-646cff" alt="Vite" />
  <img src="https://img.shields.io/badge/Pinia-3.x-f7c948" alt="Pinia" />
  <img src="https://img.shields.io/badge/GridStack-12.x-ff8c00" alt="GridStack" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT" />
</div>

---

## ✨ 项目亮点

- 可视化蓝图编辑器（机器 / 传送带 / 管道）
- 多模块分区管理（part0、part1...）
- 本地蓝图保存 + 远程蓝图加载
- 蓝图广场（发现 / 热门 / 个人）
- 玩家向截图解析页（上传截图 -> 解析 -> 下载蓝图 JSON）

---

## 🧩 主要功能模块

### 1. 蓝图编辑（`/editor/:hashCode?`）
- 基于 GridStack 的网格拖拽编辑
- 支持框选、批量移动、批量删除
- 支持缩放与右键拖动画布
- 支持蓝图导入 / 导出 / 本地存储

### 2. 蓝图解析（`/parser`）
- 上传游戏截图并提交解析
- 自动轮询 / 手动刷新解析状态
- 支持历史任务查看
- 对成功任务支持蓝图 JSON 下载（含文件名输入）

### 3. 蓝图广场（`/home`）
- 首页推荐与站点统计
- 发现页搜索、筛选、分页
- 个人页管理蓝图（上传、编辑、删除）

### 4. 用户系统
- 登录 / 注册 / 验证码
- Token 校验与用户信息加载

---

## 🛠 技术栈

- **框架**：Vue 3
- **构建**：Vite 7
- **状态管理**：Pinia
- **UI**：Element Plus + wrapper-v1（自定义封装组件）
- **路由**：Vue Router
- **网格系统**：GridStack

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm >= 7

### 安装依赖
```bash
cd EndfieldSimulation
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建与预览
```bash
npm run build
npm run preview
```

### GitHub Pages 构建
```bash
npm run github
```

---

## 🗺 路由一览

- `/home`：主页
- `/home/discover`：发现蓝图
- `/home/self`：个人蓝图
- `/editor/:hashCode?`：蓝图编辑器
- `/parser`：截图解析
- `/calculate`：预留页面

---

## 📁 目录结构（精简）

```text
EndfieldSimulation/
├─ src/
│  ├─ components/
│  │  ├─ simulation/         # 模拟与机器组件
│  │  ├─ original/           # 原业务组件
│  │  └─ ui/wrapper-v1/      # 自定义 UI 封装
│  ├─ paegs/                 # 页面（目录名当前为 paegs）
│  ├─ stores/                # Pinia store
│  ├─ utils/                 # 工具与 API 客户端
│  ├─ routers/               # 路由配置
│  └─ main.js
├─ api_documentation.md      # 主业务 API 文档
├─ api_parser_doc.md         # 解析服务 API 文档
└─ README.md
```

---

## 🔌 API 说明

- 主业务接口客户端：`src/utils/api-client.js`
- 解析业务接口客户端：`src/utils/api-parser-client.js`

文档：
- `api_documentation.md`
- `api_parser_doc.md`

---

## 🧑‍💻 开发约定

### 新增机器组件流程
1. 在 `src/components/simulation/` 新建组件
2. 在 `src/utils/MachineComponentMap.js` 注册组件映射
3. 在 `src/utils/MachineMap.js` 添加名称映射
4. 在 `src/utils/data/machine.json` 补充机器数据

### 代码建议
- 组件命名：PascalCase
- 保持页面交互文案玩家友好
- 优先复用 `wrapper-v1` 组件体系

---

## ❓常见问题

### Q1：为什么编辑器没加载到本地蓝图？
仅当浏览器中存在 `localStorage.blueprint` 时才会自动加载。

### Q2：如何打开指定远程蓝图？
访问：`/editor/<hashCode>`。

### Q3：解析接口本地开发遇到跨域怎么办？
本地开发通过 Vite `server.proxy` 代理 `/cli` 请求到解析服务。

---

## 🤝 贡献

欢迎 Issue / PR。

```bash
git checkout -b feature/your-feature
# coding...
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License，详见 [LICENSE](./LICENSE)

## ⚠️ 免责声明

本项目为非官方玩家工具，与《明日方舟：终末地》官方无直接隶属关系。游戏相关素材版权归原权利方所有。


