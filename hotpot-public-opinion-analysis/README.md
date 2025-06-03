# 热搜舆论分析系统

## 项目概述

聚合微博、B站、抖音等平台的实时热搜数据，进行情感分析与可视化，提供统一的热点浏览与深度解读体验。

## 目录结构

```
hotpot-public-opinion-analysis/
├── config/                   # 全局配置（mongoUri、爬取 topN、cron 等）
├── data/                     # 本地数据备份
├── docs/                     # 文档资料（API.md、模块职责）
├── src/                      # 后端核心逻辑
│   ├── parsers/             # 各平台解析器
│   ├── scrapers/            # 各平台爬虫脚本
│   ├── scheduler.js         # 调度入口：抓取→解析→存储
│   ├── index.js             # 统一解析入口
│   └── db.js                # MongoDB 连接与写入（覆盖式写入最新快照）
├── server/                   # Express API 服务
│   └── index.js             # HTTP 接口：/api/hotspots、/api/hotspots/:id
├── docker-compose.yml       # MongoDB 容器化运行
└── frontend/                 # React 前端应用
    ├── public/
    ├── src/
    │   ├── api.js           # axios 封装
    │   ├── components/      # 公共组件（卡片、加载、错误提示）
    │   └── pages/           # 列表页、详情页
    └── package.json
```

## 环境依赖

* Node.js 16+
* Docker + Docker Compose（可选）

## 后端

1. **启动 MongoDB**

   ```bash
   docker-compose up -d
   ```
2. **配置 `config/config.json`**

   ```json
   {
     "mongoUri": "mongodb://localhost:27017/yourDbName",
     "topN": 80,
     "cron": "0 */1 * * *"
   }
   ```
3. **运行调度爬虫（写入最新快照）**

   ```bash
   node src/scheduler.js
   ```
4. **启动 API 服务**

   ```bash
   npm install express mongodb
   node server/index.js
   ```

   服务启动后监听 `http://localhost:5000`，提供：

   * `GET /api/hotspots?platform=<all|weibo|bilibili|douyin>`
   * `GET /api/hotspots/:id`

## 前端

1. **切换到前端目录**

   ```bash
   cd frontend
   npm install
   ```
2. **设置代理**
   在 `frontend/package.json` 中添加：

   ```json
   "proxy": "http://localhost:5000"
   ```
3. **启动 React 应用**

   ```bash
   npm start
   ```

   访问 `http://localhost:3000` 即可。

## 已完成 (Day05)

* React 前端骨架（Create React App + Router）
* 列表页 & 详情页开发
* axios 全局封装，前后端接口对接
* 平台筛选、加载更多、空状态处理
* 过滤空标题、去重、时间兜底
* 趋势图占位 & AI 摘要兜底

## 待完成 (Day06)

1. **热度趋势折线图**（对接 `/api/hotspots/:id/trends`）
2. **热评 Top5 & 情感分析**（POST `/api/sentiment/analyze`）
3. **样式美化 & 响应式布局**
4. **单元测试 & 文档完善**

---

*文档持续更新中，更多细节请参考 `docs/API.md`*
